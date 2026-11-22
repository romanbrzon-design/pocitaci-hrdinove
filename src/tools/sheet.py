import sys
from PIL import Image
files=sys.argv[2:]; ims=[Image.open(f) for f in files]
H=260; tot=sum(int(i.size[0]*H/i.size[1])+10 for i in ims)
W=Image.new('RGB',(tot,H+10),(200,220,240)); x=0
for im in ims:
    im2=im.resize((int(im.size[0]*H/im.size[1]),H)); W.paste(im2,(x,5),im2); x+=im2.size[0]+10
W.save(sys.argv[1])
