#!/usr/bin/env python3
"""
MarkdownToJSON – Convert a multi‑article markdown file into individual JSON files
for the Singapore Resident Hub import-folder.js pipeline.

Usage:
    python markdown_to_json.py articles.md [--output content-queue]
"""

from __future__ import annotations

import argparse
import json
import logging
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import List, Optional

import markdown
from bs4 import BeautifulSoup

# --------------------------------------------------------------------------- #
#  Logging configuration
# --------------------------------------------------------------------------- #
logging.basicConfig(
    level=logging.INFO,
    format="%(levelname)s: %(message)s",
    stream=sys.stdout,
)
log = logging.getLogger(__name__)


# --------------------------------------------------------------------------- #
#  Data model
# --------------------------------------------------------------------------- #
@dataclass
class Article:
    """Represents a single article extracted from the markdown file."""

    id: str
    title: str
    slug: str
    category: str
    primary_keyword: str
    secondary_keywords: List[str] = field(default_factory=list)
    body_markdown: str = ""
    image_url: str = ""

    @property
    def tags(self) -> List[str]:
        """Merged list of primary and secondary keywords, with duplicates removed."""
        seen = set()
        tags = []
        for kw in [self.primary_keyword] + self.secondary_keywords:
            kw = kw.strip()
            if kw and kw not in seen:
                seen.add(kw)
                tags.append(kw)
        return tags


# --------------------------------------------------------------------------- #
#  Markdown → HTML conversion
# --------------------------------------------------------------------------- #
def markdown_to_html(md_text: str) -> str:
    """Convert markdown body to clean HTML, preserving typical elements."""
    return markdown.markdown(
        md_text,
        extensions=[
            "tables",          # GitHub‑style tables
            "fenced_code",     # ``` code blocks
            "codehilite",      # optional – syntax highlighting (needs Pygments)
        ],
        extension_configs={
            "codehilite": {
                "css_class": "highlight",
                "guess_lang": False,
            }
        },
    )


# --------------------------------------------------------------------------- #
#  Excerpt generation
# --------------------------------------------------------------------------- #
def generate_excerpt(html_content: str, max_chars: int = 160) -> str:
    """Extract the first paragraph of HTML and truncate to `max_chars`."""
    soup = BeautifulSoup(html_content, "html.parser")
    first_p = soup.find("p")
    if first_p is None:
        # Fallback: strip all tags and take first `max_chars` characters.
        text = soup.get_text(separator=" ", strip=True)
        return (text[:max_chars] + "...") if len(text) > max_chars else text

    text = first_p.get_text(strip=True)
    if len(text) > max_chars:
        return text[:max_chars] + "..."
    return text


# --------------------------------------------------------------------------- #
#  Article parsing
# --------------------------------------------------------------------------- #
def parse_metadata_lines(lines: List[str]) -> dict:
    """
    Parse the metadata block (lines between ARTICLE_START and the body).
    Returns a dictionary of metadata values.
    """
    metadata = {
        "Article ID": "",
        "Title": "",
        "Slug": "",
        "Category": "",
        "Primary Keyword": "",
        "Secondary Keywords": [],
        "Image URL": "",
    }

    idx = 0
    while idx < len(lines):
        line = lines[idx].strip()
        if not line:                 # blank line → metadata block ends
            idx += 1
            continue

        if ": " in line:
            key, value = line.split(": ", 1)
            key = key.strip()
            value = value.strip()

            if key == "Secondary Keywords":
                # May have values on the same line (comma‑separated)
                if value:
                    metadata["Secondary Keywords"].extend(
                        [kw.strip() for kw in value.split(",") if kw.strip()]
                    )
                # Consume continuation lines (no colon, non‑empty)
                idx += 1
                while idx < len(lines):
                    cont = lines[idx].strip()
                    if not cont or ": " in cont:
                        break
                    # Treat each non‑empty line as a keyword (unless comma‑separated)
                    keywords = [kw.strip() for kw in cont.replace(",", "\n").split("\n") if kw.strip()]
                    metadata["Secondary Keywords"].extend(keywords)
                    idx += 1
                continue  # already advanced idx past continuation lines
            else:
                # Normal key: map to our internal names
                internal_key = {
                    "Article ID": "Article ID",
                    "Title": "Title",
                    "Slug": "Slug",
                    "Category": "Category",
                    "Primary Keyword": "Primary Keyword",
                }.get(key)
                if internal_key:
                    if internal_key == "Primary Keyword":
                        metadata["Primary Keyword"] = value
                    else:
                        metadata[internal_key] = value
        idx += 1

    # If Secondary Keywords ended up empty as a list, leave as empty list
    if not isinstance(metadata["Secondary Keywords"], list):
        metadata["Secondary Keywords"] = []

    return metadata


def parse_articles(md_text: str) -> List[Article]:
    """
    Split the entire markdown file into individual articles and return a list
    of Article objects.
    """
    # Extract blocks between ARTICLE_START and ARTICLE_END
    pattern = r"<!-- ARTICLE_START -->(.*?)<!-- ARTICLE_END -->"
    blocks = re.findall(pattern, md_text, re.DOTALL)

    articles: List[Article] = []
    for block in blocks:
        # Separate metadata lines from body. Body starts after the last
        # consecutive metadata line (a line that looks like "Key: value" or
        # belongs to Secondary Keywords continuation).
        lines = block.splitlines()
        # Find where the body begins: first line that is not metadata and not blank.
        # A simple heuristic: the body begins when we encounter a line that starts
        # with '# ' (markdown heading) or after we've passed all metadata lines.
        # We'll use the parse_metadata_lines to extract metadata and capture body.
        # First, locate the index where metadata ends.
        metadata_end = 0
        # We'll re‑implement metadata detection inline to separate body.
        # It's cleaner to do a two‑pass: extract metadata as we did, then
        # the rest is body.
        # We'll scan line by line:
        #   - metadata lines: contain ': ' or are continuation of Secondary Keywords.
        #   - empty lines before body are ignored.
        #   - the first line after that is considered the start of the body.
        idx = 0
        # skip leading blank lines
        while idx < len(lines) and not lines[idx].strip():
            idx += 1

        # Parse metadata
        metadata = {}
        secondary_collecting = False
        while idx < len(lines):
            line = lines[idx].strip()
            if not line:
                idx += 1
                continue
            # Check for separator line (===) which marks end of metadata
            if line.startswith("=") and len(line) >= 10:
                idx += 1  # Skip the separator line
                break
            # Handle both ": " and ":" (colon with optional space)
            if ":" in line:
                # Split on first colon
                parts = line.split(":", 1)
                key = parts[0].strip()
                value = parts[1].strip() if len(parts) > 1 else ""
                if key == "Secondary Keywords":
                    secondary_collecting = True
                    keywords = [kw.strip() for kw in value.split(",") if kw.strip()] if value else []
                    metadata.setdefault("Secondary Keywords", []).extend(keywords)
                    idx += 1
                    continue
                else:
                    secondary_collecting = False
                    # Accept any key, but we only need specific ones
                    if key in ("Article ID", "Title", "Slug", "Category", "Primary Keyword", "Image URL"):
                        metadata[key] = value
                    # For other possible keys, ignore.
                    idx += 1
            elif secondary_collecting:
                # Continuation of Secondary Keywords – no colon
                keywords = [kw.strip() for kw in line.replace(",", "\n").split("\n") if kw.strip()]
                metadata.setdefault("Secondary Keywords", []).extend(keywords)
                idx += 1
            else:
                # Not a metadata line and not collecting secondary keywords:
                # this is the beginning of the body.
                break

        # Now `idx` points to the start of the body lines (or end of lines)
        body_lines = lines[idx:] if idx < len(lines) else []
        body = "\n".join(body_lines).strip()

        # Build Article
        article_id = metadata.get("Article ID", "")
        if not article_id:
            log.warning("Article without ID found – skipping.")
            continue

        article = Article(
            id=article_id,
            title=metadata.get("Title", ""),
            slug=metadata.get("Slug", ""),
            category=metadata.get("Category", ""),
            primary_keyword=metadata.get("Primary Keyword", ""),
            secondary_keywords=metadata.get("Secondary Keywords", []),
            body_markdown=body,
            image_url=metadata.get("Image URL", ""),
        )
        articles.append(article)

    return articles


# --------------------------------------------------------------------------- #
#  JSON serialisation & validation
# --------------------------------------------------------------------------- #
def article_to_dict(article: Article, html_content: str, excerpt: str) -> dict:
    """Convert an Article to the required JSON‑compatible dictionary."""
    data = {
        "name": article.title,
        "content": html_content,
        "excerpt": excerpt,
        "slug": article.slug,
        "tags": article.tags,
        "category": article.category,
    }
    if article.image_url:
        data["imageUrl"] = article.image_url
    return data


def validate_json(data: dict) -> bool:
    """Check that the dictionary can be serialised to valid JSON."""
    try:
        json.dumps(data, ensure_ascii=False)
        return True
    except (TypeError, ValueError) as e:
        log.error("JSON validation failed: %s", e)
        return False


# --------------------------------------------------------------------------- #
#  File output
# --------------------------------------------------------------------------- #
def write_articles_to_json(
    articles: List[Article],
    output_dir: Path,
) -> tuple[int, int]:
    """
    Convert articles to JSON and write them to `output_dir`.
    Returns (processed_count, skipped_count).
    """
    output_dir.mkdir(parents=True, exist_ok=True)
    processed = 0
    skipped = 0

    for idx, article in enumerate(articles, start=1):
        try:
            html = markdown_to_html(article.body_markdown)
            excerpt = generate_excerpt(html)
            data = article_to_dict(article, html, excerpt)

            if not validate_json(data):
                log.warning("Skipping article %s due to invalid JSON.", article.id)
                skipped += 1
                continue

            # Build filename: 001-H1.json, 002-M1.json, etc.
            filename = f"{idx:03d}-{article.id}.json"
            filepath = output_dir / filename

            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

            processed += 1
            log.info("Written: %s", filepath)

        except Exception as exc:
            log.error("Failed to process article %s: %s", article.id, exc)
            skipped += 1

    return processed, skipped


# --------------------------------------------------------------------------- #
#  CLI entry point
# --------------------------------------------------------------------------- #
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert a multi‑article markdown file into folder‑ready JSON files."
    )
    parser.add_argument(
        "markdown_file",
        type=Path,
        help="Path to the input markdown file containing articles.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("content-queue"),
        help="Output directory (default: content-queue).",
    )
    args = parser.parse_args()

    if not args.markdown_file.is_file():
        log.error("File not found: %s", args.markdown_file)
        sys.exit(1)

    # Read entire file
    try:
        md_text = args.markdown_file.read_text(encoding="utf-8")
    except Exception as exc:
        log.error("Failed to read markdown file: %s", exc)
        sys.exit(1)

    # Parse articles
    articles = parse_articles(md_text)
    log.info("Found %d article(s) in the input file.", len(articles))

    # Convert & write
    processed, skipped = write_articles_to_json(articles, args.output)

    # Final summary (matching required log output)
    print(f"\nProcessed {len(articles)} articles")
    print(f"Generated {processed} JSON files")
    print(f"Skipped {skipped}")


if __name__ == "__main__":
    main()