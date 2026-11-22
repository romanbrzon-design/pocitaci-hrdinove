import numpy as np, json
from PIL import Image
sp=['cat','dog','bunny','pony','rat','hamster','fox','panda','owl','dragon']
res={}
for s in sp:
  for k in (0,1):
    im=Image.open(f'/home/claude/pocitani/site/assets/pet_{s}_{k}.webp').convert('RGBA'); a=np.asarray(im)[:,:,3]>40
    H,W=a.shape; rows=np.where(a.any(1))[0]; top,bot=rows[0],rows[-1]
    widths=a.sum(1)
    # head = upper mass; find neck as min width between 35% and 70% of figure height (by span)
    lo=top+int((bot-top)*.35); hi=top+int((bot-top)*.72)
    # use row extents
    ext=[]
    for r in range(lo,hi):
      c=np.where(a[r])[0]; ext.append(c[-1]-c[0] if len(c) else 9999)
    neck=lo+int(np.argmin(ext)); c=np.where(a[neck])[0]; nx=(c[0]+c[-1])/2/W; nw=(c[-1]-c[0])/W
    # head width = max width above neck
    hw=0;hx=.5
    for r in range(top,neck):
      c=np.where(a[r])[0]
      if len(c) and c[-1]-c[0]>hw: hw=c[-1]-c[0]; hx=(c[0]+c[-1])/2
    # head top: first row where width > 45% of head width (skip ears)
    ht=top
    for r in range(top,neck):
      c=np.where(a[r])[0]
      if len(c) and (c[-1]-c[0])>0.55*hw: ht=r; break
    cb=np.where(a[bot-3])[0]
    res[f'{s}_{k}']=dict(W=W,H=H,top=round(top/H,3),ht=round(ht/H,3),hx=round(hx/W,3),hw=round(hw/W,3),neck=round(neck/H,3),nx=round(nx,3),nw=round(nw,3),bot=round(bot/H,3),bw=round((cb[-1]-cb[0])/W,3))
print(json.dumps(res))
json.dump(res,open('/home/claude/gem/anchors.json','w'))
