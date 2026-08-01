import os
import re
import time
from PIL import Image
from google import genai

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY environment variable is not set!")

client = genai.Client(api_key=api_key)

SCHOOL_AUDIT_PROMPT = """
You are a web auditor for CampusVox. Analyze these webpage screenshots for this educational institution.
Provide a structured assessment covering:
1. Messaging & Value Proposition Clarity
2. Call to Action (CTA) Effectiveness & Placement
3. Information Architecture & Navigation Usability
4. Layout Hygiene, Visual Hierarchy & Friction Points
"""

def parse_fireshot_name(filename):
    base_name, _ = os.path.splitext(filename)
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

def call_gemini_with_retry(contents, max_retries=3):
    """Executes Gemini call and handles 429 rate limits gracefully with backoff."""
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=contents
            )
            # Sleep 6 seconds after every success to maintain < 10 RPM rate
            time.sleep(6)
            return response.text
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                print(f" Rate limit hit. Pausing 20 seconds before retry (Attempt {attempt + 1}/{max_retries})...")
                time.sleep(20)
            else:
                raise e
    raise Exception("Exceeded max retries for Gemini API call.")

def process_and_analyze():
    ready_dir = "ready-to-scan"
    artwork_base_dir = "website-artwork"
    TARGET_WIDTH = 1400
    
    if not os.path.exists(ready_dir):
        print(f"Directory '{ready_dir}' missing.")
        return

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

    for school_id, files in school_batches.items():
        print(f"==================================================")
        print(f"Processing School: {school_id.upper()} ({len(files)} pages)")
        print(f"==================================================")
        
        school_artwork_dir = os.path.join(artwork_base_dir, school_id)
        os.makedirs(school_artwork_dir, exist_ok=True)
        
        all_images_data = []

        # 1. Process and crop all JPEGs for the repo first
        for item in files:
            raw_path = item['raw_path']
            page_id = item['page_id']
            artwork_path = os.path.join(school_artwork_dir, f"{page_id}.jpg")

            try:
                img = Image.open(raw_path)
                all_images_data.append((img.copy(), page_id))

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

        # 2. Chunk images into groups of max 4
        chunk_size = 4
        audit_notes = []
        report_path = os.path.join(school_artwork_dir, f"{school_id}-audit.md")

        for i in range(0, len(all_images_data), chunk_size):
            chunk = all_images_data[i:i + chunk_size]
            chunk_imgs = [item[0] for item in chunk]
            chunk_pages = [item[1] for item in chunk]
            
            print(f"\n Analyzing chunk {i//chunk_size + 1} for {school_id} (Pages: {', '.join(chunk_pages)})...")

            try:
                report_text = call_gemini_with_retry(chunk_imgs + [SCHOOL_AUDIT_PROMPT])
                audit_notes.append(report_text)
            except Exception as e:
                print(f" Chunk analysis error: {e}")
                audit_notes.append(f"*Chunk analysis failed due to error: {e}*")

        # 3. Write combined audit report
        try:
            with open(report_path, "w", encoding="utf-8") as f:
                f.write(f"# CampusVox Comprehensive Audit: {school_id.upper()}\n\n")
                for idx, note in enumerate(audit_notes):
                    f.write(f"## Audit Section {idx + 1}\n\n{note}\n\n---\n\n")
            print(f" Saved Consolidated Audit: {report_path}\n")
        except Exception as e:
            print(f" Failed to write report for {school_id}: {e}")

        # 4. Clean up raw files
        for item in files:
            try:
                if os.path.exists(item['raw_path']):
                    os.remove(item['raw_path'])
            except Exception as e:
                print(f" Could not delete {item['filename']}: {e}")

if __name__ == "__main__":
    process_and_analyze()
