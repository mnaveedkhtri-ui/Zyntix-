import os
import math
import subprocess
import shutil
from PIL import Image, ImageDraw, ImageFont, ImageFilter
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

font_mega = get_font(FONT_BOLD, 68)
font_hero = get_font(FONT_BOLD, 52)
font_title = get_font(FONT_BOLD, 40)
font_title_med = get_font(FONT_BOLD, 30)
font_subtitle = get_font(FONT_REGULAR, 21)
font_pill = get_font(FONT_SEMIBOLD, 15)
font_card_head = get_font(FONT_BOLD, 22)
font_card_text = get_font(FONT_REGULAR, 17)
font_mono = get_font(FONT_REGULAR, 15)
font_mono_bold = get_font(FONT_BOLD, 16)
font_url = get_font(FONT_BOLD, 42)
font_badge = get_font(FONT_BOLD, 25)

# Frame counts per scene: exactly 58.0 seconds total (1,740 frames)
SCENE_FRAMES = [270, 306, 279, 279, 294, 312]
TOTAL_FRAMES = sum(SCENE_FRAMES)

# Load sample photos for editorial scene
photo1 = None
photo2 = None
if os.path.exists("sample_photo1.jpg"):
    photo1 = Image.open("sample_photo1.jpg").convert("RGB")
if os.path.exists("sample_photo2.jpg"):
    photo2 = Image.open("sample_photo2.jpg").convert("RGB")

def ease_in_out(t):
    return (1.0 - math.cos(t * math.pi)) / 2.0

def create_base_canvas(glow_color=(16, 185, 129), glow_alpha=40):
    # Dark obsidian base with subtle ambient radial glow
    canvas = Image.new("RGB", (WIDTH, HEIGHT), (8, 12, 22))
    draw = ImageDraw.Draw(canvas)
    
    # Subtle tech grid dots/lines
    for x in range(0, WIDTH, 80):
        draw.line([x, 0, x, HEIGHT], fill=(15, 23, 42), width=1)
    for y in range(0, HEIGHT, 80):
        draw.line([0, y, WIDTH, y], fill=(15, 23, 42), width=1)
        
    return canvas

def draw_top_nav(draw, current_tag="LIVE DEMO", pulse=1.0):
    dot_r = int(7 * pulse)
    draw.ellipse([87 - dot_r, 52 - dot_r, 87 + dot_r, 52 + dot_r], fill=(16, 185, 129))
    draw.text((110, 40), "ZYNTIX STUDIO", fill=(255, 255, 255), font=font_card_head)
    draw.text((290, 44), "// THE AUTONOMOUS PUBLICATION ENGINE", fill=(148, 163, 184), font=font_pill)
    
    draw.rounded_rectangle([1530, 36, 1840, 68], radius=16, fill=(17, 24, 39), outline=(52, 211, 153), width=1)
    draw.ellipse([1550, 48, 1558, 56], fill=(52, 211, 153))
    draw.text((1570, 44), current_tag, fill=(52, 211, 153), font=font_pill)
    draw.line([80, 84, 1840, 84], fill=(30, 41, 59), width=1)

def draw_kinetic_banner(draw, text, y=980, color=(52, 211, 153), bg=(6, 78, 59)):
    w = int(draw.textlength(text, font=font_badge)) + 60
    x = WIDTH // 2 - w // 2
    draw.rounded_rectangle([x, y, x + w, y + 54], radius=16, fill=bg, outline=color, width=2)
    draw.text((x + 30, y + 12), text, fill=(255, 255, 255), font=font_badge)

def draw_browser_chrome(draw, x, y, w, h, url_text):
    draw.rounded_rectangle([x, y, x + w, y + h], radius=18, fill=(13, 18, 30), outline=(55, 65, 81), width=1)
    # Window dots
    draw.ellipse([x + 22, y + 16, x + 34, y + 28], fill=(239, 68, 68))
    draw.ellipse([x + 44, y + 16, x + 56, y + 28], fill=(245, 158, 11))
    draw.ellipse([x + 66, y + 16, x + 78, y + 28], fill=(16, 185, 129))
    # URL bar
    ux, uy, uw, uh = x + 110, y + 10, w - 220, 28
    draw.rounded_rectangle([ux, uy, ux + uw, uy + uh], radius=8, fill=(8, 12, 20), outline=(30, 41, 59), width=1)
    draw.text((ux + 16, uy + 5), "🔒 " + url_text, fill=(148, 163, 184), font=font_mono)

def draw_mouse_cursor(draw, x, y, clicked=False):
    pts = [
        (x, y),
        (x, y + 26),
        (x + 7, y + 20),
        (x + 13, y + 30),
        (x + 17, y + 28),
        (x + 11, y + 18),
        (x + 20, y + 18)
    ]
    draw.polygon(pts, fill=(255, 255, 255), outline=(0, 0, 0))
    if clicked:
        draw.ellipse([x - 16, y - 16, x + 16, y + 16], outline=(52, 211, 153), width=3)


# ==========================================================
# SCENE 1: THE DISRUPTION (0:00 - 9.00s | 270 frames)
# ==========================================================
def render_scene_1(t, f, pulse):
    img = create_base_canvas()
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "THE PROBLEM & THE CURE", pulse)
    
    # Step tag
    draw.rounded_rectangle([80, 108, 330, 140], radius=14, fill=(69, 10, 10), outline=(239, 68, 68), width=1)
    draw.text((98, 116), "WHY BRANDS FAIL ON GOOGLE", fill=(248, 113, 113), font=font_pill)
    
    # Kinetic Big Punch Headline
    zoom = 1.0 + 0.03 * ease_in_out(t)
    draw.text((80, 155), "Stop Burning $5,000/Month on Slow SEO Agencies.", fill=(255, 255, 255), font=font_title)
    draw.text((80, 210), "Traditional agencies give you 4 shallow posts a month. Zyntix deploys autonomous organic dominance.", fill=(148, 163, 184), font=font_subtitle)
    
    # Battle Comparison Cards
    card_w = 840
    card_h = 580
    cy = 270
    
    # Left Card: Traditional Agency (Red Alert)
    cx1 = 80
    draw.rounded_rectangle([cx1, cy, cx1 + card_w, cy + card_h], radius=20, fill=(18, 12, 16), outline=(239, 68, 68), width=2)
    draw.rounded_rectangle([cx1 + 30, cy + 30, cx1 + 320, cy + 70], radius=12, fill=(69, 10, 10))
    draw.text((cx1 + 45, cy + 40), "TRADITIONAL SEO AGENCIES", fill=(248, 113, 113), font=font_pill)
    
    agency_points = [
        ("❌ $5,000 to $15,000 Monthly Retainers", "Bleeding cash on manual account managers"),
        ("❌ 3 to 6 Months Waiting Time", "Zero organic momentum while competitors win"),
        ("❌ 4 Generic 800-Word Blog Posts", "Shallow fluff written by inexperienced freelancers"),
        ("❌ Broken Manual Internal Links", "Orphaned pages that Google bots ignore")
    ]
    for i, (head, sub) in enumerate(agency_points):
        py = cy + 105 + i * 110
        draw.rounded_rectangle([cx1 + 30, py, cx1 + card_w - 30, py + 95], radius=14, fill=(28, 15, 20), outline=(69, 10, 10), width=1)
        draw.text((cx1 + 50, py + 18), head, fill=(254, 202, 202), font=font_card_head)
        draw.text((cx1 + 50, py + 52), sub, fill=(156, 163, 175), font=font_card_text)
        
    # Right Card: Zyntix Studio (Emerald Cyber Glow)
    cx2 = 1000
    draw.rounded_rectangle([cx2, cy, cx2 + card_w, cy + card_h], radius=20, fill=(10, 25, 20), outline=(52, 211, 153), width=2)
    draw.rounded_rectangle([cx2 + 30, cy + 30, cx2 + 340, cy + 70], radius=12, fill=(6, 78, 59))
    draw.text((cx2 + 45, cy + 40), "⚡ ZYNTIX AUTONOMOUS ENGINE", fill=(52, 211, 153), font=font_pill)
    
    zyntix_points = [
        ("✓ 1-Click Autonomous Deployment", "Your branded magazine staged live in 60 seconds"),
        ("✓ Continuous 24/7 Autopilot Schedule", "Fresh monographs published every 4 hours automatically"),
        ("✓ Deep 2,400+ Word Semantic Monographs", "In-depth buyer intent analysis with verified photography"),
        ("✓ Daisy-Chain Backlink Mesh Topology", "Every single article passes domain authority automatically")
    ]
    for i, (head, sub) in enumerate(zyntix_points):
        py = cy + 105 + i * 110
        draw.rounded_rectangle([cx2 + 30, py, cx2 + card_w - 30, py + 95], radius=14, fill=(12, 38, 28), outline=(16, 185, 129), width=1)
        draw.text((cx2 + 50, py + 18), head, fill=(167, 243, 208), font=font_card_head)
        draw.text((cx2 + 50, py + 52), sub, fill=(148, 163, 184), font=font_card_text)
        
    # Bottom Banner
    if t < 0.45:
        draw_kinetic_banner(draw, "STOP BURNING CASH ON OUTDATED SEO AGENCIES", 980, (239, 68, 68), (69, 10, 10))
    else:
        draw_kinetic_banner(draw, "✦ MEET ZYNTIX STUDIO : THE AUTONOMOUS ENGINE", 980, (52, 211, 153), (6, 78, 59))
        
    return img


# ==========================================================
# SCENE 2: 1-CLICK STUDIO DEPLOYMENT (9.00 - 19.20s | 306 frames)
# ==========================================================
def render_scene_2(t, f, pulse):
    img = create_base_canvas()
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "LIVE STUDIO WALKTHROUGH", pulse)
    
    draw.rounded_rectangle([80, 108, 330, 140], radius=14, fill=(12, 44, 60), outline=(56, 189, 248), width=1)
    draw.text((98, 116), "STEP 1 : INSTANT SETUP", fill=(56, 189, 248), font=font_pill)
    
    draw.text((80, 155), "Deploy a High-Performance Publication in Under 60 Seconds.", fill=(255, 255, 255), font=font_title)
    draw.text((80, 210), "Simply input your brand name and target niche. Zyntix provisions Edge SSL and schema automation.", fill=(148, 163, 184), font=font_subtitle)
    
    # Sleek Studio Dashboard Browser Window
    bx, by, bw, bh = 80, 260, 1760, 690
    draw_browser_chrome(draw, bx, by, bw, bh, "https://zyntix-studio-ivory.vercel.app/studio")
    
    # Inside Dashboard View
    ix, iy, iw, ih = bx + 40, by + 55, bw - 80, bh - 75
    draw.rounded_rectangle([ix, iy, ix + iw, iy + ih], radius=16, fill=(11, 15, 25), outline=(30, 41, 59), width=1)
    
    # Left Input Panel (Form)
    fx, fy, fw, fh = ix + 40, iy + 40, 780, ih - 80
    draw.rounded_rectangle([fx, fy, fx + fw, fy + fh], radius=16, fill=(15, 23, 42), outline=(51, 65, 85), width=1)
    draw.text((fx + 30, fy + 30), "STAGING CONFIGURATION", fill=(56, 189, 248), font=font_pill)
    draw.text((fx + 30, fy + 60), "Configure Target Entity & Domain", fill=(255, 255, 255), font=font_card_head)
    
    # Input 1: Brand
    draw.text((fx + 30, fy + 110), "Brand / Company Name", fill=(148, 163, 184), font=font_pill)
    full_brand = "Meridian Craft & Architecture"
    chars_brand = int(len(full_brand) * min(1.0, t * 2.5))
    typed_brand = full_brand[:chars_brand]
    cursor = "_" if (int(f * 0.4) % 2 == 0) and t < 0.6 else ""
    draw.rounded_rectangle([fx + 30, fy + 135, fx + fw - 30, fy + 185], radius=10, fill=(24, 24, 27), outline=(52, 211, 153) if t > 0.1 else (51, 65, 85), width=2)
    draw.text((fx + 45, fy + 147), typed_brand + cursor, fill=(255, 255, 255), font=font_mono_bold)
    
    # Input 2: Target Domain
    draw.text((fx + 30, fy + 210), "Target Domain / Publication Path", fill=(148, 163, 184), font=font_pill)
    full_domain = "https://moderntrendsnow.org"
    chars_dom = int(len(full_domain) * max(0.0, min(1.0, (t - 0.25) * 2.5)))
    typed_dom = full_domain[:chars_dom]
    draw.rounded_rectangle([fx + 30, fy + 235, fx + fw - 30, fy + 285], radius=10, fill=(24, 24, 27), outline=(56, 189, 248) if t > 0.35 else (51, 65, 85), width=2)
    draw.text((fx + 45, fy + 247), typed_dom, fill=(255, 255, 255), font=font_mono_bold)
    
    # Input 3: Autopilot Schedule
    draw.text((fx + 30, fy + 310), "Autonomous Publishing Cadence", fill=(148, 163, 184), font=font_pill)
    draw.rounded_rectangle([fx + 30, fy + 335, fx + fw - 30, fy + 385], radius=10, fill=(24, 24, 27), outline=(167, 139, 250), width=1)
    draw.text((fx + 45, fy + 347), "⚡ 24/7 Autopilot : Every 4 Hours (6 Monographs/Day)", fill=(167, 139, 250), font=font_mono_bold)
    
    # Deploy Button
    btn_y = fy + 420
    clicked = t > 0.65
    btn_col = (16, 185, 129) if not clicked else (52, 211, 153)
    draw.rounded_rectangle([fx + 30, btn_y, fx + fw - 30, btn_y + 60], radius=12, fill=btn_col)
    btn_text = "⚡ DEPLOY AUTOPILOT ENGINE" if not clicked else "✓ DEPLOYED & ACTIVE (EDGE SSL)"
    draw.text((fx + 180, btn_y + 18), btn_text, fill=(11, 15, 25), font=font_card_head)
    
    # Right Status & Verification Panel
    rx, ry, rw, rh = ix + 850, fy, iw - 890, fh
    draw.rounded_rectangle([rx, ry, rx + rw, ry + rh], radius=16, fill=(15, 23, 42), outline=(51, 65, 85), width=1)
    draw.text((rx + 30, ry + 30), "REAL-TIME ENGINE TELEMETRY", fill=(16, 185, 129), font=font_pill)
    draw.text((rx + 30, ry + 60), "Instant Infrastructure Staging", fill=(255, 255, 255), font=font_card_head)
    
    checklist = [
        ("Edge CDN & Vercel SSL", "Active on global edge nodes", t > 0.4),
        ("Autonomous Postgres Cluster", "Schemas mounted & verified", t > 0.5),
        ("Daisy-Chain Backlink Engine", "Internal mesh interlinks armed", t > 0.6),
        ("Google & Bing Crawl Sockets", "Instant ping webhooks ready", t > 0.7)
    ]
    for i, (title, sub, active) in enumerate(checklist):
        cy_item = ry + 110 + i * 85
        box_bg = (12, 38, 28) if active else (24, 24, 27)
        box_stroke = (16, 185, 129) if active else (51, 65, 85)
        draw.rounded_rectangle([rx + 30, cy_item, rx + rw - 30, cy_item + 70], radius=12, fill=box_bg, outline=box_stroke, width=1)
        check_icon = "✓" if active else "○"
        check_col = (52, 211, 153) if active else (148, 163, 184)
        draw.text((rx + 48, cy_item + 22), check_icon, fill=check_col, font=font_card_head)
        draw.text((rx + 85, cy_item + 14), title, fill=(255, 255, 255) if active else (156, 163, 175), font=font_card_head)
        draw.text((rx + 85, cy_item + 40), sub, fill=(148, 163, 184), font=font_card_text)
        
    # Animated Mouse Cursor
    target_x = fx + fw // 2
    target_y = btn_y + 30
    cur_x = int(fx + 100 + (target_x - (fx + 100)) * min(1.0, t * 1.5))
    cur_y = int(fy + 200 + (target_y - (fy + 200)) * min(1.0, t * 1.5))
    draw_mouse_cursor(draw, cur_x, cur_y, clicked)
    
    # Bottom Banner
    if clicked:
        draw_kinetic_banner(draw, "⚡ PRODUCTION LIVE AT MODERNTRENDSNOW.ORG", 980, (52, 211, 153), (6, 78, 59))
    else:
        draw_kinetic_banner(draw, "1-CLICK AUTOPILOT : ZERO CODE REQUIRED", 980, (56, 189, 248), (12, 44, 60))
        
    return img


# ==========================================================
# SCENE 3: THE SEMANTIC AEO WEAPON (19.20 - 28.50s | 279 frames)
# ==========================================================
def render_scene_3(t, f, pulse):
    img = create_base_canvas()
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "SEMANTIC AEO RADAR ARSENAL", pulse)
    
    draw.rounded_rectangle([80, 108, 330, 140], radius=14, fill=(46, 16, 101), outline=(167, 139, 250), width=1)
    draw.text((98, 116), "STEP 2 : AEO INTELLIGENCE", fill=(167, 139, 250), font=font_pill)
    
    draw.text((80, 155), "The Semantic AEO Radar & Daisy-Chain Authority Mesh.", fill=(255, 255, 255), font=font_title)
    draw.text((80, 210), "Zyntix scans live search queries, targets high-intent ranking gaps, and synthesizes 2,400+ word monographs.", fill=(148, 163, 184), font=font_subtitle)
    
    # 3 Glowing Pillar Cards (Top Half)
    pillars = [
        ("01. INTENT RADAR", "Live Search Gap Exploitation", "Scans Google & Perplexity query voids in real-time, targeting keywords with zero quality competition.", (56, 189, 248), (12, 44, 60)),
        ("02. DEEP MONOGRAPHS", "2,400+ Words & Real Photos", "In-depth technical architecture with structured citations, table of contents, and verified photography.", (52, 211, 153), (6, 78, 59)),
        ("03. DAISY-CHAIN MESH", "Automated Semantic Equity", "Every newly published article automatically interlinks with previous monographs, maximizing domain power.", (167, 139, 250), (46, 16, 101))
    ]
    card_w = 560
    card_h = 240
    cy = 265
    for i, (num, head, desc, col, bg_col) in enumerate(pillars):
        cx = 80 + i * (card_w + 40)
        draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=18, fill=(15, 23, 42), outline=col, width=2)
        draw.rounded_rectangle([cx + 25, cy + 25, cx + 220, cy + 60], radius=10, fill=bg_col)
        draw.text((cx + 38, cy + 34), num, fill=col, font=font_pill)
        draw.text((cx + 25, cy + 80), head, fill=(255, 255, 255), font=font_card_head)
        
        # Word wrapped description
        words = desc.split()
        line1 = " ".join(words[:7])
        line2 = " ".join(words[7:14])
        line3 = " ".join(words[14:])
        draw.text((cx + 25, cy + 125), line1, fill=(148, 163, 184), font=font_card_text)
        draw.text((cx + 25, cy + 152), line2, fill=(148, 163, 184), font=font_card_text)
        draw.text((cx + 25, cy + 179), line3, fill=(148, 163, 184), font=font_card_text)
        
    # Interactive Hockey-Stick Traffic Growth Chart (Bottom Half)
    gy, gh = 540, 410
    draw.rounded_rectangle([80, gy, 80 + 1760, gy + gh], radius=20, fill=(11, 15, 25), outline=(51, 65, 85), width=1)
    draw.text((120, gy + 30), "ORGANIC SEARCH VISIBILITY & GOOGLE BOT INDEXATION", fill=(52, 211, 153), font=font_pill)
    draw.text((120, gy + 60), "Exponential Organic Traffic Compound Curve", fill=(255, 255, 255), font=font_card_head)
    
    # Draw Grid & Axis lines
    chart_x, chart_y, chart_w, chart_h = 120, gy + 110, 1680, 240
    for l in range(4):
        ly = chart_y + l * 60
        draw.line([chart_x, ly, chart_x + chart_w, ly], fill=(30, 41, 59), width=1)
    draw.text((chart_x, chart_y - 20), "50,000 / mo", fill=(100, 116, 139), font=font_mono)
    draw.text((chart_x, chart_y + 100), "25,000 / mo", fill=(100, 116, 139), font=font_mono)
    draw.text((chart_x, chart_y + 220), "0 Visitors", fill=(100, 116, 139), font=font_mono)
    
    # Animated Curve Progress
    pts = []
    num_pts = 60
    curve_prog = min(1.0, t * 1.4)
    for p in range(int(num_pts * curve_prog)):
        frac = p / float(num_pts)
        px_pt = chart_x + int(frac * chart_w)
        # Exponential curve
        py_pt = chart_y + chart_h - int(math.pow(frac, 2.5) * (chart_h - 20))
        pts.append((px_pt, py_pt))
        
    if len(pts) > 1:
        draw.line(pts, fill=(52, 211, 153), width=4)
        last_pt = pts[-1]
        draw.ellipse([last_pt[0] - 8, last_pt[1] - 8, last_pt[0] + 8, last_pt[1] + 8], fill=(255, 255, 255), outline=(16, 185, 129), width=3)
        # Tooltip badge
        draw.rounded_rectangle([last_pt[0] - 90, last_pt[1] - 50, last_pt[0] + 90, last_pt[1] - 14], radius=8, fill=(6, 78, 59), outline=(52, 211, 153), width=1)
        draw.text((last_pt[0] - 78, last_pt[1] - 44), "48,500 Visits / Mo", fill=(255, 255, 255), font=font_mono_bold)
        
    draw_kinetic_banner(draw, "2,400+ WORDS • VERIFIED PHOTOGRAPHY • ZERO AI FLUFF", 980, (167, 139, 250), (46, 16, 101))
    return img


# ==========================================================
# SCENE 4: 24/7 AUTOPILOT & CRAWLER RADAR (28.50 - 37.80s | 279 frames)
# ==========================================================
def render_scene_4(t, f, pulse):
    img = create_base_canvas()
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "24/7 AUTOPILOT CRAWLER ENGINE", pulse)
    
    draw.rounded_rectangle([80, 108, 330, 140], radius=14, fill=(6, 78, 59), outline=(16, 185, 129), width=1)
    draw.text((98, 116), "STEP 3 : 24/7 AUTOPILOT", fill=(52, 211, 153), font=font_pill)
    
    draw.text((80, 155), "Continuous Publishing & Crawler Pings While You Sleep.", fill=(255, 255, 255), font=font_title)
    draw.text((80, 210), "Zyntix background crons alert Google Indexing API and Bing IndexNow endpoints the instant articles go live.", fill=(148, 163, 184), font=font_subtitle)
    
    # Left Half: Sonar Radar Scanner
    rx, ry, rw, rh = 80, 260, 680, 690
    draw.rounded_rectangle([rx, ry, rx + rw, ry + rh], radius=20, fill=(10, 15, 25), outline=(16, 185, 129), width=2)
    draw.text((rx + 30, ry + 25), "LIVE BOT RADAR SCANNER", fill=(52, 211, 153), font=font_pill)
    draw.text((rx + 30, ry + 55), "Search Crawler Infiltration", fill=(255, 255, 255), font=font_card_head)
    
    # Radar Circles
    rc_x, rc_y = rx + rw // 2, ry + 360
    for radius in [80, 160, 240]:
        draw.ellipse([rc_x - radius, rc_y - radius, rc_x + radius, rc_y + radius], outline=(30, 58, 48), width=1)
    draw.line([rc_x - 240, rc_y, rc_x + 240, rc_y], fill=(30, 58, 48), width=1)
    draw.line([rc_x, rc_y - 240, rc_x, rc_y + 240], fill=(30, 58, 48), width=1)
    
    # Sweeping radar beam
    angle = (f * 5.0) % 360
    rad = math.radians(angle)
    bx_end = rc_x + int(240 * math.cos(rad))
    by_end = rc_y + int(240 * math.sin(rad))
    draw.line([rc_x, rc_y, bx_end, by_end], fill=(52, 211, 153), width=2)
    
    # Radar targets (Bots)
    bots = [
        ("Googlebot-Desktop (200 OK)", rc_x + 90, rc_y - 110, (52, 211, 153)),
        ("Bingbot IndexNow Socket", rc_x - 130, rc_y + 80, (56, 189, 248)),
        ("Perplexity AI Crawler", rc_x + 120, rc_y + 130, (167, 139, 250))
    ]
    for b_name, bx_pos, by_pos, b_col in bots:
        draw.ellipse([bx_pos - 6, by_pos - 6, bx_pos + 6, by_pos + 6], fill=b_col)
        draw.text((bx_pos + 12, by_pos - 8), b_name, fill=b_col, font=font_mono_bold)
        
    # Right Half: Live Terminal Log Feed
    tx, ty, tw, th = 790, 260, 1050, 690
    draw.rounded_rectangle([tx, ty, tx + tw, ty + th], radius=20, fill=(8, 12, 20), outline=(51, 65, 85), width=1)
    
    # Terminal Header
    draw.rounded_rectangle([tx, ty, tx + tw, ty + 50], radius=18, fill=(15, 23, 42))
    draw.ellipse([tx + 20, ty + 20, tx + 30, ty + 30], fill=(239, 68, 68))
    draw.ellipse([tx + 38, ty + 20, tx + 48, ty + 30], fill=(245, 158, 11))
    draw.ellipse([tx + 56, ty + 20, tx + 66, ty + 30], fill=(16, 185, 129))
    draw.text((tx + 85, ty + 16), "zyntix-daemon://crawler-socket-telemetry", fill=(148, 163, 184), font=font_mono)
    
    logs = [
        ("04:00:01", "AUTOPILOT SCHEDULER", "Cron triggered for moderntrendsnow.org", (148, 163, 184)),
        ("04:00:03", "AEO INTENT RADAR", "Scanned 14,000 queries. Identified: 'Brutalist Micro-Cement'", (56, 189, 248)),
        ("04:00:06", "DEEP RESEARCH MONOGRAPH", "Drafted 2,680 words with verified structural case studies", (52, 211, 153)),
        ("04:00:08", "PHOTOGRAPHY INJECTOR", "Selected 3 verified high-res architectural photos", (251, 191, 36)),
        ("04:00:09", "DAISY-CHAIN ENGINE", "Interlinked 8 contextual anchors with existing monographs", (167, 139, 250)),
        ("04:00:10", "PUBLICATION DEPLOYED", "HTTP 200 OK live on moderntrendsnow.org/craft", (52, 211, 153)),
        ("04:00:11", "GOOGLE INDEXING API", "Ping delivered. Batch status: 200 SUCCESS (Indexed)", (52, 211, 153)),
        ("04:00:12", "INDEXNOW PROTOCOL", "Broadcasted URL to Bing, Naver, and Yandex crawlers", (56, 189, 248))
    ]
    
    visible_logs = int(len(logs) * min(1.0, t * 1.5))
    for i in range(visible_logs):
        time_str, tag_str, msg_str, col = logs[i]
        ly = ty + 70 + i * 72
        draw.rounded_rectangle([tx + 25, ly, tx + tw - 25, ly + 60], radius=10, fill=(15, 23, 42), outline=(30, 41, 59), width=1)
        draw.text((tx + 40, ly + 20), time_str, fill=(100, 116, 139), font=font_mono)
        draw.text((tx + 125, ly + 20), f"[{tag_str}]", fill=col, font=font_mono_bold)
        draw.text((tx + 380, ly + 20), msg_str, fill=(241, 245, 249), font=font_mono)
        
    draw_kinetic_banner(draw, "THE AUTONOMOUS ENGINE WORKS 24/7 WHILE YOU SLEEP", 980, (52, 211, 153), (6, 78, 59))
    return img


# ==========================================================
# SCENE 5: LIVE PROOF - ARCHITECTURAL MONOGRAPH (37.80 - 47.60s | 294 frames)
# ==========================================================
def render_scene_5(t, f, pulse):
    img = create_base_canvas()
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "LIVE PUBLISHED PROOF", pulse)
    
    draw.rounded_rectangle([80, 108, 330, 140], radius=14, fill=(6, 78, 59), outline=(16, 185, 129), width=1)
    draw.text((98, 116), "STEP 4 : REAL RESULTS", fill=(52, 211, 153), font=font_pill)
    
    draw.text((80, 155), "Real Published Architectural Proof on ModernTrendsNow.org.", fill=(255, 255, 255), font=font_title)
    draw.text((80, 210), "Not a generic mockup. Real architectural monographs with verified high-resolution photography and rankings.", fill=(148, 163, 184), font=font_subtitle)
    
    # Left Half: Editorial Magazine Card Showcase
    mx, my, mw, mh = 80, 260, 940, 690
    draw.rounded_rectangle([mx, my, mx + mw, my + mh], radius=20, fill=(13, 18, 30), outline=(51, 65, 85), width=1)
    
    # Insert High-Res Photo into Monograph Hero (sample_photo1.jpg)
    if photo1:
        pw_box = mw - 40
        ph_box = 320
        # Zoom effect on photo
        crop_zoom = 1.0 + 0.04 * t
        cw = int(photo1.width / crop_zoom)
        ch = int(photo1.height / crop_zoom)
        p_crop = photo1.crop((0, 0, cw, ch)).resize((pw_box, ph_box), Image.Resampling.LANCZOS)
        img.paste(p_crop, (mx + 20, my + 20))
        # Draw glossy border over photo
        draw.rounded_rectangle([mx + 20, my + 20, mx + 20 + pw_box, my + 20 + ph_box], radius=12, outline=(51, 65, 85), width=1)
    
    # Article Metadata & Typography
    draw.rounded_rectangle([mx + 30, my + 360, mx + 250, my + 395], radius=8, fill=(6, 78, 59))
    draw.text((mx + 45, my + 370), "LIVE MONOGRAPH • CRAFT", fill=(52, 211, 153), font=font_pill)
    draw.text((mx + 30, my + 415), "Monolithic Concrete & Timeless Architecture", fill=(255, 255, 255), font=font_title_med)
    draw.text((mx + 30, my + 465), "A 2,480-word treatise examining thermal mass, acoustic dampening, and brutalist integrity.", fill=(148, 163, 184), font=font_card_text)
    
    stats_pills = [
        "📖 2,480 WORDS",
        "📸 4 VERIFIED PHOTOS",
        "⚡ 0.38s EDGE TTFB",
        "🔗 12 DAISY-CHAIN LINKS"
    ]
    for s_i, s_txt in enumerate(stats_pills):
        px_pill = mx + 30 + s_i * 215
        draw.rounded_rectangle([px_pill, my + 520, px_pill + 200, my + 560], radius=8, fill=(24, 24, 27), outline=(52, 211, 153), width=1)
        draw.text((px_pill + 16, my + 532), s_txt, fill=(52, 211, 153), font=font_mono_bold)
        
    draw.line([mx + 30, my + 590, mx + mw - 30, my + 590], fill=(30, 41, 59), width=1)
    draw.text((mx + 30, my + 610), "Published to: moderntrendsnow.org/craft/architectural-monograph", fill=(56, 189, 248), font=font_mono_bold)
    
    # Right Half: Google SERP Rank #1 Showcase
    gx, gy, gw, gh = 1050, 260, 790, 690
    draw.rounded_rectangle([gx, gy, gx + gw, gy + gh], radius=20, fill=(15, 23, 42), outline=(52, 211, 153), width=2)
    
    draw.rounded_rectangle([gx + 30, gy + 30, gx + 280, gy + 70], radius=12, fill=(6, 78, 59))
    draw.text((gx + 45, gy + 42), "RANK #1 ON GOOGLE SEARCH", fill=(52, 211, 153), font=font_pill)
    
    # Google SERP Mockup Box
    box_y = gy + 90
    draw.rounded_rectangle([gx + 30, box_y, gx + gw - 30, box_y + 240], radius=16, fill=(11, 15, 25), outline=(51, 65, 85), width=1)
    
    draw.text((gx + 50, box_y + 25), "https://moderntrendsnow.org > craft > architectural-monograph", fill=(148, 163, 184), font=font_mono)
    draw.text((gx + 50, box_y + 55), "Monolithic Concrete & Modern Architecture: Complete 2026 Guide", fill=(56, 189, 248), font=font_card_head)
    draw.text((gx + 50, box_y + 90), "★★★★★  Rating: 5.0 · 48 Reviews · Free In-Depth Monograph", fill=(245, 158, 11), font=font_mono)
    
    snippet = "Comprehensive architectural study of micro-cement brutalism, tactile surfaces, and sustainable concrete finishes authored by Meridian Craft..."
    draw.text((gx + 50, box_y + 125), snippet[:70], fill=(203, 213, 225), font=font_card_text)
    draw.text((gx + 50, box_y + 150), snippet[70:], fill=(203, 213, 225), font=font_card_text)
    
    draw.rounded_rectangle([gx + 50, box_y + 185, gx + 280, box_y + 215], radius=6, fill=(12, 38, 28))
    draw.text((gx + 65, box_y + 192), "✓ VERIFIED 100% INDEXED", fill=(52, 211, 153), font=font_mono_bold)
    
    # Performance Metric Card
    draw.rounded_rectangle([gx + 30, gy + 360, gx + gw - 30, gy + 640], radius=16, fill=(11, 15, 25), outline=(51, 65, 85), width=1)
    draw.text((gx + 50, gy + 385), "REAL AUDIENCE & ENGAGEMENT METRICS", fill=(148, 163, 184), font=font_pill)
    
    metrics = [
        ("48,200", "Monthly Organic Impressions", (52, 211, 153)),
        ("4.8 Mins", "Average Reading Time", (56, 189, 248)),
        ("98.4%", "Core Web Vitals Score", (167, 139, 250)),
        ("0.38s", "Global Edge Latency", (251, 191, 36))
    ]
    for mi, (m_val, m_lbl, m_col) in enumerate(metrics):
        m_x = gx + 50 + (mi % 2) * 350
        m_y = gy + 430 + (mi // 2) * 95
        draw.text((m_x, m_y), m_val, fill=m_col, font=font_title)
        draw.text((m_x, m_y + 45), m_lbl, fill=(148, 163, 184), font=font_mono)
        
    draw_kinetic_banner(draw, "REAL MONOGRAPHS • REAL RANKINGS • PROVEN TRAFFIC", 980, (52, 211, 153), (6, 78, 59))
    return img


# ==========================================================
# SCENE 6: GRAND FINALE CTA (47.60 - 58.00s | 312 frames)
# ==========================================================
def render_scene_6(t, f, pulse):
    img = create_base_canvas()
    draw = ImageDraw.Draw(img)
    draw_top_nav(draw, "LAUNCH YOUR ENGINE TODAY", pulse)
    
    # Center Big Kinetic Typography
    cy_head = 150
    draw.text((WIDTH // 2 - 380, cy_head), "CLAIM YOUR SEARCH SUPREMACY.", fill=(255, 255, 255), font=font_hero)
    draw.text((WIDTH // 2 - 470, cy_head + 65), "Deploy Your Autonomous 24/7 Publication Engine in 60 Seconds.", fill=(148, 163, 184), font=font_subtitle)
    
    # Grand Centerpiece Glassmorphic URL Card
    cw = 1440
    ch = 440
    cx = WIDTH // 2 - cw // 2
    cy = 280
    
    # Pulsing glowing outline
    glow_width = int(2 + 2 * pulse)
    draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=24, fill=(10, 18, 30), outline=(52, 211, 153), width=glow_width)
    
    # Brand Top Badge
    draw.rounded_rectangle([cx + cw // 2 - 160, cy + 40, cx + cw // 2 + 160, cy + 85], radius=14, fill=(6, 78, 59), outline=(16, 185, 129), width=1)
    draw.text((cx + cw // 2 - 130, cy + 52), "✦ OFFICIAL STUDIO PLATFORM", fill=(52, 211, 153), font=font_pill)
    
    # Huge URL in bold typography
    url_target = "https://zyntix-studio-ivory.vercel.app/"
    u_len = draw.textlength(url_target, font=font_url)
    
    # Animated Light Beam Traveling Across URL
    beam_x = int(cx + (cw * (f % 45) / 45.0))
    draw.line([beam_x, cy + 130, beam_x + 60, cy + 130], fill=(255, 255, 255), width=3)
    
    draw.text((WIDTH // 2 - u_len // 2, cy + 120), url_target, fill=(255, 255, 255), font=font_url)
    
    # Subtitle inside Card
    draw.text((WIDTH // 2 - 280, cy + 195), "Instant Access • Zero Retainers • Continuous Organic Growth", fill=(148, 163, 184), font=font_card_head)
    
    # 3 High-Impact Trust Pills inside Card
    trust = [
        ("⚡ 1-Click Autopilot", "Zero code setup required"),
        ("🛡️ Edge CDN & SSL", "Cloudflare & Vercel powered"),
        ("🚀 2,400+ Word Quality", "Strict anti-fluff architecture")
    ]
    for i, (t_head, t_sub) in enumerate(trust):
        tx_pill = cx + 80 + i * 440
        ty_pill = cy + 260
        draw.rounded_rectangle([tx_pill, ty_pill, tx_pill + 400, ty_pill + 85], radius=14, fill=(15, 23, 42), outline=(51, 65, 85), width=1)
        draw.text((tx_pill + 25, ty_pill + 16), t_head, fill=(52, 211, 153), font=font_card_head)
        draw.text((tx_pill + 25, ty_pill + 46), t_sub, fill=(148, 163, 184), font=font_card_text)
        
    # Massive CTA Button
    btn_w = 640
    btn_h = 75
    btn_x = WIDTH // 2 - btn_w // 2
    btn_y = cy + ch + 50
    draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=18, fill=(16, 185, 129), outline=(52, 211, 153), width=2)
    draw.text((btn_x + 105, btn_y + 22), "⚡ LAUNCH YOUR STUDIO ENGINE NOW ->", fill=(11, 15, 25), font=font_card_head)
    
    # Bottom Banner
    draw_kinetic_banner(draw, "CLAIM YOUR PUBLICATION AT ZYNTIX-STUDIO-IVORY.VERCEL.APP", 980, (52, 211, 153), (6, 78, 59))
    return img


RENDERERS = [
    render_scene_1,
    render_scene_2,
    render_scene_3,
    render_scene_4,
    render_scene_5,
    render_scene_6
]

def build_video():
    print(f"Building Ultra-High Quality 1080p Masterpiece Video: {TOTAL_FRAMES} frames ({TOTAL_FRAMES/FPS:.2f}s)...")
    temp_raw = "masterpiece_temp_raw.mp4"
    
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
        print(f"Rendering Scene {s_idx + 1}/{len(SCENE_FRAMES)} ({n_frames} frames)...")
        for f in range(n_frames):
            t = f / float(n_frames)
            pulse = 1.0 + 0.25 * math.sin(global_f * 0.2)
            frame = renderer(t, f, pulse)
            
            # Cross-fade in first 8 frames of scene 1 and last 10 frames of scene 6
            if s_idx == 0 and f < 8:
                black = Image.new("RGB", (WIDTH, HEIGHT), (8, 12, 22))
                frame = Image.blend(black, frame, f / 8.0)
            if s_idx == 5 and f >= (n_frames - 10):
                black = Image.new("RGB", (WIDTH, HEIGHT), (8, 12, 22))
                frame = Image.blend(black, frame, (n_frames - f) / 10.0)
                
            pipe.stdin.write(frame.tobytes())
            global_f += 1
            
    pipe.stdin.close()
    pipe.wait()
    print("Video encoding complete!")
    
    # Mux with Epic Master Audio (Voice + Tech Soundtrack + SFX)
    final_output = "zyntix_marketing_promo.mp4"
    public_output = os.path.join("public", "zyntix_marketing_promo.mp4")
    
    print("Muxing video with epic master audio bed...")
    merge_cmd = [
        ffmpeg_exe, "-y",
        "-i", temp_raw,
        "-i", "epic_master_audio.m4a",
        "-c:v", "copy",
        "-c:a", "copy",
        "-shortest",
        final_output
    ]
    subprocess.run(merge_cmd, check=True)
    shutil.copyfile(final_output, public_output)
    
    # Deploy to Desktop and Downloads
    desktop_dest = "C:\\Users\\EliteBook\\Desktop\\zyntix_marketing_promo.mp4"
    downloads_dest = "C:\\Users\\EliteBook\\Downloads\\zyntix_marketing_promo.mp4"
    artifact_dest = "C:\\Users\\EliteBook\\.gemini\\antigravity\\brain\\bcdf68a4-58d5-455a-82ec-8edbdefc745b\\zyntix_marketing_promo.mp4"
    
    shutil.copyfile(final_output, desktop_dest)
    shutil.copyfile(final_output, downloads_dest)
    shutil.copyfile(final_output, artifact_dest)
    
    if os.path.exists(temp_raw):
        os.remove(temp_raw)
        
    print(f"SUCCESS! Masterpiece promo saved to all locations!")
    print(f"Size: {os.path.getsize(final_output) / (1024*1024):.2f} MB")

if __name__ == "__main__":
    build_video()
