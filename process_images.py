import os
import re
import time
from PIL import Image
from google import genai

# Retrieve API Key
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY environment variable is not set!")

client = genai.Client(api_key=api_key)

# Unified School Audit Prompt
SCHOOL_AUDIT_PROMPT = """
You are a web auditor for CampusVox. You are analyzing all captured webpage screenshots for this educational institution.

Based on ALL the attached screenshots for this university, provide a comprehensive, structured audit covering:
1. Overall Brand & Design Consistency across pages
2. High-Level Messaging & Value Proposition Clarity
3. Key Calls to Action (CTA) Effectiveness & Placement
4. Information Architecture & Navigation Usability
5. Visual Hierarchy, Layout Hygiene & Major Friction Points
6. Summary Score & Final CampusVox Recommendations
"""

def parse_fireshot_name(filename):
    base_name, _ = os.path.splitext(filename)
    
    # Extract domain inside square brackets [...]
    domain_match = re.search(r'\[(.*?)\]$', base_name)
    if domain_match:
        raw_domain = domain_match.group(1).lower().replace("www.", "")
        school_id = re.sub(r'[^a-z0-9]+', '-', raw_domain).strip('-')
    else:
        school_id = "unknown-school"
        
    clean = re.sub(r'^FireShot Capture \d+\s*-\s*', '', base_name, flags=re.IGNORECASE)
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

    # STEP 1: Group all files in ready-to-scan by school_id
    school_batches = {}
    
    for filename in os.listdir(ready_dir):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            school_id, page_id = parse_fireshot_name(filename)
            if school_id not in school_batches:
                school_batches[school_id] = []
            school_batches[school_id].append({
                'filename': filename,
                'page_id': page_id,
                'raw_path': os.path.join(ready_dir, filename)
            })

    if not school_batches:
        print("No image files found in ready-to-scan.")
        return

    print(f"Found {len(school_batches)} university batch(es) to process.\n")

    # STEP 2: Process Artwork & Run Single Audit Per School
    for school_id, files in school_batches.items():
        print(f"==================================================")
        print(f"Processing School: {school_id.upper()} ({len(files)} pages)")
        print(f"==================================================")
        
        school_artwork_dir = os.path.join(artwork_base_dir, school_id)
        os.makedirs(school_artwork_dir, exist_ok=True)
        
        full_images_for_gemini = []

        # Crop & convert all images for this school first
        for item in files:
            raw_path = item['raw_path']
            page_id = item['page_id']
            artwork_path = os.path.join(school_artwork_dir, f"{page_id}.jpg")

            try:
                # Open image for Gemini batch
                img = Image.open(raw_path)
                full_images_for_gemini.append(img)

                # Process cropped 1400px JPEG for repo
                if img.mode in ("RGBA", "P"):
                    conv_img = img.convert("RGB")
                else:
                    conv_img = img.copy()

                width, height = conv_img.size
                crop_height = min(height, 1080)
                cropped_img = conv_img.crop((0, 0, width, crop_height))

                if width > TARGET_WIDTH:
                    scale_factor = TARGET_WIDTH / float(width)
                    new_height = int(float(crop_height) * float(scale_factor))
                    final_img = cropped_img.resize((TARGET_WIDTH, new_height), Image.Resampling.LANCZOS)
                else:
                    final_img = cropped_img

                final_img.save(artwork_path, "JPEG", optimize=True, quality=82, dpi=(72, 72))
                print(f" Saved Artwork: {artwork_path}")

            except Exception as e:
                print(f" Failed image processing for {item['filename']}: {e}")

        # STEP 3: Single Gemini Request for the entire school
        report_path = os.path.join(school_artwork_dir, f"{school_id}-audit.md")
        print(f"\n Running Unified Gemini Audit on {len(full_images_for_gemini)} pages for {school_id}...")

        try:
            # Combine all page screenshots + prompt into one request
            contents = full_images_for_gemini + [SCHOOL_AUDIT_PROMPT]
            
            # gemini-1.5-flash has higher free-tier limits (1,500 req/day)
            response = client.models.generate_content(
                model='gemini-1.5-flash',
                contents=contents
            )

            with open(report_path, "w", encoding="utf-8") as f:
                f.write(f"# CampusVox Comprehensive Audit: {school_id.upper()}\n\n")
                f.write(response.text)
            print(f" Saved Consolidated Audit: {report_path}\n")

        except Exception as e:
            print(f" Gemini School Audit failed for {school_id}: {e}")
            with open(report_path, "w", encoding="utf-8") as f:
                f.write(f"# Audit Error: {school_id.upper()}\n\n")
                f.write(f"Gemini API audit failed with error:\n`{str(e)}`")

        # STEP 4: Delete raw screenshot files from ready-to-scan
        for item in files:
            try:
                if os.path.exists(item['raw_path']):
                    os.remove(item['raw_path'])
            except Exception as e:
                print(f" Could not delete {item['filename']}: {e}")

        # Sleep briefly between schools to respect per-minute limits
        time.sleep(5)

if __name__ == "__main__":
    process_and_analyze()
