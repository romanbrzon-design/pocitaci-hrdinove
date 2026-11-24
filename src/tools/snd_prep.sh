#!/bin/bash
# Úprava nahrávek pro „Kdo to zpívá?“: snd_prep.sh vstup výstup.mp3 [začátek_s] [délka_s]
# ořízne ticho na začátku, vezme max. délku (výchozí 6 s), dozvuk 0,4 s, normalizace hlasitosti, mono 22 kHz mp3
in="$1"; out="$2"; ss="${3:-0}"; dur="${4:-6}"
ffmpeg -loglevel error -y -ss "$ss" -i "$in" -t "$dur" \
  -af "silenceremove=start_periods=1:start_threshold=-45dB,highpass=f=120,loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:d=0.05,areverse,afade=t=in:d=0.4,areverse" \
  -ac 1 -ar 22050 -b:a 48k "$out" && echo "$out $(du -k "$out" | cut -f1) kB"
