import os
import sys
import math
import subprocess
import numpy as np
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

font_hero = get_font(FONT_BOLD, 54)
font_title_large = get_font(FONT_BOLD, 50)
font_title_med = get_font(FONT_BOLD, 36)
font_subtitle = get_font(FONT_REGULAR, 22)
font_pill = get_font(FONT_SEMIBOLD, 15)
font_card_head = get_font(FONT_BOLD, 22)
font_card_text = get_font(FONT_REGULAR, 17)
font_card_bold = get_font(FONT_BOLD, 17)
font_mono = get_font(FONT_REGULAR, 15)
font_mono_bold = get_font(FONT_BOLD, 15)

# Frame counts per scene based on speech durations
SCENE_FRAMES = [
    336, # Scene 1: 11.21s
    297, # Scene 2: 9.91s
    292, # Scene 3: 9.74s
    326, # Scene 4: 10.87s
    313, # Scene 5: 10.42s
    260  # Scene 6: 8.64s
]
TOTAL_FRAMES = sum(SCENE_FRAMES)

def draw_header_nav(draw, active_pill_text="LIVE PROTOCOL ACTIVE", pulse=1.0):
    # Left brand
    dot_r = int(7 * pulse)
    draw.ellipse([87 - dot_r, 59 - dot_r, 87 + dot_r, 59 + dot_r], fill=(16, 185, 129))
    draw.text((110, 48), "ZYNTIX", fill=(255, 255, 255), font=font_card_head)
    draw.text((210, 52), "AUTONOMOUS SEARCH ENGINE", fill=(148, 163, 184), font=font_pill)
    
    # Right status badge
    draw.rounded_rectangle([1560, 44, 1840, 76], radius=16, fill=(17, 24, 39), outline=(52, 211, 153), width=1)
    draw.ellipse([1580, 56, 1588, 64], fill=(52, 211, 153))
    draw.text((1600, 52), active_pill_text, fill=(52, 211, 153), font=font_pill)
    
    # Top divider
    draw.line([80, 95, 1840, 95], fill=(30, 41, 59), width=1)

def create_base_canvas(active_pill_text="LIVE PROTOCOL ACTIVE"):
    img = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
    draw = ImageDraw.Draw(img)
    for r in range(520, 100, -50):
        draw.ellipse([1620 - r, 120 - r, 1620 + r, 120 + r], outline=(16, 185, 129, 30), width=1)
    for r in range(400, 80, -60):
        draw.ellipse([200 - r, 980 - r, 200 + r, 980 + r], outline=(99, 102, 241, 30), width=1)
    return img

# --- Pre-render Base Scenes ---

def render_scene_1_base():
    img = create_base_canvas("SEARCH REALITY")
    draw = ImageDraw.Draw(img)
    draw_header_nav(draw, "SEARCH REALITY", 1.0)
    
    draw.rounded_rectangle([80, 130, 290, 162], radius=16, fill=(31, 41, 55), outline=(75, 85, 99), width=1)
    draw.text((102, 137), "THE SEARCH REALITY", fill=(209, 213, 219), font=font_pill)
    
    draw.text((80, 180), "90% of business websites get zero traffic from Google.", fill=(255, 255, 255), font=font_title_large)
    draw.text((80, 248), "Traditional agencies charge high retainers for slow, manual work that never ranks.", fill=(148, 163, 184), font=font_subtitle)
    
    # Left: Traditional
    cx1, cy1, cw1, ch1 = 80, 320, 840, 680
    draw.rounded_rectangle([cx1, cy1, cx1 + cw1, cy1 + ch1], radius=24, fill=(20, 24, 33), outline=(239, 68, 68), width=1)
    draw.rounded_rectangle([cx1 + 40, cy1 + 40, cx1 + 270, cy1 + 72], radius=12, fill=(69, 10, 10))
    draw.text((cx1 + 55, cy1 + 46), "TRADITIONAL AGENCY", fill=(248, 113, 113), font=font_pill)
    draw.text((cx1 + 40, cy1 + 100), "Slow, High-Cost & Manual", fill=(255, 255, 255), font=font_title_med)
    
    bullets_a = [
        ("$3,500 - $6,000 / month", "Heavy monthly agency retainers with zero guarantees"),
        ("Only 3-4 articles per month", "Slow publication rate leaves search queries untouched"),
        ("Manual writer bottlenecks", "Weeks of drafting, edits, revisions and back-and-forth"),
        ("Zero instant indexing", "Pages sit dormant waiting for Google crawl bots"),
        ("Unpredictable results", "Months of spend with flatline organic visibility")
    ]
    by = cy1 + 175
    for title, desc in bullets_a:
        draw.ellipse([cx1 + 42, by + 6, cx1 + 52, by + 16], fill=(239, 68, 68))
        draw.text((cx1 + 65, by), title, fill=(255, 255, 255), font=font_card_bold)
        draw.text((cx1 + 65, by + 26), desc, fill=(148, 163, 184), font=font_card_text)
        by += 72
        
    # Right: Zyntix
    cx2, cy2, cw2, ch2 = 980, 320, 840, 680
    draw.rounded_rectangle([cx2, cy2, cx2 + cw2, cy2 + ch2], radius=24, fill=(16, 27, 28), outline=(16, 185, 129), width=2)
    draw.rounded_rectangle([cx2 + 40, cy2 + 40, cx2 + 250, cy2 + 72], radius=12, fill=(6, 78, 59))
    draw.text((cx2 + 55, cy2 + 46), "ZYNTIX AUTONOMOUS", fill=(52, 211, 153), font=font_pill)
    draw.text((cx2 + 40, cy2 + 100), "Fast, Scalable & 24/7", fill=(255, 255, 255), font=font_title_med)
    
    bullets_b = [
        ("10x Lower Investment", "Zero bloated agency teams or hourly billing fees"),
        ("Daily In-Depth Publications", "Deep 2,400+ word guides capturing every search gap"),
        ("Real-Time SERP Gap Radar", "Targets actual buyer intent queries from live Google data"),
        ("Instant Google & Bing Pings", "Automatic search console crawl notification upon publish"),
        ("Compounding Authority", "Continuous internal linking builds long-term domain rank")
    ]
    by = cy2 + 175
    for title, desc in bullets_b:
        draw.ellipse([cx2 + 42, by + 6, cx2 + 52, by + 16], fill=(52, 211, 153))
        draw.text((cx2 + 65, by), title, fill=(255, 255, 255), font=font_card_bold)
        draw.text((cx2 + 65, by + 26), desc, fill=(148, 163, 184), font=font_card_text)
        by += 72
        
    return img

def render_scene_2_base():
    img = create_base_canvas("ENGINE ARCHITECTURE")
    draw = ImageDraw.Draw(img)
    draw_header_nav(draw, "ENGINE ARCHITECTURE", 1.0)
    
    draw.rounded_rectangle([80, 130, 310, 162], radius=16, fill=(6, 78, 59), outline=(16, 185, 129), width=1)
    draw.text((98, 137), "INTRODUCING ZYNTIX", fill=(52, 211, 153), font=font_pill)
    
    draw.text((80, 180), "The Autonomous Authority & Organic Traffic Engine", fill=(255, 255, 255), font=font_title_large)
    draw.text((80, 248), "Engineered to capture Google search rankings without manual writing or agency retainers.", fill=(148, 163, 184), font=font_subtitle)
    
    cols = [
        {
            "num": "01",
            "tag": "RADAR DISCOVERY",
            "tag_color": (56, 189, 248),
            "tag_bg": (12, 44, 60),
            "title": "SERP Gap Hunter",
            "desc_lines": [
                "Continuously probes Google autocomplete and real buyer",
                "queries to pinpoint unserved keyword search gaps."
            ],
            "points": [
                "Live Google autocomplete search streams",
                "High commercial buyer intent filtering",
                "Zero-competition topic clustering"
            ]
        },
        {
            "num": "02",
            "tag": "EDITORIAL ENGINE",
            "tag_color": (52, 211, 153),
            "tag_bg": (6, 78, 59),
            "title": "Autonomous Studio",
            "desc_lines": [
                "Synthesizes 2,400+ word industry monographs tailored",
                "for Google's Helpful Content System."
            ],
            "points": [
                "Verified commercial high-res photography",
                "Semantic headers (H2/H3) and FAQ schema",
                "Automated internal backlink mesh network"
            ]
        },
        {
            "num": "03",
            "tag": "INSTANT DEPLOYMENT",
            "tag_color": (167, 139, 250),
            "tag_bg": (46, 16, 101),
            "title": "24/7 Autopilot Sync",
            "desc_lines": [
                "Publishes on your custom schedule and automatically",
                "alerts search engine crawlers in real-time."
            ],
            "points": [
                "Automated Google & Bing search console pings",
                "Dynamic XML sitemap auto-regeneration",
                "Custom domain Edge SSL deployment in 2 mins"
            ]
        }
    ]
    
    col_w = 540
    gap = 60
    start_x = 80
    y_top = 330
    h_box = 670
    
    for i, col in enumerate(cols):
        cx = start_x + i * (col_w + gap)
        draw.rounded_rectangle([cx, y_top, cx + col_w, y_top + h_box], radius=24, fill=(17, 24, 39), outline=(55, 65, 81), width=1)
        
        draw.text((cx + 40, y_top + 40), col["num"], fill=(75, 85, 99), font=font_title_med)
        draw.rounded_rectangle([cx + 120, y_top + 42, cx + 340, y_top + 74], radius=12, fill=col["tag_bg"])
        draw.text((cx + 135, y_top + 48), col["tag"], fill=col["tag_color"], font=font_pill)
        
        draw.text((cx + 40, y_top + 105), col["title"], fill=(255, 255, 255), font=font_title_med)
        
        dy = y_top + 165
        for dline in col["desc_lines"]:
            draw.text((cx + 40, dy), dline, fill=(156, 163, 175), font=font_card_text)
            dy += 26
            
        draw.line([cx + 40, y_top + 260, cx + col_w - 40, y_top + 260], fill=(31, 41, 55), width=1)
        
        py = y_top + 300
        for pt in col["points"]:
            draw.ellipse([cx + 42, py + 6, cx + 52, py + 16], fill=col["tag_color"])
            draw.text((cx + 65, py), pt, fill=(243, 244, 246), font=font_card_text)
            py += 64
            
    return img

def render_scene_3_base():
    img = create_base_canvas("SEARCH DISCOVERY RADAR")
    draw = ImageDraw.Draw(img)
    draw_header_nav(draw, "SEARCH DISCOVERY RADAR", 1.0)
    
    draw.rounded_rectangle([80, 130, 310, 162], radius=16, fill=(12, 44, 60), outline=(56, 189, 248), width=1)
    draw.text((98, 137), "STEP 1 : SERP RADAR", fill=(56, 189, 248), font=font_pill)
    
    draw.text((80, 180), "Target Real Buyer Intent in Real-Time.", fill=(255, 255, 255), font=font_title_large)
    draw.text((80, 248), "Never guess keywords. Zyntix uncovers unserved search queries before competitors notice.", fill=(148, 163, 184), font=font_subtitle)
    
    cx, cy, cw, ch = 80, 320, 1760, 680
    draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=24, fill=(17, 24, 39), outline=(55, 65, 81), width=1)
    
    bx, by, bw, bh = cx + 80, cy + 60, cw - 160, 76
    draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=20, fill=(31, 41, 55), outline=(99, 102, 241), width=2)
    draw.ellipse([bx + 30, by + 26, bx + 50, by + 46], outline=(148, 163, 184), width=3)
    draw.text((bx + 70, by + 22), "sustainable modern architecture design trends 2026", fill=(255, 255, 255), font=font_card_head)
    
    dy = by + bh + 30
    draw.text((bx, dy), "LIVE GOOGLE AUTOCOMPLETE GAPS IDENTIFIED :", fill=(148, 163, 184), font=font_pill)
    
    results = [
        ("best acoustic timber cladding for modern offices", "High Commercial Intent", (52, 211, 153), "Keyword Difficulty: 12 (Very Easy)"),
        ("sustainable stone exterior finishes cost comparison", "Zero Competition Gap", (56, 189, 248), "Search Volume: +340% YoY"),
        ("thermal insulation performance of reclaimed oak beams", "High-Value Buyer Query", (167, 139, 250), "Ready for Autonomous Generation"),
        ("bespoke commercial glazing energy standards 2026", "Commercial Inquiry", (251, 191, 36), "Immediate First Page Opportunity")
    ]
    
    ry = dy + 45
    for text, badge, color, sub in results:
        draw.rounded_rectangle([bx, ry, bx + bw, ry + 82], radius=16, fill=(24, 32, 47), outline=(45, 55, 72), width=1)
        draw.ellipse([bx + 25, ry + 32, bx + 43, ry + 50], fill=color)
        draw.text((bx + 65, ry + 16), text, fill=(255, 255, 255), font=font_card_head)
        draw.text((bx + 65, ry + 46), sub, fill=(156, 163, 175), font=font_mono)
        
        badge_w = 260
        draw.rounded_rectangle([bx + bw - badge_w - 30, ry + 24, bx + bw - 30, ry + 58], radius=12, fill=(15, 23, 42), outline=color, width=1)
        draw.text((bx + bw - badge_w - 10, ry + 30), badge, fill=color, font=font_pill)
        ry += 98
        
    return img

def render_scene_4_base():
    img = create_base_canvas("EDITORIAL STUDIO")
    draw = ImageDraw.Draw(img)
    draw_header_nav(draw, "EDITORIAL STUDIO", 1.0)
    
    draw.rounded_rectangle([80, 130, 310, 162], radius=16, fill=(46, 16, 101), outline=(167, 139, 250), width=1)
    draw.text((98, 137), "STEP 2 : EDITORIAL STUDIO", fill=(167, 139, 250), font=font_pill)
    
    draw.text((80, 180), "Authoritative Long-Form Content & Verified Photography", fill=(255, 255, 255), font=font_title_large)
    draw.text((80, 248), "Every monograph is an in-depth, technical guide crafted to satisfy Google's Helpful Content System.", fill=(148, 163, 184), font=font_subtitle)
    
    # Left: High-Res Real Photography
    cx1, cy1, cw1, ch1 = 80, 320, 800, 680
    draw.rounded_rectangle([cx1, cy1, cx1 + cw1, cy1 + ch1], radius=24, fill=(17, 24, 39), outline=(55, 65, 81), width=1)
    
    try:
        sample_img = Image.open("sample_photo1.jpg").convert("RGB")
        sample_img = sample_img.resize((720, 480), Image.Resampling.LANCZOS)
        img.paste(sample_img, (cx1 + 40, cy1 + 40))
    except Exception as e:
        pass
        
    draw.rounded_rectangle([cx1 + 60, cy1 + 60, cx1 + 360, cy1 + 96], radius=12, fill=(15, 23, 42))
    draw.text((cx1 + 75, cy1 + 67), "VERIFIED COMMERCIAL ASSET", fill=(52, 211, 153), font=font_pill)
    
    draw.text((cx1 + 40, cy1 + 540), "High-Resolution Architectural Context", fill=(255, 255, 255), font=font_card_head)
    draw.text((cx1 + 40, cy1 + 578), "Every publication embeds context-matched, professional photography", fill=(156, 163, 175), font=font_card_text)
    draw.text((cx1 + 40, cy1 + 604), "with complete Alt tags, captions, and commercial attribution.", fill=(156, 163, 175), font=font_card_text)
    
    # Right: Article Typography & Metadata
    cx2, cy2, cw2, ch2 = 920, 320, 920, 680
    draw.rounded_rectangle([cx2, cy2, cx2 + cw2, cy2 + ch2], radius=24, fill=(17, 24, 39), outline=(55, 65, 81), width=1)
    
    draw.rounded_rectangle([cx2 + 40, cy2 + 40, cx2 + 220, cy2 + 80], radius=12, fill=(6, 78, 59))
    draw.text((cx2 + 55, cy2 + 48), "2,650 WORDS", fill=(52, 211, 153), font=font_pill)
    
    draw.rounded_rectangle([cx2 + 240, cy2 + 40, cx2 + 440, cy2 + 80], radius=12, fill=(12, 44, 60))
    draw.text((cx2 + 255, cy2 + 48), "GRADE 11 SCORE", fill=(56, 189, 248), font=font_pill)
    
    draw.rounded_rectangle([cx2 + 460, cy2 + 40, cx2 + 690, cy2 + 80], radius=12, fill=(46, 16, 101))
    draw.text((cx2 + 475, cy2 + 48), "SCHEMA.ORG JSON-LD", fill=(167, 139, 250), font=font_pill)
    
    draw.text((cx2 + 40, cy2 + 115), "Modern Architectural Timber Systems", fill=(255, 255, 255), font=font_title_med)
    draw.text((cx2 + 40, cy2 + 168), "By Zyntix Autonomous Intelligence  •  Published Today", fill=(148, 163, 184), font=font_mono)
    
    draw.line([cx2 + 40, cy2 + 205, cx2 + cw2 - 40, cy2 + 205], fill=(31, 41, 55), width=1)
    
    draw.text((cx2 + 40, cy2 + 230), "Section 2.1: Acoustic Decibel Attenuation", fill=(56, 189, 248), font=font_card_head)
    
    body_lines = [
        "Modern engineered wood assemblies achieve exceptional thermal isolation and acoustic dampening.",
        "When specified with tongue-and-groove micro-perforated battens, internal sound reverberation",
        "drops significantly across commercial workspaces.",
        "",
        "Cross-laminated timber systems also sequester up to 800 kilograms of atmospheric carbon per cubic",
        "meter, outperforming standard steel framing while satisfying stringent 2026 building codes."
    ]
    by = cy2 + 275
    for line in body_lines:
        draw.text((cx2 + 40, by), line, fill=(209, 213, 219), font=font_card_text)
        by += 32
        
    draw.rounded_rectangle([cx2 + 40, cy2 + 500, cx2 + cw2 - 40, cy2 + 610], radius=16, fill=(24, 32, 47), outline=(52, 211, 153), width=1)
    draw.ellipse([cx2 + 65, cy2 + 535, cx2 + 79, cy2 + 549], fill=(52, 211, 153))
    draw.text((cx2 + 95, cy2 + 525), "AUTOMATED INTERNAL BACKLINK MESH", fill=(52, 211, 153), font=font_pill)
    draw.text((cx2 + 95, cy2 + 555), "Hyperlinked: \"Reclaimed Hardwood Standards for Commercial Facades\"", fill=(255, 255, 255), font=font_card_text)
    
    return img

def render_scene_5_base():
    img = create_base_canvas("AUTONOMOUS CLOUD ENGINE")
    draw = ImageDraw.Draw(img)
    draw_header_nav(draw, "AUTONOMOUS CLOUD ENGINE", 1.0)
    
    draw.rounded_rectangle([80, 130, 310, 162], radius=16, fill=(6, 78, 59), outline=(16, 185, 129), width=1)
    draw.text((98, 137), "STEP 3 : 24/7 AUTOPILOT", fill=(52, 211, 153), font=font_pill)
    
    draw.text((80, 180), "Set It Once. Watch Your Authority Compound.", fill=(255, 255, 255), font=font_title_large)
    draw.text((80, 248), "Autonomous publishing, automated Google indexing pings, and Edge SSL custom domains.", fill=(148, 163, 184), font=font_subtitle)
    
    stat_w = 540
    gap = 60
    stats = [
        ("48", "PUBLISHED MONOGRAPHS", "100% Comprehensive Coverage", (52, 211, 153)),
        ("100%", "INDEXING API PINGS", "Google & Bing Real-Time Sync", (56, 189, 248)),
        ("0.4s", "EDGE CDN LATENCY", "Cloudflare Global Cache Active", (167, 139, 250))
    ]
    for i, (val, label, sub, color) in enumerate(stats):
        sx = 80 + i * (stat_w + gap)
        draw.rounded_rectangle([sx, 320, sx + stat_w, 480], radius=20, fill=(17, 24, 39), outline=(55, 65, 81), width=1)
        draw.text((sx + 40, 345), val, fill=color, font=font_hero)
        draw.text((sx + 40, 420), label, fill=(255, 255, 255), font=font_pill)
        draw.text((sx + 40, 445), sub, fill=(156, 163, 175), font=font_mono)
        
    tx, ty, tw, th = 80, 520, 1760, 480
    draw.rounded_rectangle([tx, ty, tx + tw, ty + th], radius=24, fill=(10, 14, 23), outline=(30, 41, 59), width=1)
    
    draw.ellipse([tx + 30, ty + 25, tx + 42, ty + 37], fill=(239, 68, 68))
    draw.ellipse([tx + 52, ty + 25, tx + 64, ty + 37], fill=(245, 158, 11))
    draw.ellipse([tx + 74, ty + 25, tx + 86, ty + 37], fill=(16, 185, 129))
    draw.text((tx + 110, ty + 20), "ZYNTIX AUTONOMOUS SCHEDULER & INDEXING CONSOLE", fill=(148, 163, 184), font=font_mono)
    draw.line([tx, ty + 56, tx + tw, ty + 56], fill=(30, 41, 59), width=1)
    
    logs = [
        ("[16:08:12]", "RADAR SCAN", "Discovered 18 unserved long-tail queries for modern residential timber", (56, 189, 248)),
        ("[16:08:24]", "EDITORIAL", "Synthesized 2,640-word technical guide with 2 verified Unsplash visuals", (52, 211, 153)),
        ("[16:08:31]", "MESH GRAPH", "Connected 6 cross-article internal hyperlinks to boost topic authority", (167, 139, 250)),
        ("[16:08:35]", "GOOGLE PING", "Delivered real-time XML notification to Google Indexing API (HTTP 200)", (52, 211, 153)),
        ("[16:08:38]", "BING PING", "IndexNow protocol notification successfully confirmed by Bing endpoint", (52, 211, 153)),
        ("[16:08:40]", "NEXT CYCLE", "Queue armed. Next automated publication scheduled in 3h 51m", (251, 191, 36))
    ]
    
    ly = ty + 85
    for time_str, tag, msg, color in logs:
        draw.text((tx + 40, ly), time_str, fill=(100, 116, 139), font=font_mono)
        draw.rounded_rectangle([tx + 170, ly - 2, tx + 310, ly + 24], radius=8, fill=(15, 23, 42), outline=color, width=1)
        draw.text((tx + 185, ly + 2), tag, fill=color, font=font_mono_bold)
        draw.text((tx + 340, ly + 2), msg, fill=(243, 244, 246), font=font_card_text)
        ly += 60
        
    return img

def render_scene_6_base():
    img = create_base_canvas("DEPLOY YOUR PLATFORM")
    draw = ImageDraw.Draw(img)
    draw_header_nav(draw, "DEPLOY YOUR PLATFORM", 1.0)
    
    draw.rounded_rectangle([80, 130, 310, 162], radius=16, fill=(6, 78, 59), outline=(16, 185, 129), width=1)
    draw.text((98, 137), "GET STARTED TODAY", fill=(52, 211, 153), font=font_pill)
    
    cx, cy, cw, ch = 200, 240, 1520, 680
    draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=32, fill=(17, 24, 39), outline=(16, 185, 129), width=2)
    
    draw.text((cx + 170, cy + 80), "Stop Burning Hours on Manual SEO.", fill=(255, 255, 255), font=font_hero)
    draw.text((cx + 185, cy + 160), "Experience Autonomous Organic Traffic.", fill=(52, 211, 153), font=font_hero)
    
    draw.text((cx + 280, cy + 260), "Dominate Google search results on complete autopilot 24 hours a day.", fill=(148, 163, 184), font=font_subtitle)
    
    # Big URL box centered
    ux, uy, uw, uh = cx + 260, cy + 340, 1000, 110
    draw.rounded_rectangle([ux, uy, ux + uw, uy + uh], radius=24, fill=(11, 15, 25), outline=(52, 211, 153), width=2)
    
    draw.ellipse([ux + 160, uy + 45, ux + 180, uy + 65], fill=(16, 185, 129))
    draw.text((ux + 210, uy + 28), "moderntrendsnow.org", fill=(255, 255, 255), font=font_hero)
    
    badges = [
        "100% Autonomous Pipeline",
        "Custom Domain & Free Edge SSL",
        "Instant Search Console Pings",
        "Zero Agency Retainers"
    ]
    
    bx = cx + 180
    by = cy + 500
    for badge in badges:
        draw.rounded_rectangle([bx, by, bx + 270, by + 48], radius=14, fill=(15, 23, 42), outline=(45, 55, 72), width=1)
        draw.ellipse([bx + 18, by + 19, bx + 28, by + 29], fill=(52, 211, 153))
        draw.text((bx + 38, by + 14), badge, fill=(229, 231, 235), font=font_pill)
        bx += 290
        
    draw.text((cx + 510, cy + 590), "Launch in 2 Minutes  •  Full Data Privacy & Ownership", fill=(100, 116, 139), font=font_card_text)
    return img

# --- Main Video Pipe Generator ---

def build_video():
    print("Pre-rendering base scene graphics...")
    bases = [
        render_scene_1_base(),
        render_scene_2_base(),
        render_scene_3_base(),
        render_scene_4_base(),
        render_scene_5_base(),
        render_scene_6_base()
    ]
    
    print(f"Total video duration: {TOTAL_FRAMES / FPS:.2f} seconds ({TOTAL_FRAMES} frames)")
    
    # Setup FFmpeg output pipe
    temp_raw_video = "temp_raw_video.mp4"
    ffmpeg_cmd = [
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
        temp_raw_video
    ]
    
    pipe = subprocess.Popen(ffmpeg_cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    global_frame = 0
    for scene_idx, n_frames in enumerate(SCENE_FRAMES):
        base_img = bases[scene_idx]
        print(f"Encoding Scene {scene_idx + 1} ({n_frames} frames)...")
        
        for f in range(n_frames):
            t = f / n_frames # 0.0 to 1.0 progress in scene
            
            # Create frame copy
            frame = base_img.copy()
            draw = ImageDraw.Draw(frame)
            
            # Animated elements per scene
            # Pulse calculation
            pulse = 1.0 + 0.3 * math.sin(global_frame * 0.2)
            
            # Scene 3: Animated blinking cursor
            if scene_idx == 2:
                bx = 80 + 80
                by = 320 + 60
                cursor_visible = (global_frame % 20) < 10
                if cursor_visible:
                    draw.line([bx + 725, by + 20, bx + 725, by + 56], fill=(52, 211, 153), width=3)
                    
            # Scene 5: Pulse next cycle dot
            if scene_idx == 4:
                tx = 80
                ty = 520
                ly_next = ty + 85 + 5 * 60
                dot_r = int(6 * pulse)
                draw.ellipse([tx + 185 - dot_r, ly_next + 12 - dot_r, tx + 185 + dot_r, ly_next + 12 + dot_r], fill=(251, 191, 36))
                
            # Scene 6: Glowing pulse around URL
            if scene_idx == 5:
                cx = 200
                cy = 240
                ux, uy, uw, uh = cx + 260, cy + 340, 1000, 110
                glow_alpha = int(40 + 25 * math.sin(global_frame * 0.15))
                draw.rounded_rectangle([ux - 2, uy - 2, ux + uw + 2, uy + uh + 2], radius=26, outline=(16, 185, 129, glow_alpha), width=2)
                
            # Cross-fade in first 10 frames of scene
            if f < 10 and scene_idx > 0:
                prev_base = bases[scene_idx - 1]
                alpha = f / 10.0
                frame = Image.blend(prev_base, frame, alpha)
            elif f < 10 and scene_idx == 0:
                # Fade from black
                black = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
                alpha = f / 10.0
                frame = Image.blend(black, frame, alpha)
                
            # Fade to black in last 12 frames of video
            if scene_idx == 5 and f >= (n_frames - 12):
                black = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
                alpha = (n_frames - f) / 12.0
                frame = Image.blend(black, frame, alpha)

            pipe.stdin.write(frame.tobytes())
            global_frame += 1

    pipe.stdin.close()
    pipe.wait()
    print("Video stream finished encoding!")
    
    # Merge Video with Master Audio
    final_output = "zyntix_marketing_promo.mp4"
    public_output = os.path.join("public", "zyntix_marketing_promo.mp4")
    
    print("Merging video with master voiceover and ambient music...")
    merge_cmd = [
        ffmpeg_exe, "-y",
        "-i", temp_raw_video,
        "-i", "master_audio.m4a",
        "-c:v", "copy",
        "-c:a", "copy",
        "-shortest",
        final_output
    ]
    subprocess.run(merge_cmd, check=True)
    
    # Copy to public folder
    import shutil
    shutil.copyfile(final_output, public_output)
    print(f"Master marketing promo created successfully: {final_output} & {public_output}")
    
    # Print file info
    size_mb = os.path.getsize(final_output) / (1024 * 1024)
    print(f"Final file size: {size_mb:.2f} MB")

if __name__ == "__main__":
    build_video()
