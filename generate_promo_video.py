import os
import sys
import math
import wave
import struct
import numpy as np

# Force UTF-8 stdout on Windows
if sys.stdout:
    sys.stdout.reconfigure(encoding='utf-8')
if sys.stderr:
    sys.stderr.reconfigure(encoding='utf-8')

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio
import imageio_ffmpeg

# Output file paths
OUTPUT_DIR = r"C:\Users\EliteBook\.gemini\antigravity\scratch\Zyntix"
PUBLIC_DIR = os.path.join(OUTPUT_DIR, "public")
os.makedirs(PUBLIC_DIR, exist_ok=True)

TEMP_VIDEO = os.path.join(OUTPUT_DIR, "temp_video.mp4")
TEMP_AUDIO = os.path.join(OUTPUT_DIR, "temp_audio.wav")
FINAL_VIDEO_1 = os.path.join(OUTPUT_DIR, "zyntix_marketing_promo.mp4")
FINAL_VIDEO_2 = os.path.join(PUBLIC_DIR, "zyntix_marketing_promo.mp4")

WIDTH = 1920
HEIGHT = 1080
FPS = 30
DURATION_SEC = 32
TOTAL_FRAMES = DURATION_SEC * FPS

# Fonts
FONT_DIR = r"C:\Windows\Fonts"
FONT_SEGOE_BOLD = os.path.join(FONT_DIR, "segoeuib.ttf")
FONT_SEGOE = os.path.join(FONT_DIR, "segoeui.ttf")
FONT_CONSOLAS_BOLD = os.path.join(FONT_DIR, "consolab.ttf")
FONT_ARIAL_BOLD = os.path.join(FONT_DIR, "arialbd.ttf")

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except Exception:
        return ImageFont.load_default()

# Pre-load fonts of various sizes
f_hero = get_font(FONT_SEGOE_BOLD, 78)
f_title = get_font(FONT_SEGOE_BOLD, 52)
f_subtitle = get_font(FONT_SEGOE_BOLD, 36)
f_body_bold = get_font(FONT_SEGOE_BOLD, 28)
f_body = get_font(FONT_SEGOE, 26)
f_small_bold = get_font(FONT_SEGOE_BOLD, 22)
f_small = get_font(FONT_SEGOE, 20)
f_mono = get_font(FONT_CONSOLAS_BOLD, 22)
f_mono_large = get_font(FONT_CONSOLAS_BOLD, 32)
f_pill = get_font(FONT_SEGOE_BOLD, 18)

# Color Palette (Cyber Luxury Gold & Emerald)
C_BG_BASE = (9, 9, 11)          # Deep Obsidian
C_CARD_BG = (18, 18, 22, 235)   # Glass dark
C_CARD_BORDER = (45, 45, 55)
C_AMBER = (245, 158, 11)        # Electric Amber
C_AMBER_LIGHT = (252, 211, 77)
C_EMERALD = (16, 185, 129)      # Neon Emerald
C_CYAN = (6, 182, 212)
C_WHITE = (255, 255, 255)
C_GRAY_LIGHT = (212, 212, 216)
C_GRAY_MUTED = (140, 140, 150)
C_RED = (239, 68, 68)

def ease_out_cubic(x):
    return 1.0 - math.pow(1.0 - max(0.0, min(1.0, x)), 3)

def ease_in_out(x):
    return 0.5 - 0.5 * math.cos(math.pi * max(0.0, min(1.0, x)))

# Pre-generate stars / particles
np.random.seed(42)
NUM_PARTICLES = 120
P_X = np.random.uniform(0, WIDTH, NUM_PARTICLES)
P_Y = np.random.uniform(0, HEIGHT, NUM_PARTICLES)
P_SPEED = np.random.uniform(0.3, 1.2, NUM_PARTICLES)
P_SIZE = np.random.uniform(1.5, 3.5, NUM_PARTICLES)
P_ALPHA = np.random.uniform(40, 180, NUM_PARTICLES)

def draw_pill(draw, x, y, text, font, bg_color, border_color, text_color, pad_x=18, pad_y=8):
    bbox = font.getbbox(text)
    w = bbox[2] - bbox[0] + pad_x * 2
    h = bbox[3] - bbox[1] + pad_y * 2
    draw.rounded_rectangle([x, y, x + w, y + h], radius=h//2, fill=bg_color, outline=border_color, width=2)
    draw.text((x + pad_x, y + pad_y - 2), text, font=font, fill=text_color)
    return w, h

def render_frame(frame_idx):
    t = frame_idx / float(FPS)
    img = Image.new("RGBA", (WIDTH, HEIGHT), C_BG_BASE)
    draw = ImageDraw.Draw(img)

    # 1. Background Ambient Glow Mesh (Pulsing glowing orbs)
    pulse = 0.5 + 0.5 * math.sin(t * 2.0)
    
    # Left amber orb
    orb1_x = int(WIDTH * 0.25 + 50 * math.cos(t * 0.8))
    orb1_y = int(HEIGHT * 0.35 + 40 * math.sin(t * 0.9))
    draw.ellipse([orb1_x - 380, orb1_y - 380, orb1_x + 380, orb1_y + 380], fill=(245, 158, 11, int(18 + 8 * pulse)))
    
    # Right emerald/cyan orb
    orb2_x = int(WIDTH * 0.75 + 40 * math.sin(t * 0.7))
    orb2_y = int(HEIGHT * 0.65 + 50 * math.cos(t * 0.8))
    draw.ellipse([orb2_x - 380, orb2_y - 380, orb2_x + 380, orb2_y + 380], fill=(16, 185, 129, int(16 + 6 * pulse)))

    # 2. Cyber Particle Dust
    for i in range(NUM_PARTICLES):
        py = (P_Y[i] - t * P_SPEED[i] * 35) % HEIGHT
        px = P_X[i]
        sz = P_SIZE[i]
        al = int(P_ALPHA[i] * (0.6 + 0.4 * math.sin(t * 3.0 + i)))
        draw.ellipse([px - sz, py - sz, px + sz, py + sz], fill=(245, 211, 77, al))

    # 3. Persistent Top HUD Header
    draw.line([(0, 68), (WIDTH, 68)], fill=(35, 35, 45), width=1)
    draw.text((60, 24), "ZYNTIX // AUTONOMOUS AI PLATFORM", font=f_small_bold, fill=C_AMBER)
    
    # Telemetry online indicator
    draw.ellipse([WIDTH - 240, 30, WIDTH - 226, 44], fill=C_EMERALD)
    draw.text((WIDTH - 215, 25), "SYSTEM ONLINE", font=f_small_bold, fill=C_WHITE)

    # 4. Persistent Bottom Progress Bar & Live Domain watermark
    progress = frame_idx / float(TOTAL_FRAMES)
    draw.rectangle([0, HEIGHT - 10, WIDTH, HEIGHT], fill=(25, 25, 32))
    draw.rectangle([0, HEIGHT - 10, int(WIDTH * progress), HEIGHT], fill=C_AMBER)
    draw.text((60, HEIGHT - 45), "⚡ 100% Autonomous Organic Web Architecture", font=f_small, fill=C_GRAY_MUTED)
    draw.text((WIDTH - 360, HEIGHT - 45), "Live at: moderntrendsnow.org", font=f_small_bold, fill=C_AMBER_LIGHT)

    # ==================== SCENE LOGIC ====================
    # SCENE 1: The Problem / Cold Open (0s - 5s)
    if t < 5.0:
        st = t / 5.0
        alpha_in = ease_out_cubic(min(1.0, st * 3.0))
        
        # Heading Warning Pill
        draw_pill(draw, WIDTH//2 - 160, 160, "⚠ THE EXPENSIVE TRUTH", f_pill, (45, 15, 15), (239, 68, 68), C_RED)
        
        # Hero Headline
        title_text = "Are You Tired of Websites That Get ZERO Traffic?"
        bbox = f_hero.getbbox(title_text)
        draw.text(((WIDTH - (bbox[2] - bbox[0])) // 2, 230), title_text, font=f_hero, fill=C_WHITE)

        # 3 Problem Cards
        card_w = 480
        card_h = 240
        spacing = 50
        start_x = (WIDTH - (3 * card_w + 2 * spacing)) // 2
        cards_y = 390

        problems = [
            ("❌ 10+ Hours Per Post", "Manual writing, stock photo hunting, and technical formatting eat your valuable weeks with zero guarantee of search impressions."),
            ("❌ High Agency Retainers", "Marketing agencies charge $2,000–$5,000/month for low-value generic articles that bounce visitors instantly."),
            ("❌ Trapped at Page 5", "Without long-tail autocomplete gap analysis and structured E-E-A-T schemas, search engines ignore your brand completely.")
        ]

        for idx, (head, desc) in enumerate(problems):
            card_delay = 0.2 + idx * 0.15
            card_alpha = ease_out_cubic(max(0.0, min(1.0, (st - card_delay) * 4.0)))
            y_offset = int((1.0 - card_alpha) * 30)

            cx = start_x + idx * (card_w + spacing)
            cy = cards_y + y_offset

            # Card background
            draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=16, fill=(20, 20, 26, 240), outline=(50, 40, 45), width=2)
            draw.text((cx + 25, cy + 25), head, font=f_subtitle, fill=C_RED)
            
            # Text wrap description
            words = desc.split()
            lines = []
            cur = ""
            for w in words:
                test = cur + " " + w if cur else w
                if f_body.getbbox(test)[2] < card_w - 50:
                    cur = test
                else:
                    lines.append(cur)
                    cur = w
            if cur:
                lines.append(cur)
            
            for l_idx, line in enumerate(lines[:4]):
                draw.text((cx + 25, cy + 85 + l_idx * 32), line, font=f_body, fill=C_GRAY_LIGHT)

        # Bottom transition hook
        if t > 3.0:
            hook_alpha = ease_out_cubic((t - 3.0) * 1.5)
            h_text = "What if your entire website managed and ranked itself on 24/7 Autopilot?"
            h_bbox = f_subtitle.getbbox(h_text)
            draw.text(((WIDTH - (h_bbox[2] - h_bbox[0])) // 2, 730), h_text, font=f_subtitle, fill=C_AMBER_LIGHT)

    # SCENE 2: The Solution / MEET ZYNTIX (5s - 10.5s)
    elif t < 10.5:
        st = (t - 5.0) / 5.5
        
        # Pill badge
        draw_pill(draw, WIDTH//2 - 170, 140, "✦ THE AUTONOMOUS PLATFORM", f_pill, (35, 25, 10), C_AMBER, C_AMBER_LIGHT)

        # Giant Name Reveal
        brand = "MEET ZYNTIX"
        b_box = f_hero.getbbox(brand)
        draw.text(((WIDTH - (b_box[2] - b_box[0])) // 2, 205), brand, font=f_hero, fill=C_WHITE)

        sub = "Websites that feel unmistakably crafted by human hands."
        s_box = f_subtitle.getbbox(sub)
        draw.text(((WIDTH - (s_box[2] - s_box[0])) // 2, 305), sub, font=f_subtitle, fill=C_AMBER)

        # 3 Pillar Pillars Showcase
        cw = 480
        ch = 290
        sx = (WIDTH - (3 * cw + 2 * 50)) // 2
        cy = 410

        features = [
            ("01. Multi-Tenant Staging", "⚡ Under 1-Second Setup", "Every client gets an isolated publication subdomain with automatic Edge SSL and multi-tenant security."),
            ("02. Real SERP Gap Hunter", "🎯 Google #0 Position Snippets", "Targets real buyer autocomplete searches, answering exact user intent with executive AEO answer boxes."),
            ("03. Triple Failover Shield", "🛡️ 100% Autopilot Uptime", "Multi-key AI cluster with automatic failovers guarantees your publication never sleeps or crashes.")
        ]

        for i, (num, badge, desc) in enumerate(features):
            cx = sx + i * (cw + 50)
            draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=18, fill=(18, 18, 24, 245), outline=C_CARD_BORDER, width=2)
            draw.text((cx + 25, cy + 25), num, font=f_body_bold, fill=C_AMBER)
            draw.text((cx + 25, cy + 68), badge, font=f_subtitle, fill=C_WHITE)
            
            words = desc.split()
            lines = []
            cur = ""
            for w in words:
                test = cur + " " + w if cur else w
                if f_body.getbbox(test)[2] < cw - 50:
                    cur = test
                else:
                    lines.append(cur)
                    cur = w
            if cur:
                lines.append(cur)
            for l_idx, line in enumerate(lines):
                draw.text((cx + 25, cy + 130 + l_idx * 32), line, font=f_body, fill=C_GRAY_LIGHT)

        # Bottom guarantee
        draw.rounded_rectangle([sx, 750, sx + 3 * cw + 100, 830], radius=14, fill=(16, 185, 129, 20), outline=C_EMERALD, width=2)
        draw.text((sx + 35, 770), "✓ Zero Monthly Cloud Bills  •  Zero Complex Code  •  Zero AI Noise  •  100% Generational Quality", font=f_body_bold, fill=C_EMERALD)

    # SCENE 3: Feature 1 / SERP GAP HUNTER (10.5s - 16s)
    elif t < 16.0:
        st = (t - 10.5) / 5.5

        draw_pill(draw, 140, 130, "FEATURE FOCUS: 01", f_pill, (10, 30, 25), C_CYAN, C_CYAN)
        draw.text((140, 180), "Real-Time Google SERP Gap Hunter", font=f_hero, fill=C_WHITE)
        draw.text((140, 275), "Zyntix directly queries live Google autocomplete APIs to target untapped ranking opportunities.", font=f_subtitle, fill=C_GRAY_LIGHT)

        # Simulation Mockup Card (Left Side)
        mw = 760
        mh = 450
        mx = 140
        my = 350
        draw.rounded_rectangle([mx, my, mx + mw, my + mh], radius=18, fill=(14, 15, 20), outline=(40, 50, 60), width=2)
        
        # Terminal Header
        draw.rectangle([mx, my, mx + mw, my + 50], fill=(22, 24, 32))
        draw.ellipse([mx + 20, my + 20, mx + 32, my + 32], fill=(239, 68, 68))
        draw.ellipse([mx + 42, my + 20, mx + 54, my + 32], fill=(245, 158, 11))
        draw.ellipse([mx + 64, my + 20, mx + 76, my + 32], fill=(16, 185, 129))
        draw.text((mx + 95, my + 15), "google_serp_autonomous_scanner.ts", font=f_mono, fill=C_GRAY_MUTED)

        # Terminal body
        scan_step = int(st * 4)
        queries = [
            "GET https://suggestqueries.google.com/complete/search?q=stone+masonry",
            "[TARGET FOUND] 'solid masonry microclimate sindh' (Intent: Commercial/Educational)",
            "Generating 16-Minute Monograph with E-E-A-T Primary Field Research...",
            "Matching 100% Unique Architecture Photography from Curated Catalog...",
            "Injecting Bidirectional Internal Links & Schema: BlogPosting + FAQPage"
        ]

        for q_idx in range(min(len(queries), scan_step + 2)):
            col = C_EMERALD if "[TARGET" in queries[q_idx] or "Schema" in queries[q_idx] else C_CYAN if "GET" in queries[q_idx] else C_WHITE
            draw.text((mx + 30, my + 75 + q_idx * 55), f"> {queries[q_idx]}", font=f_mono, fill=col)

        # Right Side Benefits Card
        rx = mx + mw + 60
        rw = WIDTH - rx - 140
        ry = my
        draw.rounded_rectangle([rx, ry, rx + rw, ry + mh], radius=18, fill=(20, 20, 26), outline=C_CARD_BORDER, width=2)
        draw.text((rx + 35, ry + 35), "Why This Crushes Generic AI:", font=f_subtitle, fill=C_AMBER)
        
        bullets = [
            ("No Generic AI Garbage", "Every article adopts the authoritative voice of an industry master practitioner."),
            ("Heading-Matched Photos", "Photos precisely depict lime mortar, timber joinery, or workshop tools. Zero duplicates."),
            ("AEO #0 Answer Snippets", "Pre-structured executive summaries win Google's coveted Answer Box immediately."),
            ("Automatic Sitemaps", "Every new monograph is pinged to IndexNow (Bing, Yandex) and Google Search Console.")
        ]

        for b_idx, (b_title, b_desc) in enumerate(bullets):
            draw.text((rx + 35, ry + 95 + b_idx * 80), f"✦ {b_title}", font=f_body_bold, fill=C_WHITE)
            draw.text((rx + 55, ry + 128 + b_idx * 80), b_desc, font=f_small, fill=C_GRAY_LIGHT)

    # SCENE 4: Feature 2 / 24/7 AUTOPILOT (16s - 21.5s)
    elif t < 21.5:
        st = (t - 16.0) / 5.5

        draw_pill(draw, 140, 130, "FEATURE FOCUS: 02", f_pill, (35, 25, 10), C_AMBER, C_AMBER)
        draw.text((140, 180), "⚡ The 24/7 Autopilot Ranking Engine", font=f_hero, fill=C_WHITE)
        draw.text((140, 275), "Your website manages, writes, links, and syndicates itself while you sleep.", font=f_subtitle, fill=C_GRAY_LIGHT)

        # Big Central Interactive Card (The Autopilot Button)
        card_w = 1100
        card_h = 460
        cx = (WIDTH - card_w) // 2
        cy = 340
        draw.rounded_rectangle([cx, cy, cx + card_w, cy + card_h], radius=22, fill=(16, 17, 23), outline=(60, 50, 20), width=2)

        # Header bar
        draw.text((cx + 50, cy + 40), "AUTONOMOUS CADENCE ENGINE", font=f_subtitle, fill=C_AMBER)
        draw_pill(draw, cx + card_w - 240, cy + 35, "DAILY CRON: 08:00 UTC", f_pill, (16, 185, 129, 30), C_EMERALD, C_EMERALD)

        # Giant "Run Autopilot Now" Button Mockup
        btn_w = 420
        btn_h = 80
        bx = cx + 50
        by = cy + 110
        btn_glow = (245, 158, 11) if int(t * 3) % 2 == 0 else (252, 211, 77)
        draw.rounded_rectangle([bx, by, bx + btn_w, by + btn_h], radius=16, fill=btn_glow)
        draw.text((bx + 35, by + 22), "⚡ 24/7 Autopilot: Run Now", font=f_subtitle, fill=(10, 10, 10))

        # Workflow Steps
        draw.text((bx, by + 120), "What happens every single cycle:", font=f_body_bold, fill=C_WHITE)
        steps = [
            "1. Scans Google SERP autocomplete gaps for your exact niche.",
            "2. Generates comprehensive technical monographs with zero AI noise.",
            "3. Embeds distinct architectural photography & rich E-E-A-T citations.",
            "4. Connects bi-directional internal links across existing publications.",
            "5. Pings IndexNow (HTTP 202) for instantaneous search indexing."
        ]
        for s_idx, step in enumerate(steps):
            draw.text((bx + 15, by + 160 + s_idx * 34), step, font=f_body, fill=C_GRAY_LIGHT)

        # Right Telemetry Stats
        rx = cx + btn_w + 120
        stats = [
            ("100%", "Hands-Off Automation"),
            ("0", "Manual Input Needed"),
            ("34+", "Rankable Pages Generated"),
            ("FREE", "Edge SSL & Global Hosting")
        ]
        for idx, (val, lbl) in enumerate(stats):
            col_x = rx + (idx % 2) * 220
            row_y = by + 20 + (idx // 2) * 120
            draw.text((col_x, row_y), val, font=f_hero, fill=C_AMBER)
            draw.text((col_x, row_y + 80), lbl, font=f_small_bold, fill=C_GRAY_LIGHT)

    # SCENE 5: Feature 3 / CUSTOM DOMAIN & MULTI-TENANT (21.5s - 27s)
    elif t < 27.0:
        st = (t - 21.5) / 5.5

        draw_pill(draw, 140, 130, "FEATURE FOCUS: 03", f_pill, (15, 35, 25), C_EMERALD, C_EMERALD)
        draw.text((140, 180), "VIP Custom Domain & Multi-Tenant Separation", font=f_hero, fill=C_WHITE)
        draw.text((140, 275), "Connect any domain in 2 minutes. Every client is 100% strictly isolated.", font=f_subtitle, fill=C_GRAY_LIGHT)

        # Left Card: Domain Registrars
        lw = 760
        lh = 450
        lx = 140
        ly = 350
        draw.rounded_rectangle([lx, ly, lx + lw, ly + lh], radius=20, fill=(18, 18, 24), outline=C_CARD_BORDER, width=2)
        draw.text((lx + 40, ly + 35), "1-Click Custom Domain Setup", font=f_subtitle, fill=C_WHITE)
        draw.text((lx + 40, ly + 85), "Works out-of-the-box with all global registrars:", font=f_body, fill=C_GRAY_MUTED)

        registrars = ["GoDaddy", "Namecheap", "Cloudflare", "Hostinger", "IONOS (1&1)", "Custom DNS"]
        for r_idx, reg in enumerate(registrars):
            rx_pos = lx + 40 + (r_idx % 3) * 230
            ry_pos = ly + 140 + (r_idx // 3) * 80
            draw.rounded_rectangle([rx_pos, ry_pos, rx_pos + 210, ry_pos + 60], radius=12, fill=(28, 28, 36), outline=(60, 60, 75), width=2)
            draw.text((rx_pos + 25, ry_pos + 16), reg, font=f_body_bold, fill=C_WHITE)

        # VIP Concierge Highlight
        draw.rounded_rectangle([lx + 40, ly + 310, lx + lw - 40, ly + 410], radius=14, fill=(245, 158, 11, 20), outline=C_AMBER, width=2)
        draw.text((lx + 60, ly + 325), "★ VIP 1-Click Concierge Assistance", font=f_body_bold, fill=C_AMBER)
        draw.text((lx + 60, ly + 360), "Our engineers will connect your DNS & verify SSL for you 100% free of charge.", font=f_body, fill=C_GRAY_LIGHT)

        # Right Card: Multi-Tenant Privacy Guarantee
        rw = WIDTH - lx - lw - 100
        rx = lx + lw + 40
        ry = ly
        draw.rounded_rectangle([rx, ry, rx + rw, ry + lh], radius=20, fill=(18, 22, 22), outline=(30, 60, 50), width=2)
        draw.text((rx + 35, ry + 35), "Air-Tight Data Isolation", font=f_subtitle, fill=C_EMERALD)
        
        privacy_points = [
            ("Separate Client Databases", "Different emails strictly see only their own projects. Never another user's data."),
            ("Zero Google Auth Hurdles", "Direct Email & Password login with 1-click founder bypass."),
            ("Automatic Edge SSL", "Let's Encrypt certificates deployed on Vercel Global Edge."),
            ("Enterprise Reliability", "Serverless PostgreSQL with in-memory caching guarantees zero downtime.")
        ]
        for p_idx, (p_h, p_d) in enumerate(privacy_points):
            draw.text((rx + 35, ry + 95 + p_idx * 80), f"✓ {p_h}", font=f_body_bold, fill=C_WHITE)
            draw.text((rx + 55, ry + 128 + p_idx * 80), p_d, font=f_small, fill=C_GRAY_LIGHT)

    # SCENE 6: The Triumphant Climax / Call to Action (27s - 32s)
    else:
        st = (t - 27.0) / 5.0
        
        # Center Golden Radiance
        draw_pill(draw, WIDTH//2 - 180, 150, "🚀 READY FOR MARKET DOMINANCE", f_pill, (35, 25, 10), C_AMBER, C_AMBER_LIGHT)

        # Grand Hook
        hook1 = "Stop Working For Your Website."
        h1_box = f_title.getbbox(hook1)
        draw.text(((WIDTH - (h1_box[2] - h1_box[0])) // 2, 220), hook1, font=f_title, fill=C_GRAY_LIGHT)

        hook2 = "LET YOUR WEBSITE WORK FOR YOU."
        h2_box = f_hero.getbbox(hook2)
        draw.text(((WIDTH - (h2_box[2] - h2_box[0])) // 2, 290), hook2, font=f_hero, fill=C_AMBER)

        # Massive CTA Banner Card
        banner_w = 980
        banner_h = 320
        bx = (WIDTH - banner_w) // 2
        by = 400
        draw.rounded_rectangle([bx, by, bx + banner_w, by + banner_h], radius=24, fill=(16, 17, 23), outline=C_AMBER, width=3)

        # Brand in Banner
        b_name = "ZYNTIX PLATFORM"
        bn_box = f_hero.getbbox(b_name)
        draw.text(((WIDTH - (bn_box[2] - bn_box[0])) // 2, by + 40), b_name, font=f_hero, fill=C_WHITE)

        url1 = "LIVE SHOWCASE: moderntrendsnow.org"
        u1_box = f_title.getbbox(url1)
        draw.text(((WIDTH - (u1_box[2] - u1_box[0])) // 2, by + 140), url1, font=f_title, fill=C_EMERALD)

        # Action Button Mockup
        btn_w = 460
        btn_h = 60
        btn_x = (WIDTH - btn_w) // 2
        btn_y = by + 220
        draw.rounded_rectangle([btn_x, btn_y, btn_x + btn_w, btn_y + btn_h], radius=14, fill=C_AMBER)
        cta_txt = "Launch Your Autonomous Publication Today →"
        c_box = f_body_bold.getbbox(cta_txt)
        draw.text(((WIDTH - (c_box[2] - c_box[0])) // 2, btn_y + 15), cta_txt, font=f_body_bold, fill=(10, 10, 10))

        # Bottom guarantee
        draw.text((WIDTH//2 - 270, by + banner_h + 35), "100% Ready For Market Launch • Zero Technical Overhead", font=f_body, fill=C_GRAY_MUTED)

    return np.array(img.convert("RGB"))

# ==================== SYNTH AUDIO GENERATION ====================
def generate_synth_soundtrack(duration_sec, sample_rate=44100):
    total_samples = int(duration_sec * sample_rate)
    audio = np.zeros(total_samples, dtype=np.float32)

    bpm = 124.0
    beat_dur = 60.0 / bpm
    samples_per_beat = int(beat_dur * sample_rate)

    # 1. Punchy Cyber Kick Drum on every beat
    for b in range(int(duration_sec / beat_dur)):
        start = b * samples_per_beat
        kick_samples = min(int(0.22 * sample_rate), total_samples - start)
        t_kick = np.linspace(0, 0.22, kick_samples)
        # Pitch drop from 150 Hz to 45 Hz
        freq = 45.0 + 105.0 * np.exp(-t_kick * 30.0)
        kick = np.sin(2.0 * np.pi * freq * t_kick) * np.exp(-t_kick * 16.0)
        audio[start:start + kick_samples] += kick * 0.75

    # 2. Snare / Cyber Clap on beats 2 and 4
    for b in range(int(duration_sec / beat_dur)):
        if b % 2 == 1:
            start = b * samples_per_beat
            snare_samples = min(int(0.18 * sample_rate), total_samples - start)
            noise = np.random.uniform(-1, 1, snare_samples)
            t_snare = np.linspace(0, 0.18, snare_samples)
            snare_env = np.exp(-t_snare * 22.0)
            audio[start:start + snare_samples] += noise * snare_env * 0.35

    # 3. Sawtooth Bassline (Cyber arpeggio 16th notes)
    sixteenth_dur = beat_dur / 4.0
    samples_per_16th = int(sixteenth_dur * sample_rate)
    bass_notes = [55.0, 55.0, 65.41, 55.0, 73.42, 65.41, 55.0, 82.41] # A1, C2, D2, E2

    for step in range(int(duration_sec / sixteenth_dur)):
        note_freq = bass_notes[step % len(bass_notes)]
        start = step * samples_per_16th
        step_len = min(samples_per_16th, total_samples - start)
        t_step = np.linspace(0, sixteenth_dur, step_len)
        # Filtered sawtooth wave
        saw = 0.5 * np.sin(2.0 * np.pi * note_freq * t_step) + 0.25 * np.sin(4.0 * np.pi * note_freq * t_step)
        env = np.exp(-t_step * 14.0)
        audio[start:start + step_len] += saw * env * 0.45

    # 4. Cinematic Risers / Sweeps on scene changes (every ~5.5s)
    transitions = [5.0, 10.5, 16.0, 21.5, 27.0]
    for trans in transitions:
        start = max(0, int((trans - 1.5) * sample_rate))
        riser_len = int(1.5 * sample_rate)
        if start + riser_len < total_samples:
            t_riser = np.linspace(0, 1.5, riser_len)
            f_rise = 100.0 + 900.0 * (t_riser / 1.5)**2
            riser = np.sin(2.0 * np.pi * f_rise * t_riser) * (t_riser / 1.5) * 0.3
            audio[start:start + riser_len] += riser

    # Normalize audio to prevent clipping
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = (audio / max_val) * 0.92

    # Save to 16-bit stereo WAV
    int16_audio = (audio * 32767).astype(np.int16)
    with wave.open(TEMP_AUDIO, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        wf.writeframes(int16_audio.tobytes())

# ==================== MAIN EXECUTION ====================
def main():
    print(f"🎬 Starting Zyntix Cinematic Marketing Video Generator...")
    print(f"Resolution: {WIDTH}x{HEIGHT} | FPS: {FPS} | Duration: {DURATION_SEC}s ({TOTAL_FRAMES} frames)")

    # 1. Render Video Frames
    writer = imageio.get_writer(
        TEMP_VIDEO,
        fps=FPS,
        codec="libx264",
        quality=8,
        pixelformat="yuv420p"
    )

    for i in range(TOTAL_FRAMES):
        frame = render_frame(i)
        writer.append_data(frame)
        if i % 90 == 0 or i == TOTAL_FRAMES - 1:
            print(f"Rendering frame {i}/{TOTAL_FRAMES} ({(i/TOTAL_FRAMES)*100:.1f}%)")

    writer.close()
    print("✓ Video stream rendered successfully!")

    # 2. Synthesize High-Energy Cyber Audio
    print("🎵 Synthesizing high-energy cyber synth soundtrack...")
    generate_synth_soundtrack(DURATION_SEC)
    print("✓ Soundtrack synthesized successfully!")

    # 3. Mux Video + Audio with FFmpeg
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    print(f"🚀 Muxing final MP4 with FFmpeg ({ffmpeg_exe})...")
    
    cmd = [
        ffmpeg_exe, "-y",
        "-i", TEMP_VIDEO,
        "-i", TEMP_AUDIO,
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-shortest",
        FINAL_VIDEO_1
    ]
    
    import subprocess
    subprocess.run(cmd, check=True)
    
    # Also copy to public directory for direct web access
    import shutil
    shutil.copyfile(FINAL_VIDEO_1, FINAL_VIDEO_2)

    # Cleanup temp
    if os.path.exists(TEMP_VIDEO):
        os.remove(TEMP_VIDEO)
    if os.path.exists(TEMP_AUDIO):
        os.remove(TEMP_AUDIO)

    print(f"🎉 MASTER MARKETING VIDEO CREATED SUCCESSFULLY!")
    print(f"Output File 1: {FINAL_VIDEO_1}")
    print(f"Output File 2 (Public Web): {FINAL_VIDEO_2}")

if __name__ == "__main__":
    main()
