# Odstraní světlé zbytky pozadí (lemy, záře, bílé mezery) – postupuje od průhledné plochy dovnitř přes světlé pixely,
# zastaví se na tmavém obrysu kresby. Použití: defringe.py hloubka soubor...
import sys, numpy as np
from PIL import Image
from scipy import ndimage
depth=int(sys.argv[1])
for f in sys.argv[2:]:
  im=Image.open(f).convert('RGBA'); a=np.asarray(im).astype(int); al=a[:,:,3]; rgb=a[:,:,:3]; mn=rgb.min(2); mx=rgb.max(2)
  light=(mn>178)&((mx-mn)<75)
  gone=al<40
  for _ in range(depth):
    nxt=ndimage.binary_dilation(gone)&light&~gone
    if not nxt.any(): break
    gone|=nxt
  # uzavřené čistě bílé plochy (např. mezi botami): velké, téměř bílé, bez struktury
  white=(mn>236)&((mx-mn)<14)&~gone
  lab,n=ndimage.label(white)
  if n:
    sz=ndimage.sum(white,lab,range(1,n+1)); H,W=al.shape
    for k,z in enumerate(sz):
      if z>H*W*.006:
        comp=lab==k+1
        ring=ndimage.binary_dilation(comp,iterations=2)&~comp
        if (mn[ring]<150).mean()>.5: gone|=ndimage.binary_dilation(comp,iterations=1)&light
  newa=np.where(gone,0,al).astype(float)
  # jemné vyhlazení hrany
  soft=ndimage.uniform_filter(newa,3); edge=ndimage.binary_dilation(gone)&~gone
  newa=np.where(edge,np.minimum(newa,soft*1.15),newa)
  a[:,:,3]=np.clip(newa,0,255)
  Image.fromarray(a.astype('uint8')).save(f,'WEBP',quality=88)
