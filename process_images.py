import os
import re
import json
import time
from PIL import Image
from google import genai

# Initialize Gemini Client using the GitHub Secret variable
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

PAGE_ANALYSIS_PROMPT = """
You are a web auditor for CampusVox. Analyze this COMPLETE webpage screenshot from top to bottom.
Provide a structured analysis with the following:
1. Primary Page Type & Goal (e.g., Homepage, Admissions, Financial Aid)
2. Hero & Messaging Clarity (Value proposition, typography, primary headline)
3. Call to Action (CTA) Placement & Contrast
4. Navigation & Information Architecture Usability
5. Layout Hygiene & Visual Friction
"""

# =====================================================================
# STEP 1 HELPER FUNCTION: FIRESHOT PARSER & RENAMER
# =====================================================================
def parse_fireshot_name(filename):
    base_name, _ = os.path.splitext(filename)
    
    # 1. Strip 'FireShot Capture #### - '
    clean = re.sub(r'^FireShot Capture \d+\s*-\s*', '', base_name, flags=re.IGNORECASE)
    # 2. Strip trailing domain in brackets '[www.domain.com]'
    clean = re.sub(r'\s*-\s*\[.*?\]$', '', clean)
    
    parts = [p.strip() for p in clean.split('-') if p.strip()]
    
    if len(parts) >= 2:
        school_raw = parts[-1]          # School name is usually at the end
        page_raw = "-".join(parts[:-1]) # Page description is at the front
    else:
        school_raw = clean
        page_raw = "homepage"

    # Convert text to URL-safe hyphenated slugs
    def slugify(text):
        text = text.lower().replace("www.", "")
        text = re.sub(r'[^a-z0-9]+', '-', text)
        return text.strip('-')

    return slugify(school_raw), slugify(page_raw)

# =====================================================================
# MAIN PIPELINE: RENAME -> ANALYZE -> CROP/RESIZE -> CLEANUP
# =====================================================================
def process_and_analyze():
    ready_dir = "ready-to-scan"
    artwork_base_dir = "website-artwork"
    TARGET_WIDTH = 1400
    
    if not os.path.exists(ready_dir):
        print(f"Directory '{ready_dir}' missing.")
        return

    print("Starting Pipeline: Rename FireShot -> Full Gemini Analysis -> Convert/Crop JPG")

    for filename in os.listdir(ready_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            raw_path = os.path.join(ready_dir, filename)
            
            # STEP 1: Parse and clean FireShot name
            school_id, page_id = parse_fireshot_name(filename)
            print(f"Processing: School='{school_id}' | Page='{page_id}'")
            
            school_artwork_dir = os.path.join(artwork_base_dir, school_id)
            os.makedirs(school_artwork_dir, exist_ok=True)
            
            artwork_path = os.path.join(school_artwork_dir, f"{page_id}.jpg")
            report_path = os.path.join(school_artwork_dir, f"{page_id}-analysis.md")

            # STEP 2: Full Uncropped Image Gemini Analysis
            try:
                print(f"Running Gemini Analysis on full screenshot...")
                full_img = Image.open(raw_path)
                
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=[full_img, PAGE_ANALYSIS_PROMPT]
                )
                
                # Save markdown analysis report
                with open(report_path, "w", encoding="utf-8") as f:
                    f.write(f"# Analysis: {school_id.upper()} - {page_id}\n\n")
                    f.write(response.text)
                print(f"Saved Report: {report_path}")
                    
            except Exception as e:
                print(f"Gemini analysis failed for {filename}: {e}")

            # STEP 3: Convert PNG to JPG, Crop Top Section, & Resize to 1400px Wide
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
                    
                    # Save web-optimized JPG
                    final_img.save(artwork_path, "JPEG", optimize=True, quality=82, dpi=(72, 72))
                    print(f"Saved Artwork: {artwork_path}")

            except Exception as e:
                print(f"Conversion/Crop failed for {filename}: {e}")

            # STEP 4: Delete raw screenshot to save GitHub space
            os.remove(raw_path)
            print(f"Cleaned up raw file: {filename}\n")
            
            # Brief pause to respect API rate limits
            time.sleep(2)

if __name__ == "__main__":
    process_and_analyze()
