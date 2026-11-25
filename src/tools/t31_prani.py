import asyncio, json, sys
from playwright.async_api import async_playwright
WISH=[]; MODE={'v':'new'}
async def handler(route):
    req=route.request
    if req.method=='GET':
        await route.fulfill(status=200, content_type='application/json', body=json.dumps({'settings':json.dumps({'pin':'1234','reward':'x','length':'mid','perDay':10,'ver':3,'rep':{'on':True,'email':'tata@seznam.cz','day':6}}),'profiles':{'p2':json.dumps({'id':'p2','name':'Víťa','grade':2,'gender':'m','mode':'quest','points':0,'owned':{},'eq':{},'xp':29,'totalCorrect':20,'beaten':0,'cats':['add20']})}}))
    else:
        b=json.loads(req.post_data)
        if b.get('action')=='wish':
            WISH.append(b)
            if MODE['v']=='old': return await route.fulfill(status=200, content_type='application/json', body='{"ok":true}')
            return await route.fulfill(status=200, content_type='application/json', body='{"ok":true,"wish":true,"sent":true}')
        await route.fulfill(status=200, content_type='application/json', body='{"ok":true,"rejected":[]}')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        pg=await b.new_page(viewport={'width':390,'height':844}); pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.add_init_script("localStorage.setItem('ph-intro','1'); localStorage.setItem('ph-family','\"TEST01\"');")
        await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body="window.BACKEND_URL='https://mock.backend/exec';"))
        await pg.route('**/sw.js', lambda r: r.fulfill(status=404, body=''))
        await pg.route('https://mock.backend/**', handler)
        await pg.goto('http://localhost:8765/index.html'); await pg.wait_for_timeout(1500)
        await pg.click('[data-act=parent]'); await pg.fill('#pin','1234'); await pg.click('[data-act=pinok]'); await pg.wait_for_timeout(300)
        await pg.click('[data-tab=wish]'); await pg.wait_for_timeout(300)
        assert await pg.input_value('#w-email')=='tata@seznam.cz'
        await pg.screenshot(path='/tmp/wish1.png', full_page=True)
        await pg.click('[data-act=wish-send]'); await pg.wait_for_timeout(300)
        assert len(WISH)==0, 'prazdne neodeslat'
        await pg.select_option('#w-kind','learn'); await pg.fill('#w-text','Prosím přidat převody jednotek času do 3. třídy.')
        await pg.evaluate("render()"); assert 'převody' in await pg.input_value('#w-text'), 'draft ztracen'
        await pg.click('[data-act=wish-send]'); await pg.wait_for_timeout(800)
        assert len(WISH)==1 and WISH[0]['kind']=='learn' and WISH[0]['family']=='TEST01' and WISH[0]['email']=='tata@seznam.cz', WISH
        print('info:', WISH[0]['info'][:80])
        assert await pg.input_value('#w-text')==''
        await pg.screenshot(path='/tmp/wish2.png', full_page=True)
        # starý backend (neumí wish) -> nabídne mailto
        MODE['v']='old'; await pg.fill('#w-text','Test starého serveru'); await pg.click('[data-act=wish-send]'); await pg.wait_for_timeout(600)
        m=await pg.inner_text('.modal'); assert 'e-mailov' in m, m
        print('errs', errs); print('OK')
        await b.close()
asyncio.run(main())
