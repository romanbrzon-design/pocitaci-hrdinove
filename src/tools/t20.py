import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        pg=await b.new_page(); pg.on('pageerror',lambda e: errs.append(str(e)+' '+str(e.stack)[:400]))
        await pg.route('**/fonts.googleapis.com/**', lambda r: r.abort())
        await pg.route('**/config.js', lambda r: r.fulfill(status=200, content_type='application/javascript', body=''))
        await pg.goto('file:///home/claude/pocitani/site/index.html'); await pg.wait_for_timeout(500)
        print(errs); await b.close()
asyncio.run(main())
