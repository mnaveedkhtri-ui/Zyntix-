import os
import subprocess
import numpy as np
import wave
from gtts import gTTS
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()

SCENES_TEXT = [
    {
        "id": "scene1",
        "text": "Stop burning cash on SEO agencies that deliver zero results. Meet Zyntix Studio, the autonomous search platform that actually ranks."
    },
    {
        "id": "scene2",
        "text": "Inside the studio, just enter your brand or niche, and hit deploy. In seconds, your entire high-performance publication is live with free Edge SSL."
    },
    {
        "id": "scene3",
        "text": "Our autonomous AEO radar hunts real Google search gaps, crafting deep twenty-four-hundred-word monographs with verified photography and smart interlinking."
    },
    {
        "id": "scene4",
        "text": "Activate the twenty-four seven Autopilot. It publishes daily, pinging Google and Bing crawlers within minutes of going live, completely while you sleep."
    },
    {
        "id": "scene5",
        "text": "Here is the live proof: an authoritative, bespoke journal with quiet typography, deep engineering rigor, and zero artificial intelligence fluff."
    },
    {
        "id": "scene6",
        "text": "Ready to dominate page one? Stop working for your website, and let your website work for you. Launch right now at zyntix-studio-ivory.vercel.app."
    }
]

def generate_voice_tracks():
    print("Generating voice tracks...")
    durations = []
    for s in SCENES_TEXT:
        raw_mp3 = f"epic_raw_{s['id']}.mp3"
        master_mp3 = f"epic_voice_{s['id']}.mp3"
        
        # Generate with gTTS (British English - crisp executive commercial tone)
        tts = gTTS(s['text'], lang='en', tld='co.uk', slow=False)
        tts.save(raw_mp3)
        
        # Apply mastering chain: +14% speed for energetic cadence, broadcast EQ and compressor
        cmd = [
            ffmpeg_exe, "-y",
            "-i", raw_mp3,
            "-af", "atempo=1.14,equalizer=f=140:t=q:w=1:g=2.5,equalizer=f=3400:t=q:w=1:g=3.5,acompressor=threshold=-12dB:ratio=3:attack=10:release=80,volume=1.4",
            master_mp3
        ]
        subprocess.run(cmd, check=True)
        
        # Probe exact duration
        res = subprocess.run([ffmpeg_exe, "-i", master_mp3], stderr=subprocess.PIPE, text=True)
        import re
        m = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", res.stderr)
        dur = 9.0
        if m:
            h, mi, sec = m.groups()
            dur = int(h)*3600 + int(mi)*60 + float(sec)
        durations.append(dur)
        print(f"{s['id']}: {dur:.2f}s")
        
    return durations

def synthesize_tech_soundtrack(total_dur=57.0, filename="epic_tech_soundtrack.wav"):
    print(f"Synthesizing 116 BPM Modern Tech Electronic Soundtrack ({total_dur:.1f}s)...")
    sr = 44100
    t = np.linspace(0, total_dur, int(sr * total_dur), endpoint=False)
    
    bpm = 116.0
    beat_dur = 60.0 / bpm
    total_beats = int(total_dur / beat_dur)
    
    music = np.zeros_like(t)
    
    # 1. Kick Drum (Punchy 55Hz pitch-dropped sub kick on every beat)
    kick_len = int(sr * 0.22)
    kick_t = np.linspace(0, 0.22, kick_len, endpoint=False)
    # Exponential pitch decay 140Hz -> 48Hz
    kick_freq = 48.0 + 92.0 * np.exp(-kick_t * 28.0)
    kick_env = np.exp(-kick_t * 14.0)
    kick_sample = np.sin(2 * np.pi * kick_freq * kick_t) * kick_env * 0.55
    
    # 2. Snare / Clap on beats 2 and 4
    snare_len = int(sr * 0.18)
    snare_t = np.linspace(0, 0.18, snare_len, endpoint=False)
    snare_noise = np.random.uniform(-1, 1, snare_len)
    snare_env = np.exp(-snare_t * 22.0)
    snare_tone = np.sin(2 * np.pi * 180.0 * snare_t) * np.exp(-snare_t * 30.0)
    snare_sample = (snare_noise * 0.7 + snare_tone * 0.3) * snare_env * 0.35
    
    # 3. Closed Hi-Hat (crisp 16th notes)
    hat_len = int(sr * 0.05)
    hat_t = np.linspace(0, 0.05, hat_len, endpoint=False)
    hat_sample = np.random.uniform(-1, 1, hat_len) * np.exp(-hat_t * 70.0) * 0.18
    
    # Place drum beats
    for b in range(total_beats):
        b_sample = int(b * beat_dur * sr)
        if b_sample + kick_len < len(music):
            music[b_sample : b_sample + kick_len] += kick_sample
            
        # Snare on 2 and 4
        if b % 2 == 1:
            if b_sample + snare_len < len(music):
                music[b_sample : b_sample + snare_len] += snare_sample
                
        # Hi-hats on 8th notes
        for sub in [0.0, 0.5]:
            h_sample = int((b + sub) * beat_dur * sr)
            if h_sample + hat_len < len(music):
                music[h_sample : h_sample + hat_len] += hat_sample

    # 4. Pulsing Synth Bass in D Minor (D2 = 73.4Hz, F2 = 87.3Hz, G2 = 98Hz, A2 = 110Hz)
    bass_notes = [73.4, 73.4, 87.3, 73.4, 98.0, 87.3, 110.0, 73.4]
    sixteenth_dur = beat_dur / 4.0
    total_16ths = int(total_dur / sixteenth_dur)
    
    bass_sig = np.zeros_like(t)
    for i in range(total_16ths):
        freq = bass_notes[(i // 2) % len(bass_notes)]
        s_start = int(i * sixteenth_dur * sr)
        s_len = int(sixteenth_dur * sr * 0.85)
        if s_start + s_len < len(bass_sig):
            st = np.linspace(0, sixteenth_dur * 0.85, s_len, endpoint=False)
            env = np.exp(-st * 16.0)
            tone = (np.sin(2 * np.pi * freq * st) * 0.6 + 
                    np.sin(2 * np.pi * (freq * 2) * st) * 0.3 + 
                    np.sin(2 * np.pi * (freq * 3) * st) * 0.1)
            bass_sig[s_start : s_start + s_len] += tone * env * 0.28
            
    # 5. Smooth Tech Pad Chords (Dm -> Bb -> C -> Am)
    pad_sig = np.zeros_like(t)
    chord_len = total_dur / 4.0
    chords = [
        [146.8, 174.6, 220.0, 261.6], # Dm7
        [116.5, 146.8, 174.6, 233.1], # Bbmaj7
        [130.8, 164.8, 196.0, 246.9], # C7
        [110.0, 130.8, 164.8, 220.0]  # Am7
    ]
    for c_idx, chord in enumerate(chords):
        t0 = c_idx * chord_len
        t1 = (c_idx + 1) * chord_len
        mask = (t >= t0) & (t < t1)
        ts = t[mask] - t0
        env = np.sin(np.pi * ts / chord_len) ** 2
        sub_p = np.zeros_like(ts)
        for f in chord:
            sub_p += np.sin(2 * np.pi * f * ts) * 0.3
            sub_p += np.sin(2 * np.pi * (f * 1.002) * ts) * 0.2
        pad_sig[mask] += sub_p * env * 0.18
        
    full_mix = music * 0.45 + bass_sig * 0.55 + pad_sig * 0.50
    # Normalize
    full_mix = full_mix / (np.max(np.abs(full_mix)) + 1e-6) * 0.25
    
    # Save WAV
    audio_data = (full_mix * 32767).astype(np.int16)
    with wave.open(filename, 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(audio_data.tobytes())
        
    print(f"Tech soundtrack saved: {filename}")

if __name__ == "__main__":
    durs = generate_voice_tracks()
    total = sum(durs)
    print(f"Total Speech: {total:.2f}s")
    synthesize_tech_soundtrack(total + 1.0)
