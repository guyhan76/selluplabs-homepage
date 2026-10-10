import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH||'/usr/bin/chromium',args:['--disable-dev-shm-usage']});
const base=process.env.YOUNGHWA_PREVIEW_URL||'http://127.0.0.1:4192';
const out=new URL('../../../docs/younghwa-preview/',import.meta.url);await fs.mkdir(out,{recursive:true});
const results=[];
for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},locale:'ko-KR',reducedMotion:'reduce'});const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.locator('.hero-poster img').first().waitFor();await page.evaluate(()=>Promise.all([...document.querySelectorAll('.hero img')].map(i=>i.decode())));
 await page.screenshot({path:new URL(`${name}-hero.png`,out).pathname});
 assert.equal(await page.locator('.case-card').count(),8);
 await page.getByRole('button',{name:/프리미엄 패키지 15/}).click();assert.equal(await page.locator('.case-card').count(),8);
 await page.getByRole('button',{name:'제작 사례 더 보기'}).click();assert.equal(await page.locator('.case-card').count(),15);assert.equal(await page.locator('#load-more').isVisible(),false);
 assert.equal(await page.locator('.case-card[data-case*="corrugated"]').count(),0);
 await page.getByRole('button',{name:/골판지 박스 15/}).click();await page.locator('.case-card').first().click();
 assert.equal(await page.locator('#case-dialog').isVisible(),true);assert.equal(await page.locator('#case-title').innerText(),'맞춤형 골판지 박스');
 await page.getByRole('button',{name:'다음 사례'}).click();assert.equal(await page.locator('#case-title').innerText(),'택배용 표준 박스');
 await page.getByRole('button',{name:'이 사례로 문의'}).click();assert.equal(await page.locator('#case-dialog').isVisible(),false);assert.match(await page.locator('[name=details]').inputValue(),/택배용 표준 박스/);
 assert.equal(await page.locator('[name=type]').inputValue(),'골판지·산업 포장');
 await page.getByRole('button',{name:/전체 30/}).click();while(await page.locator('#load-more').isVisible())await page.locator('#load-more').click();
 assert.equal(await page.locator('.case-card').count(),30);
 const assets=await page.evaluate(async()=>{const paths=window.YOUNGHWA_CASES.flatMap(c=>[`assets/${c.id}.webp`,`assets/${c.id}-thumb.webp`]);return Promise.all(paths.map(src=>new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(true);i.onerror=()=>resolve(src);i.src=src})));});assert(assets.every(v=>v===true));
 await page.getByRole('button',{name:'영어로 보기'}).click();assert.equal(await page.locator('html').getAttribute('lang'),'en');assert.match(await page.locator('h1').innerText(),/Made for your product/);
 assert.equal(await page.locator('a[href="tel:16441410"]').count(),2);assert.equal(await page.locator('a[href="mailto:lis000@hanmail.net"]').count(),1);
 await page.getByRole('button',{name:'View in Korean'}).click();
 if(name==='mobile'){await page.getByRole('button',{name:'메뉴 열기'}).click();assert.equal(await page.locator('#mobile-nav').isVisible(),true);await page.locator('#mobile-nav a').first().click();assert.equal(await page.locator('#mobile-nav').isVisible(),false);}
 for(const size of [320,390,768,1440]){await page.setViewportSize({width:size,height});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${size}`);}
 await page.setViewportSize({width,height});await page.getByRole('button',{name:/전체 30/}).click();await page.locator('#home').scrollIntoViewIfNeeded();await page.evaluate(()=>scrollTo(0,0));
 await page.screenshot({path:new URL(`${name}-full.png`,out).pathname,fullPage:true});
 const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>n.target)})),[]);
 assert.deepEqual(errors,[]);results.push({viewport:name,cases:30,assets:60,filters:true,modalNavigation:true,enquiryPrefill:true,bilingual:true,overflowWidths:[320,390,768,1440],accessibilityViolations:0,pageErrors:0});await context.close();
}
await browser.close();await fs.writeFile(new URL('validation.json',out),JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
