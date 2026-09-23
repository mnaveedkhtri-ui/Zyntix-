import csv
import json
import time
import urllib.request
import urllib.parse
from html.parser import HTMLParser

class SimpleHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.headings = []
        self.in_heading = False
        self.current_tag = ""

    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        if tag in ['h1', 'h2', 'h3']:
            self.in_heading = True

    def handle_endtag(self, tag):
        if tag in ['h1', 'h2', 'h3']:
            self.in_heading = False
        self.current_tag = ""

    def handle_data(self, data):
        data = data.strip()
        if not data:
            return
        self.text.append(data)
        if self.in_heading:
            self.headings.append(data)

def analyze_competitor(url):
    print(f"[*] Analyzing competitor: {url}")
    try:
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            
            parser = SimpleHTMLParser()
            parser.feed(html)
            
            word_count = len(" ".join(parser.text).split())
            return {
                "url": url,
                "word_count": word_count,
                "headings": parser.headings[:5] # Top 5 headings
            }
    except Exception as e:
        print(f"[!] Failed to analyze {url}: {str(e)}")
        return None

def main():
    print("="*50)
    print("?? ZYNTIX ADVANCED PYTHON ENGINE (SEO ANALYZER) ??")
    print("="*50)
    
    target_keyword = "Best Plumbers in London"
    
    print("\n[+] Starting Advanced SERP Analysis...")
    time.sleep(1)
    
    # In a real scenario, this would use a SERP API. 
    # For demonstration, we will analyze a few dummy competitor URLs or user-provided URLs.
    print("[!] Normally, this scrapes Google for the top 10 results.")
    print("For now, let's analyze a specific competitor's website.")
    competitor_url = "https://en.wikipedia.org/wiki/Search_engine_optimization"
    
    if competitor_url:
        result = analyze_competitor(competitor_url)
        if result:
            print("\n" + "="*50)
            print("?? SEO COMPETITOR REPORT ??")
            print("="*50)
            print(f"Target URL   : {result['url']}")
            print(f"Word Count   : {result['word_count']} words")
            print(f"Key Headings :")
            for h in result['headings']:
                print(f"  - {h}")
            
            print("\n[+] To outrank this page, your Zyntix API article should:")
            print(f"  1. Be at least {result['word_count'] + 300} words long.")
            print(f"  2. Include variations of these headings.")
            
            # Save to CSV
            with open('seo_report.csv', 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(["Competitor URL", "Word Count", "Top Headings"])
                writer.writerow([result['url'], result['word_count'], " | ".join(result['headings'])])
            print("\n[+] Saved detailed report to seo_report.csv")
            
if __name__ == "__main__":
    main()

