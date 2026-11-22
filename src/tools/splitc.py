import sys
from PIL import Image
import numpy as np
A='/home/claude/pocitani/site/assets'
def split(src, i0):
    im=Image.open(src).convert('RGB'); a=np.asarray(im).astype(int); H=a.shape[0]
    rows=a.mean(axis=(1,2)); mid=[r for r in range(int(H*.38),int(H*.62)) if rows[r]>230]
    t,b=(min(mid),max(mid)) if mid else (H//2-2,H//2+2)
    for k,(y0,y1) in enumerate([(4,t-3),(b+4,H-4)]):
        p=im.crop((6,y0,im.size[0]-6,y1)); p=p.resize((960,int(960*p.size[1]/p.size[0])),Image.LANCZOS)
        p.save(f'{A}/cbg{i0+k}.webp','WEBP',quality=80); print(f'cbg{i0+k}',p.size)
for src,i0 in [(sys.argv[i],int(sys.argv[i+1])) for i in range(1,len(sys.argv),2)]: split(src,i0)
