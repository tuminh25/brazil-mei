# enrichment_engine.py
# VERSION 5.3 - Expanded venue geocoding for Singapore

from datetime import datetime
from typing import Optional, Tuple
import re

class EnrichmentEngine:
    def __init__(self):
        self.geocode_cache = {
            # ========== MAIN VENUES ==========
            "Gardens by the Bay": (1.2816, 103.8636),
            "Marina Bay Sands": (1.2834, 103.8607),
            "Esplanade": (1.2902, 103.8556),
            "Singapore Flyer": (1.2894, 103.8631),
            
            # ========== CONVENTION & EXHIBITION ==========
            "Suntec Singapore": (1.2945, 103.8585),
            "Suntec Convention": (1.2945, 103.8585),
            "Singapore Expo": (1.3343, 103.9617),
            "Marina Bay Cruise Centre": (1.2641, 103.8515),
            
            # ========== ENTERTAINMENT VENUES ==========
            "*SCAPE": (1.3018, 103.8352),
            "The Ground Theatre": (1.3018, 103.8352),
            "Capitol Theatre": (1.2939, 103.8524),
            "Victoria Theatre": (1.2903, 103.8516),
            "The Star Theatre": (1.2917, 103.8546),
            
            # ========== SHOPPING & ENTERTAINMENT ==========
            "Jewel Changi": (1.3644, 103.9915),
            "Changi Airport": (1.3644, 103.9915),
            "VivoCity": (1.2644, 103.8220),
            "ION Orchard": (1.3048, 103.8318),
            "Ngee Ann City": (1.3027, 103.8351),
            "Plaza Singapura": (1.3007, 103.8454),
            "Bugis Junction": (1.2990, 103.8553),
            
            # ========== PARKS & OUTDOOR ==========
            "Marina Barrage": (1.2802, 103.8703),
            "East Coast Park": (1.3010, 103.9273),
            "Sentosa": (1.2494, 103.8303),
            "Botanic Gardens": (1.3138, 103.8159),
            "Fort Canning": (1.2945, 103.8467),
            
            # ========== NIGHTLIFE & BARS ==========
            "Clarke Quay": (1.2904, 103.8465),
            "Boat Quay": (1.2874, 103.8492),
            "River Valley": (1.2935, 103.8404),
            "Club Street": (1.2818, 103.8452),
            
            # ========== ARTS & CULTURE ==========
            "National Gallery": (1.2903, 103.8516),
            "ArtScience Museum": (1.2862, 103.8596),
            "National Museum": (1.2966, 103.8485),
            "Asian Civilisations Museum": (1.2876, 103.8513),
            
            # ========== HOTELS ==========
            "Raffles Hotel": (1.2946, 103.8545),
            "Fullerton Hotel": (1.2862, 103.8538),
            "Pan Pacific": (1.2923, 103.8575),
            
            # ========== COMMON AREAS ==========
            "Orchard Road": (1.3048, 103.8318),
            "Chinatown": (1.2820, 103.8437),
            "Little India": (1.3065, 103.8522),
            "Bugis": (1.2990, 103.8553),
            "City Hall": (1.2930, 103.8520),
            
            # ========== POSTAL CODE AREAS ==========
            # Central Singapore
            "Singapore, 179024": (1.2945, 103.8585),  # Suntec area
            "Singapore, 237978": (1.3018, 103.8352),  # *SCAPE / Somerset
            "Singapore, 368242": (1.2904, 103.8465),  # Clarke Quay area
            "Singapore, 238880": (1.3048, 103.8318),  # Orchard area
            "Singapore, 189555": (1.2862, 103.8538),  # Raffles Place

            # Paste vào enrichment_engine.py sau
            "The Arts House": (1.2876, 103.8513),
            "Aliwal Arts Centre": (1.3035, 103.8602),
            "The Substation": (1.2944, 103.8498),
            "Drama Centre": (1.2963, 103.8508),
            "Goodman Arts Centre": (1.3218, 103.8862),
            "Kampong Glam": (1.3024, 103.8598),
            "Haw Par Villa": (1.2829, 103.7821),


            
            # Airport
            "Singapore, 819643": (1.3644, 103.9915),  # Changi Airport
            "Singapore, 819665": (1.3644, 103.9915),  # Changi Airport T3
            
            # East
            "Singapore, 486038": (1.3010, 103.9273),  # East Coast
            "Singapore, 486050": (1.3343, 103.9617),  # Expo
            
            # Default fallback
            "Singapore": (1.3521, 103.8198),
        }

    def parse_event_date(self, date_string: str) -> Optional[str]:
        """Parse various Singapore date formats to ISO format"""
        if not date_string or len(date_string) < 5:
            return None
        
        date_string = date_string.strip()
        
        try:
            # Format 1: "17 Dec 2025" or "Dec 17, 2025"
            for fmt in [
                "%d %b %Y",
                "%b %d, %Y",
                "%d %B %Y",
                "%B %d, %Y",
            ]:
                try:
                    dt = datetime.strptime(date_string, fmt)
                    return dt.isoformat()
                except:
                    continue
            
            # Format 2: "Tue, 17 Dec 2025"
            for fmt in [
                "%a, %d %b %Y",
                "%A, %d %B %Y",
                "%a %d %b %Y",
            ]:
                try:
                    dt = datetime.strptime(date_string, fmt)
                    return dt.isoformat()
                except:
                    continue
            
            # Format 3: Extract date from longer strings
            date_match = re.search(
                r'(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})', 
                date_string, 
                re.IGNORECASE
            )
            if date_match:
                day, month, year = date_match.groups()
                date_str = f"{day} {month} {year}"
                dt = datetime.strptime(date_str, "%d %b %Y")
                return dt.isoformat()
            
            # Format 4: ISO format already
            if re.match(r'\d{4}-\d{2}-\d{2}', date_string):
                return date_string
            
        except Exception as e:
            print(f"    ⚠️  Date parse error: {str(e)}")
        
        return None

    def get_geolocation(self, location_string: str) -> Optional[Tuple[float, float]]:
        """Get coordinates for Singapore locations with fuzzy matching"""
        if not location_string:
            return None
        
        location_lower = location_string.lower()
        
        # Strategy 1: Check exact match first (with postal code)
        for key, coords in self.geocode_cache.items():
            if key.lower() == location_lower:
                return coords
        
        # Strategy 2: Check if location contains venue name
        for key, coords in self.geocode_cache.items():
            # Skip generic "Singapore" to check specific venues first
            if key.lower() == "singapore":
                continue
            if key.lower() in location_lower:
                return coords
        
        # Strategy 3: Extract postal code and try to match
        postal_match = re.search(r'\b(\d{6})\b', location_string)
        if postal_match:
            postal = postal_match.group(1)
            # Check if we have this postal code in cache
            postal_key = f"Singapore, {postal}"
            for key, coords in self.geocode_cache.items():
                if postal in key:
                    return coords
        
        # Strategy 4: Fallback to default Singapore coords
        if "singapore" in location_lower:
            return self.geocode_cache["Singapore"]
        
        return None
