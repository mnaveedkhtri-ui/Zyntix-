import os
import subprocess
import numpy as np
import wave
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
sr = 44100

# 1. Retime voices so total duration is 58.0 seconds
SCENE_TARGETS = [
    ("scene1", 9.0),
    ("scene2", 10.2),
    ("scene3", 9.3),
    ("scene4", 9.3),
    ("scene5", 9.8),
    ("scene6", 10.4)
]
TOTAL_DUR = sum(d for _, d in SCENE_TARGETS) # 58.0s

def retime_voices():
    print(f"Retiming voice tracks to fit exactly {TOTAL_DUR:.1f}s...")
    with open("epic_concat_list.txt", "w") as f_list:
        for s_id, target_dur in SCENE_TARGETS:
            in_file = f"epic_voice_{s_id}.mp3"
            out_file = f"final_voice_{s_id}.mp3"
            
            # probe input duration
            res = subprocess.run([ffmpeg_exe, "-i", in_file], stderr=subprocess.PIPE, text=True)
            import re
            m = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", res.stderr)
            orig_dur = 10.0
            if m:
                h, mi, sec = m.groups()
                orig_dur = int(h)*3600 + int(mi)*60 + float(sec)
                
            tempo = orig_dur / target_dur
            cmd = [
                ffmpeg_exe, "-y",
                "-i", in_file,
                "-af", f"atempo={tempo:.3f}",
                out_file
            ]
            subprocess.run(cmd, check=True)
            f_list.write(f"file '{out_file}'\n")
            print(f"Retime {s_id}: {orig_dur:.2f}s -> {target_dur:.2f}s (tempo={tempo:.2f})")

def generate_sfx():
    print("Synthesizing realistic UI sound effects...")
    # A. Snappy Mouse Click (18ms)
    t_click = np.linspace(0, 0.018, int(sr * 0.018), endpoint=False)
    click = (np.sin(2 * np.pi * 1800 * t_click) * 0.6 + np.random.uniform(-1, 1, len(t_click)) * 0.4) * np.exp(-t_click * 300) * 0.6
    
    # B. Whoosh Sweep (320ms)
    t_whoosh = np.linspace(0, 0.32, int(sr * 0.32), endpoint=False)
    sweep_env = np.sin(np.pi * t_whoosh / 0.32) ** 2
    whoosh = np.random.uniform(-1, 1, len(t_whoosh)) * sweep_env * 0.28
    
    # C. Crystal Success Chime (650ms, E6 + B6 + E7)
    t_chime = np.linspace(0, 0.65, int(sr * 0.65), endpoint=False)
    chime_env = np.exp(-t_chime * 6.0)
    chime = (np.sin(2 * np.pi * 1318.5 * t_chime) * 0.4 + 
             np.sin(2 * np.pi * 1975.5 * t_chime) * 0.35 + 
             np.sin(2 * np.pi * 2637.0 * t_chime) * 0.25) * chime_env * 0.45
             
    # D. Mechanical Key Clack (12ms)
    t_key = np.linspace(0, 0.012, int(sr * 0.012), endpoint=False)
    key_clack = (np.sin(2 * np.pi * 950 * t_key) * 0.5 + np.random.uniform(-1, 1, len(t_key)) * 0.5) * np.exp(-t_key * 400) * 0.35
    
    # Place SFX along the 58s timeline
    sfx_full = np.zeros(int(sr * TOTAL_DUR))
    
    # Whooshes at scene transitions (0.0s, 9.0s, 19.2s, 28.5s, 37.8s, 47.6s)
    scene_starts = [0.0, 9.0, 19.2, 28.5, 37.8, 47.6]
    for st in scene_starts:
        idx = int(st * sr)
        if idx + len(whoosh) < len(sfx_full):
            sfx_full[idx : idx + len(whoosh)] += whoosh
            
    # Click at 7.0s (clicking open studio) and 16.5s (clicking deploy)
    for cl in [7.0, 16.5]:
        idx = int(cl * sr)
        if idx + len(click) < len(sfx_full):
            sfx_full[idx : idx + len(click)] += click
            
    # Keyboard clacks during Scene 2 typing (between 10.5s and 15.0s, every 0.12s)
    for tk in np.arange(10.5, 15.0, 0.12):
        idx = int(tk * sr)
        if idx + len(key_clack) < len(sfx_full):
            sfx_full[idx : idx + len(key_clack)] += key_clack
            
    # Success Chimes at 17.2s (Deploy success) and 35.0s (Google indexing verified)
    for ch in [17.2, 35.0, 48.0]:
        idx = int(ch * sr)
        if idx + len(chime) < len(sfx_full):
            sfx_full[idx : idx + len(chime)] += chime
            
    # Save SFX track
    sfx_data = (sfx_full * 32767).astype(np.int16)
    with wave.open("epic_sfx_track.wav", "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(sfx_data.tobytes())
    print("SFX track synthesized and saved!")

def mix_master_audio():
    # Mix Vocals (concat), Tech Soundtrack (ducked), and SFX
    print("Muxing final audio bed with FFmpeg...")
    cmd = [
        ffmpeg_exe, "-y",
        "-f", "concat", "-safe", "0", "-i", "epic_concat_list.txt",
        "-i", "epic_tech_soundtrack.wav",
        "-i", "epic_sfx_track.wav",
        "-filter_complex",
        "[0:a]volume=1.35[vox];[1:a]volume=0.22[music];[2:a]volume=0.45[sfx];[vox][music][sfx]amix=inputs=3:duration=first:dropout_transition=2[aout]",
        "-map", "[aout]",
        "-c:a", "aac", "-b:a", "192k",
        "epic_master_audio.m4a"
    ]
    subprocess.run(cmd, check=True)
    print("Epic master audio successfully mixed: epic_master_audio.m4a!")

if __name__ == "__main__":
    retime_voices()
    generate_sfx()
    mix_master_audio()
