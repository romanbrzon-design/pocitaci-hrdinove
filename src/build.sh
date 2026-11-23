cd /home/claude/pocitani && python3 - <<'PY'
h=open('part_head.html').read().replace('/*THEME*/',open('part_theme.css').read())
open('site/index.html','w').write(h+''.join(open(f).read() for f in ['part_gen.js','part_gen2.js','part_gen0.js','part_subj.js','part_prv.js','part_cj2.js','part_m3.js','part_en2.js','part_rpg.js','part_art.js','part_modes.js','part_img.js','part_more.js','part_main.js','part_persist.js','part_views.js','part_fun.js','part_look.js','part_stk.js','part_mini.js','part_sfx.js','part_family.js']))
PY
node -e "const fs=require('fs');const h=fs.readFileSync('site/index.html','utf8');fs.writeFileSync('/tmp/x.js',h.match(/<script>([\s\S]*)<\/script>/)[1]);" && node --check /tmp/x.js && echo SYNTAX OK
