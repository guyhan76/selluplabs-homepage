// Build a self-contained review HTML. No upload service, API key or hosting dependency.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const site=fileURLToPath(new URL('../',import.meta.url));
const output=fileURLToPath(new URL('../../../docs/younghwa-preview/',import.meta.url));
await fs.mkdir(output,{recursive:true});
const assets={};for(const name of await fs.readdir(path.join(site,'assets'))){if(!/\.(png|webp)$/.test(name))continue;assets[`assets/${name}`]=`data:image/${name.endsWith('.png')?'png':'webp'};base64,${(await fs.readFile(path.join(site,'assets',name))).toString('base64')}`;}
let app=await fs.readFile(path.join(site,'app.js'),'utf8');
app=app.replace('`assets/${id.toLowerCase()}${thumb?\'-thumb\':\'\'}.webp`','window.YOUNGHWA_ASSETS[`assets/${id.toLowerCase()}${thumb?\'-thumb\':\'\'}.webp`]');
app=app.replaceAll('src="assets/younghwa-logo.png"',`src="${assets['assets/younghwa-logo.png']}"`);
app=app.replaceAll('src="favicon.svg"',`src="data:image/svg+xml;base64,${(await fs.readFile(path.join(site,'favicon.svg'))).toString('base64')}"`);
const css=await fs.readFile(path.join(site,'styles.css'),'utf8');
const data=await fs.readFile(path.join(site,'cases.js'),'utf8');
let html=await fs.readFile(path.join(site,'index.html'),'utf8');
html=html.replace('<link rel="stylesheet" href="styles.css">',()=>`<style>${css}</style>`).replace('<script src="cases.js" defer></script><script src="app.js" defer></script>','');
html=html.replace('href="favicon.svg"',`href="data:image/svg+xml;base64,${(await fs.readFile(path.join(site,'favicon.svg'))).toString('base64')}"`);
const script=`window.YOUNGHWA_ASSETS=${JSON.stringify(assets)};\n${data}\n${app}`.replace(/<\/script/gi,'<\\/script');
html=html.replace('</body>',()=>`<script>${script}</script></body>`);
await fs.writeFile(path.join(output,'younghwa-preview.html'),html);
console.log(`Standalone preview: ${Buffer.byteLength(html)} bytes · ${Object.keys(assets).length} embedded assets`);
