import sys; sys.path.insert(0,'/home/claude/gem')
from cut import split_n
path,prefix,n=sys.argv[1],sys.argv[2],int(sys.argv[3])
o=split_n(path,n); print(len(o),[i.size for i in o])
for i,im in enumerate(o): im.save(f'/home/claude/gem/out/{prefix}{i+1}.png')
