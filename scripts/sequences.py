#!/usr/bin/env python3
"""
Rebuild the scroll-scrubbed frame sequences from raw-video/ with the exact
settings the site was tuned for.

  python scripts/sequences.py                 # both clips
  python scripts/sequences.py hero-portrait   # one clip

What it does per clip:
  hero-portrait  16:9 → desktop frames; centre-cropped 9:16 → phone frames
                 (or uses raw-video/hero-portrait-9x16.mp4 if you supply one)
  desk-dive      gentle warm grade so the whiteout lands on Bone Ivory, then the same

Then it calls the 3d-master extract_frames.py. Set EXTRACT_FRAMES to its path if it
isn't at the default location below. Output: sequences/<clip>/ (+ _qa/contact-sheet.jpg).
"""
import os, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / 'raw-video'
EXTRACT = os.environ.get('EXTRACT_FRAMES', r'E:\3d-master\3d-master\scripts\extract_frames.py')
GRADE = 'colorbalance=rm=0.035:gm=0.01:bm=-0.045:rh=0.02:bh=-0.03'

CLIPS = {
    'hero-portrait': dict(frames=168, quality=88, grade=False),
    'desk-dive': dict(frames=132, quality=86, grade=True),
}


def ffmpeg(*args):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *args], check=True)


def build(name, frames, quality, grade):
    src = RAW / f'{name}.mp4'
    if not src.exists():
        sys.exit(f'Missing {src}')
    work = src
    if grade:
        work = RAW / f'{name}-graded.mp4'
        ffmpeg('-i', str(src), '-vf', GRADE, '-c:v', 'libx264', '-crf', '12', '-preset', 'slow', '-an', str(work))

    mobile = RAW / f'{name}-9x16.mp4'
    supplied = mobile.exists() and mobile.stat().st_mtime > src.stat().st_mtime
    if not supplied:  # centre crop of the 16:9 clip (both subjects are centred)
        vf = 'crop=ih*9/16:ih' + (f',{GRADE}' if grade else '')
        ffmpeg('-i', str(src), '-vf', vf, '-c:v', 'libx264', '-crf', '12', '-an', str(mobile))

    env = {**os.environ, 'PYTHONIOENCODING': 'utf-8'}
    subprocess.run([sys.executable, EXTRACT, str(work), '--name', name, '--out', str(ROOT / 'sequences'),
                    '--frames', str(frames), '--width', '1920', '--quality', str(quality),
                    '--mobile-src', str(mobile), '--mobile-width', '720'], check=True, env=env)


if __name__ == '__main__':
    names = sys.argv[1:] or list(CLIPS)
    for n in names:
        if n not in CLIPS:
            sys.exit(f'Unknown clip "{n}". Known: {", ".join(CLIPS)}')
        build(n, **CLIPS[n])
