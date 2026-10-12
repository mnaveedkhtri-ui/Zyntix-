import os
import math
import subprocess
import shutil
from PIL import Image, ImageDraw, ImageFont
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

WIDTH = 1920
HEIGHT = 1080
FPS = 30

FONT_REGULAR = "C:\\Windows\\Fonts\\segoeui.ttf"
FONT_SEMIBOLD = "C:\\Windows\\Fonts\\seguisb.ttf"
FONT_BOLD = "C:\\Windows\\Fonts\\segoeuib.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

font_hero = get_font(FONT_BOLD, 52)
font_title = get_font(FONT_BOLD, 44)
font_title_med = get_font(FONT_BOLD, 34)
font_subtitle = get_font(FONT_REGULAR, 21)
font_pill = get_font(FONT_SEMIBOLD, 15)
font_card_head = get_font(FONT_BOLD, 22)
font_card_text = get_font(FONT_REGULAR, 17)
font_mono = get_font(FONT_REGULAR, 15)
font_url = get_font(FONT_BOLD, 38)

# Frame counts per scene based on actual speech durations:
# Scene 1: 9.05s -> 271 frames
# Scene 2: 11.57s -> 347 frames
# Scene 3: 9.79s -> 294 frames
# Scene 4: 9.86s -> 296 frames
# Scene 5: 8.81s -> 264 frames
# Scene 6: 9.24s -> 278 frames
SCENE_FRAMES = [271, 347, 294, 296, 264, 278]
TOTAL_FRAMES = sum(SCENE_FRAMES)

# Load real UI screenshots
def load_img(path):
    if os.path.exists(path):
        return Image.open(path).convert("RGB")
    return Image.new("RGB", (WIDTH, HEIGHT), (15, 23, 42))

img_landing = load_img("real_ui_landing.png")
img_studio = load_img("real_ui_studio_full.png")
img_features = load_img("real_ui_features.png")
img_howitworks = load_img("real_ui_howitworks.png")
img_live_blog = load_img("real_ui_live_blog.png")
img_blog_list = load_img("real_ui_blog_list.png")

def draw_top_nav(draw, current_tag="LIVE DEMO", pulse=1.0):
    # Left brand
    dot_r = int(7 * pulse)
    draw.ellipse([87 - dot_r, 52 - dot_r, 87 + dot_r, 52 + dot_r], fill=(16, 185, 129))
    draw.text((110, 40), "ZYNTIX STUDIO", fill=(255, 255, 255), font=font_card_head)
    draw.text((290, 44), "THE AUTONOMOUS PUBLICATION ENGINE", fill=(148, 163, 184), font=font_pill)
    
    # Right status badge
    draw.rounded_rectangle([1530, 36, 1840, 68], radius=16, fill=(17, 24, 39), outline=(52, 211, 153), width=1)
    draw.ellipse([1550, 48, 1558, 56], fill=(52, 211, 153))
    draw.text((1570, 44), current_tag, fill=(52, 211, 153), font=font_pill)
    draw.line([80, 84, 1840, 84], fill=(30, 41, 59), width=1)

def draw_browser_chrome(canvas, draw, x, y, w, h, url_text):
    # Outer frame with subtle shadow & border
    draw.rounded_rectangle([x, y, x + w, y + h], radius=18, fill=(17, 24, 39), outline=(55, 65, 81), width=1)
    
    # Window controls
    draw.ellipse([x + 22, y + 16, x + 34, y + 28], fill=(239, 68, 68))
    draw.ellipse([x + 44, y + 16, x + 56, y + 28], fill=(245, 158, 11))
    draw.ellipse([x + 66, y + 16, x + 78, y + 28], fill=(16, 185, 129))
    
    # URL bar
    ux, uy, uw, uh = x + 110, y + 10, w - 220, 28
    draw.rounded_rectangle([ux, uy, ux + uw, uy + uh], radius=8, fill=(11, 15, 25), outline=(30, 41, 59), width=1)
    draw.text((ux + 16, uy + 5), "🔒 " + url_text, fill=(148, 163, 184), font=font_mono)

def draw_mouse_cursor(draw, x, y, clicked=False):
    # Sleek SVG-style cursor pointer
    pts = [
        (x, y),
        (x, y + 24),
        (x + 6, y + 19),
        (x + 12, y + 28),
        (x + 16, y + 26),
        (x + 10, y + 17),
        (x + 18, y + 17)
    ]
    draw.polygon(pts, fill=(255, 255, 255), outline=(0, 0, 0))
    if clicked:
        # Click ripple
        draw.ellipse([x - 14, y - 14, x + 14, y + 14], outline=(52, 211, 153), width=2)
        draw.ellipse([x - 22, y - 22, x + 22, y + 22], outline=(52, 211, 153, 120), width=1)

# --- Render Individual Scene Frames ---

def render_frame_scene_1(t, f, pulse):
    # Scene 1: Real Landing Page + Cursor clicking Open Studio
    img = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "LIVE WEB PLATFORM", pulse)
    
    # Pill & Headings
    draw.rounded_rectangle([80, 108, 300, 138], radius=14, fill=(6, 78, 59), outline=(16, 185, 129), width=1)
    draw.text((98, 114), "STEP 1 : PLATFORM HERO", fill=(52, 211, 153), font=font_pill)
    draw.text((80, 152), "Tired of Paying Agencies for Zero Google Traffic?", fill=(255, 255, 255), font=font_title)
    draw.text((80, 208), "Zyntix Studio builds and deploys autonomous authority publications that rank on autopilot.", fill=(148, 163, 184), font=font_subtitle)
    
    # Browser window
    bx, by, bw, bh = 80, 260, 1760, 780
    draw_browser_chrome(img, draw, bx, by, bw, bh, "https://zyntix-studio-ivory.vercel.app/")
    
    # Crop and paste real landing screenshot inside browser window
    view_w, view_h = bw - 4, bh - 50
    # Subtle zoom over time (1.00 to 1.05)
    zoom = 1.0 + 0.04 * t
    zw = int(1920 / zoom)
    zh = int(850 / zoom)
    crop = img_landing.crop((0, 0, zw, zh)).resize((view_w, view_h), Image.Resampling.LANCZOS)
    img.paste(crop, (bx + 2, by + 46))
    
    # Cursor animation gliding to "Launch Zyntix Studio ->" button (near center-left)
    target_x = bx + int(bw * 0.41)
    target_y = by + 46 + int(view_h * 0.40)
    
    cur_x = int(bx + 100 + (target_x - (bx + 100)) * min(1.0, t * 1.5))
    cur_y = int(by + 500 + (target_y - (by + 500)) * min(1.0, t * 1.5))
    clicked = t > 0.70
    draw_mouse_cursor(draw, cur_x, cur_y, clicked)
    
    if clicked:
        # Floating badge
        draw.rounded_rectangle([target_x + 30, target_y - 20, target_x + 280, target_y + 16], radius=10, fill=(15, 23, 42), outline=(52, 211, 153), width=1)
        draw.text((target_x + 45, target_y - 14), "Opening Zyntix Studio...", fill=(52, 211, 153), font=font_pill)
        
    return img

def render_frame_scene_2(t, f, pulse):
    # Scene 2: Real Studio UI, Entering Niche and Deploying Site
    img = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "1-CLICK DEPLOYMENT", pulse)
    
    draw.rounded_rectangle([80, 108, 300, 138], radius=14, fill=(12, 44, 60), outline=(56, 189, 248), width=1)
    draw.text((98, 114), "STEP 2 : AI STUDIO", fill=(56, 189, 248), font=font_pill)
    draw.text((80, 152), "Deploy A Full Publication in Under 60 Seconds", fill=(255, 255, 255), font=font_title)
    draw.text((80, 208), "Enter your niche or brand name. Zyntix automatically stages responsive architecture with Edge SSL.", fill=(148, 163, 184), font=font_subtitle)
    
    bx, by, bw, bh = 80, 260, 1760, 780
    draw_browser_chrome(img, draw, bx, by, bw, bh, "https://zyntix-studio-ivory.vercel.app/studio")
    
    view_w, view_h = bw - 4, bh - 50
    # Zoom focused on center form
    zoom = 1.05 + 0.05 * t
    cx, cy = 960, 360
    zw = int(1200 / zoom)
    zh = int(600 / zoom)
    crop = img_studio.crop((cx - zw//2, cy - zh//2, cx + zw//2, cy + zh//2)).resize((view_w, view_h), Image.Resampling.LANCZOS)
    img.paste(crop, (bx + 2, by + 46))
    
    # Overlay typing simulation into input boxes
    box_w = 680
    box_h = 48
    in_x = bx + bw//2 - box_w//2
    in_y1 = by + 280
    in_y2 = by + 375
    
    # Typing brand
    full_brand = "Meridian Craft & Architecture"
    brand_chars = int(len(full_brand) * min(1.0, t * 2.2))
    typed_brand = full_brand[:brand_chars]
    
    draw.rounded_rectangle([in_x, in_y1, in_x + box_w, in_y1 + box_h], radius=8, fill=(24, 24, 27), outline=(52, 211, 153), width=2)
    draw.text((in_x + 16, in_y1 + 12), typed_brand, fill=(255, 255, 255), font=font_card_head)
    if (f % 16) < 8 and t < 0.6:
        bw_len = draw.textlength(typed_brand, font=font_card_head)
        draw.line([in_x + 18 + bw_len, in_y1 + 10, in_x + 18 + bw_len, in_y1 + 38], fill=(52, 211, 153), width=2)
        
    # Floating deployment badge when clicked
    if t > 0.65:
        cur_x = in_x + box_w//2
        cur_y = in_y2 + 80
        draw_mouse_cursor(draw, cur_x, cur_y, True)
        
        # Success pill
        draw.rounded_rectangle([bx + bw - 460, by + 70, bx + bw - 60, by + 125], radius=14, fill=(6, 78, 59), outline=(52, 211, 153), width=2)
        draw.ellipse([bx + bw - 440, by + 94, bx + bw - 428, by + 106], fill=(52, 211, 153))
        draw.text((bx + bw - 418, by + 88), "PUBLICATION STAGED & READY", fill=(255, 255, 255), font=font_pill)
        
    return img

def render_frame_scene_3(t, f, pulse):
    # Scene 3: The Semantic AEO Arsenal & How It Works
    img = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "AEO RADAR ENGINE", pulse)
    
    draw.rounded_rectangle([80, 108, 300, 138], radius=14, fill=(46, 16, 101), outline=(167, 139, 250), width=1)
    draw.text((98, 114), "STEP 3 : SEMANTIC AEO", fill=(167, 139, 250), font=font_pill)
    draw.text((80, 152), "Semantic AEO Arsenal & Daisy-Chain Interlinking", fill=(255, 255, 255), font=font_title)
    draw.text((80, 208), "Extracts live buyer intent queries and crafts deep 2,400+ word monographs with verified photography.", fill=(148, 163, 184), font=font_subtitle)
    
    bx, by, bw, bh = 80, 260, 1760, 780
    draw_browser_chrome(img, draw, bx, by, bw, bh, "https://zyntix-studio-ivory.vercel.app/features")
    
    view_w, view_h = bw - 4, bh - 50
    crop = img_features.crop((180, 100, 1740, 850)).resize((view_w, view_h), Image.Resampling.LANCZOS)
    img.paste(crop, (bx + 2, by + 46))
    
    # 3 Floating Glass Feature Cards in foreground
    badges = [
        ("01. INTENT RADAR", "Live Google Autocomplete Queries", (56, 189, 248)),
        ("02. DEEP MONOGRAPHS", "2,400+ Words & Verified Photography", (52, 211, 153)),
        ("03. DAISY-CHAIN MESH", "Automated Contextual Interlinking", (167, 139, 250))
    ]
    card_w = 480
    card_h = 100
    for i, (tag, desc, col) in enumerate(badges):
        cx = bx + 80 + i * (card_w + 60)
        cy = by + bh - 140
        draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=16, fill=(15, 23, 42), outline=col, width=2)
        draw.text((cx + 25, cy + 22), tag, fill=col, font=font_pill)
        draw.text((cx + 25, cy + 50), desc, fill=(255, 255, 255), font=font_card_head)
        
    return img

def render_frame_scene_4(t, f, pulse):
    # Scene 4: 24/7 Autopilot Engine & Google Pings
    img = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "24/7 AUTOPILOT", pulse)
    
    draw.rounded_rectangle([80, 108, 300, 138], radius=14, fill=(6, 78, 59), outline=(16, 185, 129), width=1)
    draw.text((98, 114), "STEP 4 : AUTOPILOT", fill=(52, 211, 153), font=font_pill)
    draw.text((80, 152), "Publishing & Instant Crawl Pings While You Sleep", fill=(255, 255, 255), font=font_title)
    draw.text((80, 208), "Continuous background scheduling automatically pings Google and Bing IndexNow crawlers upon publish.", fill=(148, 163, 184), font=font_subtitle)
    
    bx, by, bw, bh = 80, 260, 1760, 780
    draw_browser_chrome(img, draw, bx, by, bw, bh, "https://zyntix-studio-ivory.vercel.app/studio#autopilot")
    
    # Mission control dashboard panel
    px, py, pw, ph = bx + 40, by + 60, bw - 80, bh - 80
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=20, fill=(10, 14, 23), outline=(30, 41, 59), width=1)
    
    # Top stats row
    stats = [
        ("AUTOPILOT SCHEDULER", "ACTIVE • EVERY 4 HOURS", (52, 211, 153)),
        ("GOOGLE INDEXING API", "100% PINGS DELIVERED", (56, 189, 248)),
        ("INDEXNOW PROTOCOL", "BING & YANDEX CONFIRMED", (167, 139, 250)),
        ("CUSTOM DOMAIN ROUTING", "CLOUDFLARE EDGE SSL OK", (251, 191, 36))
    ]
    sw = (pw - 80) // 4
    for i, (title, val, col) in enumerate(stats):
        sx = px + 20 + i * (sw + 15)
        draw.rounded_rectangle([sx, py + 25, sx + sw, py + 125], radius=14, fill=(17, 24, 39), outline=col, width=1)
        draw.text((sx + 20, py + 45), title, fill=(156, 163, 175), font=font_mono)
        draw.text((sx + 20, py + 75), val, fill=col, font=font_pill)
        
    # Live execution log stream
    lx, ly, lw, lh = px + 20, py + 150, pw - 40, ph - 170
    draw.rounded_rectangle([lx, ly, lx + lw, ly + lh], radius=16, fill=(15, 23, 42), outline=(30, 41, 59), width=1)
    draw.text((lx + 25, ly + 20), "LIVE TELEMETRY FEED (AUTONOMOUS LOGS)", fill=(148, 163, 184), font=font_mono)
    draw.line([lx, ly + 50, lx + lw, ly + 50], fill=(30, 41, 59), width=1)
    
    logs = [
        ("[16:14:02]", "RADAR", "Queried Google Autocomplete API for niche 'Modern Regional Masonry'", (56, 189, 248)),
        ("[16:14:15]", "STUDIO", "Drafted 2,580-word technical monograph with verified Unsplash imagery", (52, 211, 153)),
        ("[16:14:22]", "MESH", "Resolved 4 cross-article semantic anchor links to existing cornerstone posts", (167, 139, 250)),
        ("[16:14:26]", "GOOGLE", "Dispatched URL notification to Google Indexing API (HTTP 200 OK)", (52, 211, 153)),
        ("[16:14:28]", "BING", "Delivered IndexNow batch payload to api.indexnow.org (HTTP 200 OK)", (52, 211, 153)),
        ("[16:14:30]", "NEXT CYCLE", "Standing by. Next automated publication scheduled in 3h 45m", (251, 191, 36))
    ]
    
    log_y = ly + 70
    for tm, tag, txt, col in logs:
        draw.text((lx + 30, log_y), tm, fill=(100, 116, 139), font=font_mono)
        draw.rounded_rectangle([lx + 150, log_y - 2, lx + 270, log_y + 24], radius=6, fill=(10, 14, 23), outline=col, width=1)
        draw.text((lx + 165, log_y + 2), tag, fill=col, font=font_mono)
        draw.text((lx + 295, log_y + 2), txt, fill=(243, 244, 246), font=font_card_text)
        log_y += 54
        
    return img

def render_frame_scene_5(t, f, pulse):
    # Scene 5: Real Live Publication (Meridian Craft & Architecture Blog)
    img = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "LIVE CLIENT PUBLICATION", pulse)
    
    draw.rounded_rectangle([80, 108, 300, 138], radius=14, fill=(6, 78, 59), outline=(16, 185, 129), width=1)
    draw.text((98, 114), "STEP 5 : THE LIVE PROOF", fill=(52, 211, 153), font=font_pill)
    draw.text((80, 152), "Authentic Editorial Authority with Zero AI Noise", fill=(255, 255, 255), font=font_title)
    draw.text((80, 208), "Real live output: Human-crafted typography, verified photography, and high-ranking organic content.", fill=(148, 163, 184), font=font_subtitle)
    
    bx, by, bw, bh = 80, 260, 1760, 780
    draw_browser_chrome(img, draw, bx, by, bw, bh, "https://moderntrendsnow.org/blog")
    
    view_w, view_h = bw - 4, bh - 50
    # Smooth downward scroll simulation
    scroll_y = int(120 * t)
    crop = img_blog_list.crop((0, scroll_y, 1920, scroll_y + 820)).resize((view_w, view_h), Image.Resampling.LANCZOS)
    img.paste(crop, (bx + 2, by + 46))
    
    # Trust verification seal in bottom-right
    sx, sy, sw, sh = bx + bw - 480, by + bh - 160, 440, 120
    draw.rounded_rectangle([sx, sy, sx + sw, sy + sh], radius=18, fill=(15, 23, 42), outline=(52, 211, 153), width=2)
    draw.ellipse([sx + 30, sy + 45, sx + 50, sy + 65], fill=(52, 211, 153))
    draw.text((sx + 65, sy + 30), "GOOGLE HELPFUL CONTENT AUDIT", fill=(52, 211, 153), font=font_pill)
    draw.text((sx + 65, sy + 60), "100% Passed • Verified Authentic", fill=(255, 255, 255), font=font_card_head)
    
    return img

def render_frame_scene_6(t, f, pulse):
    # Scene 6: The Master Call To Action featuring exact user tool URL!
    img = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "GET STARTED NOW", pulse)
    
    # Big Hero CTA Container
    cx, cy, cw, ch = 160, 140, 1600, 860
    draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=28, fill=(15, 23, 42), outline=(16, 185, 129), width=2)
    
    # Ambient halo inside card
    glow_alpha = int(45 + 25 * math.sin(f * 0.15))
    for r in range(400, 100, -60):
        draw.ellipse([cx + cw//2 - r, cy + 380 - r, cx + cw//2 + r, cy + 380 + r], outline=(16, 185, 129, glow_alpha), width=1)
        
    draw.rounded_rectangle([cx + cw//2 - 140, cy + 50, cx + cw//2 + 140, cy + 86], radius=14, fill=(6, 78, 59), outline=(52, 211, 153), width=1)
    draw.text((cx + cw//2 - 110, cy + 58), "AUTONOMOUS ORGANIC GROWTH", fill=(52, 211, 153), font=font_pill)
    
    draw.text((cx + 180, cy + 120), "Stop Working For Your Website.", fill=(255, 255, 255), font=font_hero)
    draw.text((cx + 180, cy + 195), "Let Your Website Work For You.", fill=(52, 211, 153), font=font_hero)
    draw.text((cx + 180, cy + 280), "Join the future of autonomous publications. Zero agency retainers. 100% data ownership.", fill=(148, 163, 184), font=font_subtitle)
    
    # HUGE Glowing Box for the EXACT tool URL requested by user:
    ux, uy, uw, uh = cx + 180, cy + 360, 1240, 130
    draw.rounded_rectangle([ux, uy, ux + uw, uy + uh], radius=20, fill=(10, 14, 23), outline=(52, 211, 153), width=2)
    
    # Pulsing dot
    dot_r = int(10 * pulse)
    draw.ellipse([ux + 50 - dot_r, uy + 65 - dot_r, ux + 50 + dot_r, uy + 65 + dot_r], fill=(16, 185, 129))
    draw.text((ux + 85, uy + 42), "https://zyntix-studio-ivory.vercel.app/", fill=(255, 255, 255), font=font_url)
    
    # Action Button
    bx, by, bw, bh = cx + 180, cy + 530, 480, 70
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=16, fill=(5, 150, 105), outline=(52, 211, 153), width=1)
    draw.text((bx + 60, by + 18), "Launch Zyntix Studio Today →", fill=(255, 255, 255), font=font_card_head)
    
    # Trust badges
    badges = [
        "Instant Subdomain Staging",
        "Free Custom Domain Edge SSL",
        "Google & Bing Search Console Pings",
        "100% Autonomous Pipeline"
    ]
    px = cx + 180
    py = cy + 640
    for badge in badges:
        draw.rounded_rectangle([px, py, px + 280, py + 48], radius=12, fill=(17, 24, 39), outline=(45, 55, 72), width=1)
        draw.ellipse([px + 18, py + 19, px + 28, py + 29], fill=(52, 211, 153))
        draw.text((px + 36, py + 14), badge, fill=(229, 231, 235), font=font_mono)
        px += 310
        
    draw.text((cx + cw//2 - 200, cy + 780), "Live and production-ready for global deployment.", fill=(100, 116, 139), font=font_card_text)
    
    return img

RENDERERS = [
    render_frame_scene_1,
    render_frame_scene_2,
    render_frame_scene_3,
    render_frame_scene_4,
    render_frame_scene_5,
    render_frame_scene_6
]

def generate_video():
    print(f"Generating 1080p Video Stream: {TOTAL_FRAMES} frames ({TOTAL_FRAMES/FPS:.2f}s)...")
    temp_raw = "v2_temp_raw.mp4"
    
    cmd = [
        ffmpeg_exe, "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "faster",
        "-crf", "18",
        temp_raw
    ]
    
    pipe = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    global_f = 0
    for s_idx, n_frames in enumerate(SCENE_FRAMES):
        renderer = RENDERERS[s_idx]
        print(f"Encoding Scene {s_idx + 1}/{len(SCENE_FRAMES)} ({n_frames} frames)...")
        for f in range(n_frames):
            t = f / float(n_frames)
            pulse = 1.0 + 0.25 * math.sin(global_f * 0.2)
            frame = renderer(t, f, pulse)
            
            # Fade from black at very start
            if s_idx == 0 and f < 10:
                black = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
                frame = Image.blend(black, frame, f / 10.0)
                
            # Fade to black at very end
            if s_idx == 5 and f >= (n_frames - 12):
                black = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
                frame = Image.blend(black, frame, (n_frames - f) / 12.0)
                
            pipe.stdin.write(frame.tobytes())
            global_f += 1
            
    pipe.stdin.close()
    pipe.wait()
    print("Video encoding complete!")
    
    # Merge with Master Audio
    final_output = "zyntix_marketing_promo.mp4"
    public_output = os.path.join("public", "zyntix_marketing_promo.mp4")
    
    print("Muxing video with v2 master audio...")
    merge_cmd = [
        ffmpeg_exe, "-y",
        "-i", temp_raw,
        "-i", "v2_master_audio.m4a",
        "-c:v", "copy",
        "-c:a", "copy",
        "-shortest",
        final_output
    ]
    subprocess.run(merge_cmd, check=True)
    shutil.copyfile(final_output, public_output)
    print(f"Success! Master video saved: {final_output} & {public_output}")
    print(f"File Size: {os.path.getsize(final_output) / (1024*1024):.2f} MB")

if __name__ == "__main__":
    generate_video()
