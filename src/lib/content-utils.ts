/**
 * Splits HTML content into two parts: 
 * 1. From the start until the end of a "Transport" related section.
 * 2. The rest of the content.
 * 
 * If no transport section is found, it returns the whole content as part 1.
 */
export function splitContentAfterTransport(content: string): { before: string; after: string } {
  if (!content) return { before: "", after: "" };

  const transportKeywords = [
    "getting to", "transport", "location", "directions", 
    "how to get", "arriving", "moving around",
    "đến", "di chuyển", "cách đi", "vị trí"
  ];

  // Look for h2 or h3 tags that contain transport keywords
  const headingRegex = /<(h[23])[^>]*>(.*?)<\/\1>/gi;
  let match;
  let transportIndex = -1;
  let nextHeadingIndex = -1;

  const matches = [];
  while ((match = headingRegex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      tag: match[1],
      text: match[2].toLowerCase(),
      fullMatch: match[0]
    });
  }

  // Find the first heading that matches transport keywords
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    if (transportKeywords.some(keyword => m.text.includes(keyword))) {
      transportIndex = i;
      break;
    }
  }

  if (transportIndex === -1) {
    return { before: content, after: "" };
  }

  // Find the end of the transport section (which is the start of the next heading of same or higher level)
  // Or just the next heading in general if it's a major section.
  const transportHeading = matches[transportIndex];
  
  // Find the next heading that is NOT a sub-heading of the current transport section
  // If transport is H2, next section is next H2. If transport is H3, next section is next H2 or H3.
  for (let i = transportIndex + 1; i < matches.length; i++) {
    const nextM = matches[i];
    if (nextM.tag === transportHeading.tag || nextM.tag === "h2") {
      nextHeadingIndex = nextM.index;
      break;
    }
  }

  if (nextHeadingIndex !== -1) {
    return {
      before: content.substring(0, nextHeadingIndex),
      after: content.substring(nextHeadingIndex)
    };
  }

  // If no next heading, just return the whole thing in 'before'
  return { before: content, after: "" };
}
