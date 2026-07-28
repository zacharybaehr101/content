import os
import re
from PIL import Image

def process_and_resize_all_subfolders():
    ready_dir = "ready-to-scan"
    artwork_base_dir = "website-artwork"
    
    TARGET_WIDTH = 1200  
    valid_extensions = ('.png', '.jpg', '.jpeg', '.webp', '.tiff', '.bmp')
    
    if not os.path.exists(ready_dir):
        print(f"Directory '{ready_dir}' does not exist yet. Create it or upload images to it.")
        return

    print("Starting processing pipeline inside GitHub...")
    
    for dirpath, _, filenames in os.walk(ready_dir):
        for filename in filenames:
            if filename.lower().endswith(valid_extensions):
                file_path = os.path.join(dirpath, filename)
                
                # 1. Clean filename inline
                cleaned_filename = filename.replace("screencapture-", "")
                new_ready_path = os.path.join(dirpath, cleaned_filename)
                
                if filename != cleaned_filename:
                    try:
                        os.rename(file_path, new_ready_path)
                        file_path = new_ready_path
                        print(f"Renamed: {filename} -> {cleaned_filename}")
                    except Exception as e:
                        print(f"Skipping rename for {filename}: {e}")
                        continue

                # 2. Mirror subfolder structure in website-artwork
                relative_path = os.path.relpath(dirpath, ready_dir)
                target_output_dir = os.path.normpath(os.path.join(artwork_base_dir, relative_path))
                os.makedirs(target_output_dir, exist_ok=True)
                
                # 3. Strip trailing digits/numbers
                base_name, ext = os.path.splitext(cleaned_filename)
                clean_base_name = re.sub(r'[-_]\d+$', '', base_name)
                output_filename = f"{clean_base_name}{ext}"
                output_path = os.path.join(target_output_dir, output_filename)
                
                # 4. Crop and Resize
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
                        
                        final_img.save(output_path, optimize=True, quality=85)
                        print(f"Saved processed artwork: {output_path}")
                        
                except Exception as e:
                    print(f"Failed processing for {cleaned_filename}: {e}")

if __name__ == "__main__":
    process_and_resize_all_subfolders()
