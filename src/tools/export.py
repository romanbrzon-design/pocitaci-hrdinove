import os, numpy as np
from PIL import Image
O='/home/claude/gem/out'; A='/home/claude/gem/assets'
def save(src, name, h=None, w=None, q=82):
    im=Image.open(src).convert('RGBA')
    if h: im=im.resize((max(1,int(im.size[0]*h/im.size[1])),h),Image.LANCZOS)
    if w: im=im.resize((w,max(1,int(im.size[1]*w/im.size[0]))),Image.LANCZOS)
    im.save(f'{A}/{name}.webp','WEBP',quality=q,method=6)
for i in range(6):
    save(f'{O}/hero_m{i+1}.png',f'hero_m{i}',h=420); save(f'{O}/hero_f{i+1}.png',f'hero_f{i}',h=420)
for i in range(7): save(f'{O}/weapon{i+1}.png',f'i_weapon{i+1}',h=180)
for s in ['shield','armor','head']:
    for i in range(5): save(f'{O}/{s}{i+1}.png',f'i_{s}{i+1}',w=170)
for i in range(3): save(f'{O}/bc{i+1}.png',f'i_boots{i+1}',w=170); save(f'{O}/bc{i+4}.png',f'i_cape{i+1}',w=170)
for i in range(3): save(f'{O}/icon{i+1}.png',f'i_pet{i+1}',w=170)
for i,n in enumerate(['coin','star','chest_wood','chest_gold']): save(f'{O}/icon{i+4}.png',f'ui_{n}',w=140)
mons=[f'{O}/mon{i}.png' for i in range(1,5)]+[f'{O}/monB{i}.png' for i in range(1,4)]+[f'{O}/monC{i}.png' for i in range(1,4)]
for i,m in enumerate(mons): save(m,f'mon{i}',h=420)
sp=['cat','dog','bunny','pony','rat','hamster','fox','panda','owl','dragon']
for i,s in enumerate(sp):
    g='A' if i<5 else 'B'; k=i%5+1
    save(f'{O}/baby{g}{k}.png',f'pet_{s}_0',h=360); save(f'{O}/adult{g}{k}.png',f'pet_{s}_1',h=420)
# backgrounds: split halves at the white separator
for f,(a,b) in {'bg12':(0,1),'bg34':(2,3),'bg56':(4,5),'bg78':(6,7),'bg910':(8,9)}.items():
    im=Image.open(f'/home/claude/gem/raw/{f}.jpg').convert('RGB'); ar=np.asarray(im).astype(int)
    white_rows=np.where((ar.min(2)>235).mean(1)>0.9)[0]
    mid=[r for r in white_rows if 250<r<500]
    top_end=min(mid) if mid else 375; bot_start=max(mid)+1 if mid else 381
    # also trim white margins top/bottom/left/right
    def trim(x):
        arr=np.asarray(x).astype(int); nonw=(arr.min(2)<235)
        rows=np.where(nonw.mean(1)>0.5)[0]; cols=np.where(nonw.mean(0)>0.5)[0]
        return x.crop((cols[0]+2,rows[0]+2,cols[-1]-1,rows[-1]-1))
    t=trim(im.crop((0,0,im.size[0],top_end))); bt=trim(im.crop((0,bot_start,im.size[0],im.size[1])))
    t.save(f'{A}/bg{a}.webp','WEBP',quality=78,method=6); bt.save(f'{A}/bg{b}.webp','WEBP',quality=78,method=6)
    print(f, t.size, bt.size)
