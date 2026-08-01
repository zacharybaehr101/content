import os
import re
import time
from PIL import Image
from google import genai

# Retrieve API Key
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY environment variable is not set!")

# Initialize Gemini Client
client = genai.Client(api_key=api_key)

PAGE_ANALYSIS_PROMPT = """
You are a web auditor for CampusVox. Analyze this COMPLETE webpage screenshot from top to bottom.
Provide a structured analysis with the following:
1. Primary Page Type & Goal (e.g., Homepage, Admissions, Financial Aid)
2. Hero & Messaging Clarity (Value proposition, typography, primary headline)
3. Call to Action (CTA) Placement & Contrast
4. Navigation & Information Architecture Usability
5. Layout Hygiene & Visual Friction
"""

def parse_fireshot_name(filename):
    base_name, _ = os.path.splitext(filename)
    
    # 1. Extract domain inside square brackets [...] at the end
    domain_match = re.search(r'\[(.*?)\]$', base_name)
    if domain_match:
        raw_domain = domain_match.group(1).lower().replace("www.", "")
        school_id = re.sub(r'[^a-z0-9]+', '-', raw_domain).strip('-')
    else:
        school_id = "unknown-school"
        
    # 2. Strip 'FireShot Capture #### - ' from the beginning
    clean = re.sub(r'^FireShot Capture \d+\s*-\s*', '', base_name, flags=re.IGNORECASE)
    
    # 3. Strip the trailing bracketed domain '[...]'
    clean = re.sub(r'\s*-\s*\[.*?\]$', '', clean)
    
    def slugify(text):
        text = text.lower().replace("www.", "")
        text = re.sub(r'[^a-z0-9]+', '-', text)
        return text.strip('-')

    page_id = slugify(clean)
    if not page_id:
        page_id = "homepage"

    return school_id, page_id

def process_and_analyze():
    ready_dir = "ready-to-scan"
    artwork_base_dir = "website-artwork"
    TARGET_WIDTH = 1400
    
    if not os.path.exists(ready_dir):
        print(f"Directory '{ready_dir}' missing.")
        return

    print("Starting Pipeline: Domain Parsing -> Full Gemini Analysis -> Convert/Crop JPG")

    for filename in os.listdir(ready_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            raw_path = os.path.join(ready_dir, filename)
            
            # STEP 1: Parse domain and page name
            school_id, page_id = parse_fireshot_name(filename)
            print(f"Processing: School='{school_id}' | Page='{page_id}'")
            
            school_artwork_dir = os.path.join(artwork_base_dir, school_id)
            os.makedirs(school_artwork_dir, exist_ok=True)
            
            artwork_path = os.path.join(school_artwork_dir, f"{page_id}.jpg")
            report_path = os.path.join(school_artwork_dir, f"{page_id}-analysis.md")

            # STEP 2: Gemini Analysis & Direct Markdown Output
            print(f"Running Gemini Analysis for {filename}...")
            try:
                full_img = Image.open(raw_path)
                
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=[full_img, PAGE_ANALYSIS_PROMPT]
                )
                
                # Write Markdown Report
                with open(report_path, "w", encoding="utf-8") as f:
                    f.write(f"# Analysis: {school_id.upper()} - {page_id}\n\n")
                    f.write(response.text)
                print(f"--> Saved Report: {report_path}")
                    
            except Exception as e:
                print(f"--> Gemini API Error for {filename}: {e}")
                # Write fallback report so you can see exact error in the file if it fails
                with open(report_path, "w", encoding="utf-8") as f:
                    f.write(f"# Analysis Error: {school_id.upper()} - {page_id}\n\n")
                    f.write(f"Gemini API processing failed with error:\n`{str(e)}`")

            # STEP 3: Convert/Crop Artwork
            try:
                with Image.open(raw_path) as img:
                    if img.mode in ("RGBA", "P"):
                        img = img.convert("RGB")
                    
                    width, height = img.size
                    crop_height = min(height, 1080)
                    cropped_img = img.crop((0, 0, width, crop_height))
                    
                    if width > TARGET_WIDTH:
                        scale_factor = TARGET_WIDTH / float(width)
                        new_height = int(float(crop_height) * float(scale_factor))
                        final_img = cropped_img.resize((TARGET_WIDTH, new_height), Image.Resampling.LANCZOS)
                    else:
                        final_img = cropped_img
                    
                    final_img.save(artwork_path, "JPEG", optimize=True, quality=82, dpi=(72, 72))
                    print(f"--> Saved Artwork: {artwork_path}")

            except Exception as e:
                print(f"--> Conversion failed for {filename}: {e}")

            # STEP 4: Delete raw screenshot
            try:
                if os.path.exists(raw_path):
                    os.remove(raw_path)
            except Exception as e:
                print(f"Could not delete {filename}: {e}")
            
            time.sleep(2)

if __name__ == "__main__":
    process_and_analyze()
