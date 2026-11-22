import sys, numpy as np
from PIL import Image
from scipy import ndimage
def cutout(path, thr=238, dil=8, minarea=2500, crop=None):
    im=Image.open(path).convert('RGB')
    if crop: im=im.crop(crop)
    a=np.asarray(im).astype(int)
    white=(a[:,:,0]>thr)&(a[:,:,1]>thr)&(a[:,:,2]>thr)
    lab,n=ndimage.label(white)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bg=np.isin(lab,list(border))
    # interior pure-white holes (gaps between arm and body) that are big
    vw=(a[:,:,0]>246)&(a[:,:,1]>246)&(a[:,:,2]>246)
    lab3,n3=ndimage.label(vw&~bg)
    if n3:
        sizes=ndimage.sum(np.ones_like(lab3),lab3,range(1,n3+1))
        big=[i+1 for i,s in enumerate(sizes) if s>350]
        bg|=np.isin(lab3,big)
    alpha=np.where(bg,0,255).astype(np.uint8)
    alpha=ndimage.grey_erosion(alpha,size=(2,2))
    alpha=ndimage.gaussian_filter(alpha.astype(float),0.6).clip(0,255).astype(np.uint8)
    rgba=np.dstack([np.asarray(im),alpha])
    obj=alpha>128; lab2,n2=ndimage.label(ndimage.binary_dilation(obj,iterations=dil))
    objs=[]
    for k,sl in enumerate(ndimage.find_objects(lab2)):
        h=sl[0].stop-sl[0].start; w=sl[1].stop-sl[1].start
        if h*w<minarea: continue
        sub=rgba[sl].copy(); m=(lab2[sl]==k+1); sub[:,:,3]=np.where(m,sub[:,:,3],0)
        objs.append((sl[1].start, sl[0].start, Image.fromarray(sub)))
    return objs
if __name__=='__main__':
    path,prefix=sys.argv[1],sys.argv[2]; n=int(sys.argv[3]) if len(sys.argv)>3 else None
    rows=sys.argv[4] if len(sys.argv)>4 else 'row'
    objs=cutout(path)
    if rows=='grid': objs.sort(key=lambda o:(round(o[1]/150),o[0]))
    else: objs.sort(key=lambda o:o[0])
    print('found',len(objs),[o[2].size for o in objs])
    for i,(_,_,im) in enumerate(objs): im.save(f'/home/claude/gem/out/{prefix}{i+1}.png')

def split_cols(path, gap=3, minw=30, **kw):
    im=Image.open(path).convert('RGB'); a=np.asarray(im).astype(int)
    objs=cutout(path, dil=1, minarea=1, **kw)
    # rebuild full alpha
    full=np.zeros(a.shape[:2],np.uint8)
    for x,y,o in objs:
        al=np.asarray(o)[:,:,3]; full[y:y+al.shape[0],x:x+al.shape[1]]=np.maximum(full[y:y+al.shape[0],x:x+al.shape[1]],al)
    col=(full>128).sum(0)>0
    runs=[];s=None;empty=0
    for x,c in enumerate(col):
        if c:
            if s is None: s=x
            empty=0; e=x
        elif s is not None:
            empty+=1
            if empty>gap: runs.append((s,e)); s=None
    if s is not None: runs.append((s,e))
    out=[]
    rgba=np.dstack([np.asarray(im),full])
    for s,e in runs:
        if e-s<minw: continue
        sub=rgba[:,s:e+1]; rows=np.where((sub[:,:,3]>128).any(1))[0]
        out.append(Image.fromarray(sub[rows[0]:rows[-1]+1]))
    return out

def split_n(path, n, **kw):
    im=Image.open(path).convert('RGB'); a=np.asarray(im)
    objs=cutout(path, dil=1, minarea=1, **kw)
    full=np.zeros(a.shape[:2],np.uint8)
    for x,y,o in objs:
        al=np.asarray(o)[:,:,3]; full[y:y+al.shape[0],x:x+al.shape[1]]=np.maximum(full[y:y+al.shape[0],x:x+al.shape[1]],al)
    colsum=(full>128).sum(0)
    xs=np.where(colsum>0)[0]; x0,x1=xs[0],xs[-1]
    # cut points: near equal division, choose min colsum within window
    cuts=[x0]
    step=(x1-x0)/n
    for k in range(1,n):
        c=int(x0+k*step); w=int(step*0.35)
        seg=colsum[c-w:c+w]; cuts.append(c-w+int(np.argmin(seg)))
    cuts.append(x1+1)
    rgba=np.dstack([a,full]); out=[]
    for s,e in zip(cuts[:-1],cuts[1:]):
        sub=rgba[:,s:e]
        # keep only largest connected blob(s) touching the main body: drop tiny fragments
        m=sub[:,:,3]>128; lab,nn=ndimage.label(m)
        if nn>1:
            sizes=ndimage.sum(m,lab,range(1,nn+1)); keep=[i+1 for i,sz in enumerate(sizes) if sz>0.04*sizes.max()]
            sub=sub.copy(); sub[:,:,3]=np.where(np.isin(lab,keep),sub[:,:,3],0)
        rows=np.where((sub[:,:,3]>128).any(1))[0]; cols=np.where((sub[:,:,3]>128).any(0))[0]
        out.append(Image.fromarray(sub[rows[0]:rows[-1]+1, cols[0]:cols[-1]+1]))
    return out
