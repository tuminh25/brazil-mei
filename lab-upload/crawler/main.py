# main.py
# VERSION 5.2 - Fixed date/venue parsing

import time
from typing import Dict, Any
import re
import traceback

try:
    from enrichment_engine import EnrichmentEngine
    from db_handler import DatabaseHandler
    from allevents_scraper import AlleventsScraper
    from eventbrite_scraper import EventbriteScraper
    from gbb_scraper import GBBScraper
    from esplanade_scraper import EsplanadeScraper
except ImportError as e:
    print(f"⚠️  Import Error: {e}")
    import sys
    sys.exit(1)

SCRAPER_CONFIG = {
    'gbb': {
        'class': GBBScraper,
        'target': 'whats-on/calendar',
        'enabled': True,  # ← BẬT
        'max_events': 10,
    },
    'eventbrite': {
        'class': EventbriteScraper,
        'target': 'singapore--singapore',
        'enabled': True,
        'max_events': 20,
    },
    'allevents': {
        'class': AlleventsScraper,
        'target': 'singapore',
        'enabled': True,  # ← BẬT
        'max_events': 20,
    },
    'esplanade': {
        'class': EsplanadeScraper,
        'target': 'whats-on',
        'enabled': True,  # ← BẬT
        'max_events': 20,
    },
}

def make_slug(text):
    """Generate URL-safe slug from text"""
    slug = re.sub(r'[^\w\s-]', '', str(text).lower())
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')[:100]

def run_scraper(scraper_name: str, config: Dict, db_handler: DatabaseHandler, enricher: EnrichmentEngine):
    """Run a single scraper and save events to database"""
    
    print(f"\n{'='*60}")
    print(f"🚀 RUNNING: {scraper_name.upper()}")
    print('='*60)

    ScraperClass = config['class']
    processed_count = 0
    scraper = None

    try:
        scraper = ScraperClass()
        
        listing_keyword = config['target']
        max_events = config.get('max_events', 20)
        
        print(f"📍 Target: {listing_keyword}")
        print(f"📊 Max events: {max_events}")
        
        event_urls = scraper.get_event_urls(
            listing_url=listing_keyword, 
            max_events=max_events
        )

        if not event_urls:
            print("⚠️  No URLs found")
            return 0

        print(f"✓ Found {len(event_urls)} event URLs\n")

        for i, event_url in enumerate(event_urls, 1):
            try:
                print(f"[{i}/{len(event_urls)}] {event_url[:70]}...")

                raw_data = scraper.scrape_event_details(event_url)
                
                if not raw_data or not raw_data.get("title"):
                    print("  ⚠️  Skipped - No title")
                    continue

                title = raw_data.get("title", "Untitled Event")
                print(f"  ✓ {title[:50]}...")

                # Price handling
                price_str = raw_data.get("price", "")
                if price_str:
                    price_str = str(price_str).replace("Free", "").strip()
                    price_match = re.search(r"\d+\.?\d*", price_str)
                    price = float(price_match.group(0)) if price_match else None
                else:
                    price = None

                is_free = price is None or price == 0

                # Date handling - FIXED
                raw_date = raw_data.get("date")
                parsed_start_date = None
                if raw_date and enricher:
                    parsed_start_date = enricher.parse_event_date(raw_date)
                    if not parsed_start_date:
                        print(f"    ⚠️  Could not parse date: {raw_date[:50]}")
                    else:
                        print(f"    ✓ Parsed date: {parsed_start_date[:10]}")

                # Location handling - FIXED
                location = raw_data.get("location")
                latitude, longitude = None, None
                if location and enricher:
                    geo = enricher.get_geolocation(location)
                    if geo and len(geo) == 2:
                        latitude, longitude = geo
                        print(f"    ✓ Geocoded: ({latitude:.4f}, {longitude:.4f})")
                    else:
                        print(f"    ⚠️  Could not geocode: {location[:40]}")

                # Build event data
                event_data: Dict[str, Any] = {
                    "name": title,
                    "slug": make_slug(title),
                    "description": raw_data.get("description"),
                    "url": raw_data.get("source_url", event_url),
                    "imageUrl": raw_data.get("image_url"),
                    "startDate": parsed_start_date,
                    "endDate": None,
                    "venueName": location,
                    "latitude": latitude,
                    "longitude": longitude,
                    "price": price,
                    "currency": "SGD" if price else None,
                    "isFree": is_free,
                    "tags": [raw_data.get("category")] if raw_data.get("category") else [],
                }

                # Save to DB
                result = db_handler.upsert_event(event_data)
                
                if result:
                    processed_count += 1
                    print(f"  ✅ Saved")
                else:
                    print(f"  ⚠️  Duplicate or error")

            except KeyboardInterrupt:
                print("\n⚠️  Interrupted by user")
                raise
            except Exception as e:
                print(f"  ❌ Error: {str(e)[:60]}")
                continue

        print(f"\n✅ Finished {scraper_name}: {processed_count} events saved")

    except KeyboardInterrupt:
        raise
    except Exception as e:
        print(f"❌ Fatal error in {scraper_name}: {str(e)}")
        traceback.print_exc()

    finally:
        if scraper and hasattr(scraper, 'close'):
            try:
                scraper.close()
            except:
                pass

    return processed_count

def main():
    """Main entry point"""
    
    print("\n" + "="*60)
    print("🚀 SG Events Hub Crawler v5.2")
    print("="*60 + "\n")

    enabled_scrapers = [name for name, config in SCRAPER_CONFIG.items() if config['enabled']]
    disabled_scrapers = [name for name in SCRAPER_CONFIG.keys() if name not in enabled_scrapers]
    
    print(f"📋 Enabled scrapers: {', '.join(enabled_scrapers)}")
    print(f"⏸️  Disabled scrapers: {', '.join(disabled_scrapers)}")
    print()

    try:
        db_handler = DatabaseHandler()
        enricher = EnrichmentEngine()
    except Exception as e:
        print(f"❌ Initialization failed: {e}")
        traceback.print_exc()
        return

    total_events = 0
    start_time = time.time()

    for scraper_name, config in SCRAPER_CONFIG.items():
        if not config.get('enabled', False):
            continue
            
        try:
            count = run_scraper(scraper_name, config, db_handler, enricher)
            total_events += count
            time.sleep(2)
            
        except KeyboardInterrupt:
            print("\n\n⚠️  Interrupted by user")
            break
            
        except Exception as e:
            print(f"❌ Scraper {scraper_name} failed: {e}")
            traceback.print_exc()
            continue

    elapsed = time.time() - start_time
    print("\n" + "="*60)
    print(f"✅ CRAWLING COMPLETE")
    print(f"   Total events saved: {total_events}")
    print(f"   Scrapers run: {len(enabled_scrapers)}")
    print(f"   Time elapsed: {elapsed:.1f}s")
    print("="*60 + "\n")

    db_handler.close()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n👋 Goodbye!")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        traceback.print_exc()
