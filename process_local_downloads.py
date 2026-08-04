import os
import re
import time
from PIL import Image
from google import genai

# Path to your local Windows FireShot directory
READY_DIR = r"C:\Users\zacha\Downloads\FireShot\ready to scan"
ARTWORK_BASE_DIR = os.path.join(os.getcwd(), "website-artwork")
TARGET_WIDTH = 1400

api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("ERROR: GEMINI_API_KEY environment variable is not set!")
    print("Please run: set GEMINI_API_KEY=your_key in Command Prompt before running this script.")
    exit(1)

client = genai.Client(api_key=api_key)

SCHOOL_AUDIT_PROMPT = """
You are a CampusVox Brand Storyteller — a warm, experienced advisor to Catholic college 
communications directors and web teams. You've spent years helping schools find and 
amplify their most authentic voice.

Analyze these webpage screenshots as a complete picture of how this school 
tells its story online. Your audience is the communications director or web designer 
who built these pages. Speak to them directly, collegially, and encouragingly.

Focus on:
- The words they chose and why they work
- How the imagery and art reinforce (or create) the school's identity
- What makes this school's digital voice distinctive
- What other schools could learn from their approach

Avoid: UX nitpicks, button colors, font sizes, or anything that reads as criticism.
Every observation should feel like a compliment or an insight, never a grade.

Structure your response exactly as follows:

# [School Name] — Brand Story Analysis

## What They're Saying
A 2–3 sentence description of the school's core message and who they're 
speaking to. Write it like you're describing a person's personality, not 
evaluating a marketing strategy.

## The Words That Work
Pull 4–6 specific phrases, headlines, or word choices from the pages that 
are doing real work. For each one, explain in 1–2 sentences why that 
language is effective and what it signals to prospective students and families.

## The Visual Story
2–3 observations about how the imagery, color, and visual choices reinforce 
the school's identity and message. Focus on what the art is *saying*, not 
how it looks technically.

## What to Borrow
3 specific, actionable ideas — written as enthusiastic recommendations — 
that other Catholic school communicators could adapt from this school's 
approach. Use bold headers for each. Make them feel like insider tips from 
a trusted colleague, not consulting deliverables.

## The One Thing
One sentence that captures the single most distinctive thing about how 
this school tells its story online.
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

def call_gemini_with_retry(contents, max_retries=3):
    """Executes Gemini call and handles 429 rate limits gracefully with backoff."""
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=contents
            )
            time.sleep(8)  # Rate limit breathing space
            return response.text
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                print(f" Rate limit hit. Pausing 25 seconds before retry (Attempt {attempt + 1}/{max_retries})...")
                time.sleep(25)
            else:
                raise e
    raise Exception("Exceeded max retries for Gemini API call.")

def run_local_batch():
    if not os.path.exists(READY_DIR):
        print(f"Directory not found: {READY_DIR}")
        return

    # STEP 1: Group images by school domain
    school_batches = {}
    for filename in os.listdir(READY_DIR):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            school_id, page_id = parse_fireshot_name(filename)
            if school_id not in school_batches:
                school_batches[school_id] = []
            school_batches[school_id].append({
                'filename': filename,
                'page_id': page_id,
                'raw_path': os.path.join(READY_DIR, filename)
            })

    if not school_batches:
        print(f"No image files found inside: {READY_DIR}")
        return

    print(f"Found {len(school_batches)} unique school batch(es) to process.\n")

    # STEP 2: Process each school sequentially
    for school_id, files in school_batches.items():
        print("=" * 60)
        print(f"Processing: {school_id.upper()} ({len(files)} pages)")
        print("=" * 60)
        
        school_artwork_dir = os.path.join(ARTWORK_BASE_DIR, school_id)
        os.makedirs(school_artwork_dir, exist_ok=True)
        
        all_images = []

        # Crop and optimize JPEGs locally
        for item in files:
            raw_path = item['raw_path']
            page_id = item['page_id']
            artwork_path = os.path.join(school_artwork_dir, f"{page_id}.jpg")

            try:
                img = Image.open(raw_path)
                all_images.append(img.copy())

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
                print(f" Saved Artwork: website-artwork/{school_id}/{page_id}.jpg")

            except Exception as e:
                print(f" Failed image processing for {item['filename']}: {e}")

        # Run Brand Storyteller Gemini evaluation
        report_path = os.path.join(school_artwork_dir, f"{school_id}-audit.md")
        print(f"\n Generating Brand Story Analysis for {school_id} ({len(all_images)} pages)...")

        try:
            payload = all_images + [SCHOOL_AUDIT_PROMPT]
            report_text = call_gemini_with_retry(payload)

            with open(report_path, "w", encoding="utf-8") as f:
                f.write(report_text)
            print(f" Saved Brand Story Audit: website-artwork/{school_id}/{school_id}-audit.md\n")

        except Exception as e:
            print(f" API Error for {school_id}: {e}")

        # Remove processed raw screenshot from Downloads
        for item in files:
            try:
                if os.path.exists(item['raw_path']):
                    os.remove(item['raw_path'])
            except Exception as e:
                print(f" Could not delete {item['filename']}: {e}")

    print("\n All batches finished! You can now commit and push the generated website-artwork/ directory to GitHub.")

if __name__ == "__main__":
    run_local_batch()
