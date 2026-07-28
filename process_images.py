import os
import re
import shutil
from PIL import Image
from google import genai

# Initialize Gemini Client using the repository secret environment variable
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

ANALYSIS_PROMPT = """
You are an expert UX/UI designer, web auditor, and content strategist analyzing website hero sections ("above-the-fold" views) for CampusVox. 

Review the attached cropped website screenshot(s) and provide a structured, actionable content analysis focusing on the following dimensions:

1. Visual & First Impression Hierarchy
   - What is the immediate visual focal point (hero image, video, headline, or CTA)?
   - Does the branding, typography, and color scheme communicate clarity and trust within 3 seconds?

2. Value Proposition & Messaging Clarity
   - What key message or value proposition is communicated above the fold?
   - Is the target audience immediately clear, or is the messaging vague/generic?

3. Call to Action (CTA) Effectiveness
   - What primary action is the user prompted to take?
   - Is the CTA visually distinct, contrasting, and positioned intuitively?

4. Layout & Structural Hygiene
   - Are key visual components (navigation bar, search, primary copy, CTAs) balanced, or does the layout feel cluttered/cramped?
   - Are there any glaring visual layout issues, poor contrast, or unreadable text elements?

5. Strategic Recommendations
   - Provide 2–3 high-impact, actionable optimizations to improve conversion, clarity, or visual engagement for this specific layout.

Format your response using clear section headers, concise bullet points, and high-impact observations.
"""

def process_and_analyze_all():
    ready_dir = "ready-to-scan"
    artwork_base_dir = "website-artwork"
    scanned_base_dir = "scanned"  # Completed original screenshots moved here
    
    TARGET_WIDTH = 1200  
    valid_extensions = ('.png', '.jpg', '.jpeg', '.webp', '.tiff', '.bmp')
    
    if not os.path.exists(ready_dir):
        print(f"Directory '{ready_dir}' does not exist yet. Skipping.")
        return

    print("Starting processing, cropping, and Gemini analysis pipeline...")
    
    # Traverse through ready-to-scan
    for dirpath, _, filenames in os.walk(ready_dir):
        for filename in filenames:
            if filename.lower().endswith(valid_extensions):
                file_path = os.path.join(dirpath, filename)
                
                # 1. Clean filename (remove "screencapture-")
                cleaned_filename = filename.replace("screencapture-", "")
                
                # Calculate relative path to maintain subfolder structures across folders
                relative_path = os.path.relpath(dirpath, ready_dir)
                
                # Target directories for Artwork, Scanned, and Analysis
                target_artwork_dir = os.path.normpath(os.path.join(artwork_base_dir, relative_path))
                target_scanned_dir = os.path.normpath(os.path.join(scanned_base_dir, relative_path))
                
                os.makedirs(target_artwork_dir, exist_ok=True)
                os.makedirs(target_scanned_dir, exist_ok=True)
                
                # Clean trailing digits from base name
                base_name, ext = os.path.splitext(cleaned_filename)
                clean_base_name = re.sub(r'[-_]\d+$', '', base_name)
                
                artwork_filename = f"{clean_base_name}{ext}"
                artwork_path = os.path.join(target_artwork_dir, artwork_filename)
                report_path = os.path.join(target_artwork_dir, f"{clean_base_name}-analysis.md")
                done_original_path = os.path.join(target_scanned_dir, f"{clean_base_name}{ext}")
                
                # 2. Crop & Resize
                try:
                    with Image.open(file_path) as img:
                        width, height = img.size
                        crop_height = min(height, 1080)
                        cropped_img = img.crop((0, 0, width, crop_height))
                        
                        if width > TARGET_WIDTH:
                            scale_factor = TARGET_WIDTH / float(width)
                            new_height = int(float(crop_height) * float(scale_factor))
                            final_img = cropped_img.resize((TARGET_WIDTH, new_height), Image.Resampling.LANCZOS)
                        else:
                            final_img = cropped_img
                        
                        final_img.save(artwork_path, optimize=True, quality=85)
                        print(f"Artwork saved: {artwork_path}")
                        
                except Exception as e:
                    print(f"Error processing image {filename}: {e}")
                    continue

                # 3. Call Gemini API for Content Analysis
                try:
                    print(f"Running Gemini Analysis for {artwork_filename}...")
                    analysis_image = Image.open(artwork_path)
                    
                    response = client.models.generate_content(
                        model='gemini-2.5-flash',
                        contents=[analysis_image, ANALYSIS_PROMPT]
                    )
                    
                    # Save analysis report as markdown
                    with open(report_path, "w", encoding="utf-8") as f:
                        f.write(f"# CampusVox Audit Report: {clean_base_name}\n\n")
                        f.write(f"![{clean_base_name}]({artwork_filename})\n\n")
                        f.write(response.text)
                    print(f"Analysis saved: {report_path}")
                    
                except Exception as e:
                    print(f"Gemini API call failed for {filename}: {e}")

                # 4. Move raw file out of ready-to-scan to indicate completion
                try:
                    shutil.move(file_path, done_original_path)
                    print(f"Moved raw file to completed folder: {done_original_path}")
                except Exception as e:
                    print(f"Error moving finished file {filename}: {e}")

if __name__ == "__main__":
    process_and_analyze_all()
