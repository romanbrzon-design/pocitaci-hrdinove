import numpy as np, math
from PIL import Image, ImageDraw
O='/home/claude/gem/out'; A='/home/claude/pocitani/site/assets'
def save(src,name,w=None,h=None,q=82):
    im=Image.open(src).convert('RGBA')
    if h: im=im.resize((max(1,int(im.size[0]*h/im.size[1])),h),Image.LANCZOS)
    if w: im=im.resize((w,max(1,int(im.size[1]*w/im.size[0]))),Image.LANCZOS)
    im.save(f'{A}/{name}.webp','WEBP',quality=q,method=6)
for i in range(7): save(f'{O}/toy{i+1}.png',f'pa_toy{i+1}',w=160)
for i in range(5): save(f'{O}/pbed{i+1}.png',f'pa_pbed{i+1}',w=240)
for i in range(5): save(f'{O}/collar{i+1}.png',f'pa_collar{i+1}',w=200)
for i in range(5): save(f'{O}/phat{i+1}.png',f'pa_phat{i+1}',w=180)
for i in range(3): save(f'{O}/cloth{i+1}.png',f'pa_shoes{i+1}',w=180); save(f'{O}/cloth{i+4}.png',f'pa_outfit{i+1}',w=200)
for i in range(3): save(f'{O}/friend{i+1}.png',f'pa_friend{i+1}',w=140); save(f'{O}/friend{i+4}.png',f'h_hpet{i+1}',w=170)
for i in range(7): save(f'{O}/hbed{i+1}.png',f'h_bed{i+1}',w=300)
for i in range(5): save(f'{O}/rug{i+1}.png',f'h_rug{i+1}',w=300)
for i in range(5): save(f'{O}/lamp{i+1}.png',f'h_lamp{i+1}',h=220)
for i in range(3): save(f'{O}/lamp{i+6}.png',f'h_plant{i+1}',h=200); save(f'{O}/curt{i+1}.png',f'h_curtain{i+1}',w=300)
save(f'{O}/curt4.png','kid_m',h=360); save(f'{O}/curt5.png','kid_f',h=360)
# room backgrounds, crop to 4:3
room=Image.open('/home/claude/gem/raw/room.jpg').convert('RGB').crop((168,0,1176,756))
ar=np.asarray(room).astype(float); H,W=ar.shape[:2]
cream=np.array([243,232,206.])
d=np.sqrt(((ar-cream)**2).sum(2))
yy,xx=np.mgrid[0:H,0:W]
mask=(yy>99)&(yy<577)&~((xx>370)&(xx<638)&(yy>140)&(yy<481))
lum=np.clip(ar.mean(2)/cream.mean(),0.7,1.08)
from PIL import ImageFilter
mimg=Image.fromarray((mask*255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8))
m=np.asarray(mimg)/255.
def star(dr,cx,cy,r,fill):
    pts=[]
    for k in range(10):
        a=-math.pi/2+k*math.pi/5; rr=r if k%2==0 else r*.45
        pts.append((cx+rr*math.cos(a),cy+rr*math.sin(a)))
    dr.polygon(pts,fill=fill)
def pattern(t):
    S=2; P=Image.new('RGB',(W*S,H*S)); dr=ImageDraw.Draw(P)
    base=[(255,240,170),(255,214,228),(206,240,214),(196,222,255),(238,222,255)][t]
    dr.rectangle([0,0,W*S,H*S],fill=base)
    step=70*S
    for j,y in enumerate(range(0,H*S+step,step)):
        for x in range(-step,W*S+step,step):
            cx=x+(step//2 if j%2 else 0); cy=y
            if t==0:
                dr.ellipse([cx-9*S,cy-9*S,cx+9*S,cy+9*S],fill=(255,190,60))
                for k in range(8):
                    a=k*math.pi/4; dr.line([cx+13*S*math.cos(a),cy+13*S*math.sin(a),cx+19*S*math.cos(a),cy+19*S*math.sin(a)],fill=(255,190,60),width=3*S)
            elif t==1:
                dr.ellipse([cx-11*S,cy-11*S,cx+11*S,cy+11*S],fill=(255,255,255)); dr.ellipse([cx+step//2-6*S,cy+step//2-6*S,cx+step//2+6*S,cy+step//2+6*S],fill=(255,170,200))
            elif t==2:
                col=[(255,140,170),(255,200,80),(180,140,255)][(j+x//step)%3]
                for k in range(5):
                    a=k*2*math.pi/5; px,py=cx+9*S*math.cos(a),cy+9*S*math.sin(a); dr.ellipse([px-7*S,py-7*S,px+7*S,py+7*S],fill=col)
                dr.ellipse([cx-5*S,cy-5*S,cx+5*S,cy+5*S],fill=(255,230,120))
                dr.ellipse([cx+step//2-4*S,cy+step//2-8*S,cx+step//2+4*S,cy+step//2+8*S],fill=(120,200,130))
            elif t==3:
                star(dr,cx,cy,15*S,(255,226,110)); dr.ellipse([cx+step//2-3*S,cy+step//2-3*S,cx+step//2+3*S,cy+step//2+3*S],fill=(255,255,255))
            else:
                dr.polygon([(cx,cy-18*S),(cx+12*S,cy),(cx,cy+18*S),(cx-12*S,cy)],fill=(222,178,60)); dr.polygon([(cx,cy-9*S),(cx+6*S,cy),(cx,cy+9*S),(cx-6*S,cy)],fill=(255,226,120))
    return np.asarray(P.resize((W,H),Image.LANCZOS)).astype(float)
def out(arr,name):
    Image.fromarray(np.clip(arr,0,255).astype('uint8')).resize((800,600),Image.LANCZOS).save(f'{A}/{name}.webp','WEBP',quality=80,method=6)
out(ar,'room0')
for t in range(5):
    pat=pattern(t)*lum[:,:,None]
    out(ar*(1-m[:,:,None])+pat*m[:,:,None], f'room{t+1}')
    # swatch for shop icon
    Image.fromarray(np.clip(pat[200:340,60:260],0,255).astype('uint8')).resize((170,120)).save(f'{A}/h_wall{t+1}.webp','WEBP',quality=80)
print('ok')
