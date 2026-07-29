import csv
import time
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

urls = [
    # (Keep your full list of URLs here)
    "https://ipsciences.edu/",
    "https://manhattan.edu/",
    # ... rest of your URLs ...
]

# Configure a session with automatic retries for flaky connections
session = requests.Session()
retries = Retry(total=3, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
session.mount("https://", HTTPAdapter(max_retries=retries))
session.mount("http://", HTTPAdapter(max_retries=retries))

# Realistic browser headers to bypass basic security blocks
headers = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
}

results = []
print(f"Starting enhanced scan across {len(urls)} URLs...")

for url in urls:
    clean_url = url.strip()
    if not clean_url.startswith("http"):
        clean_url = "https://" + clean_url

    linkedin_link = "Not Found"

    try:
        response = session.get(
            clean_url, headers=headers, timeout=15, allow_redirects=True
        )
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Search all links, giving priority to those found in footers or social lists if present,
            # but scanning all <a> tags to ensure nothing is missed.
            for a in soup.find_all("a", href=True):
                href = a["href"].strip()
                href_lower = href.lower()
                
                # Check for standard linkedin formats (company, school, or custom handles)
                if "linkedin.com/company" in href_lower or "linkedin.com/school" in href_lower:
                    linkedin_link = urljoin(clean_url, href)
                    break
                # Catch general linkedin links if they use subdomains or shortened paths
                elif "linkedin.com/" in href_lower and "share" not in href_lower:
                    linkedin_link = urljoin(clean_url, href)
                    break
                    
    except requests.exceptions.RequestException:
        linkedin_link = "Connection Error"

    results.append({"Source_URL": clean_url, "LinkedIn_URL": linkedin_link})
    print(f"Checked: {clean_url} --> {linkedin_link}")
    time.sleep(0.5)

output_file = "linkedin-scraper/linkedin_extracted_links.csv"
with open(output_file, mode="w", newline="", encoding="utf-8") as csv_file:
    fieldnames = ["Source_URL", "LinkedIn_URL"]
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()
    for row in results:
        writer.writerow(row)

print(f"\nDone! Results successfully saved to {output_file}")
