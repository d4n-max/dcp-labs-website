import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

// The normal Vite client build remains the runtime. A second, build-only
// bundle renders those same components; there is no production Node server.
await build();
await build({ build: { ssr: 'src/entry-server.tsx', outDir: 'dist-ssr', manifest: false } });
const serverFiles = await fs.readdir('dist-ssr');
const entry = serverFiles.find(file => /^entry-server\..*js$/.test(file));
if (!entry) throw new Error('Server entry was not emitted');
const { render, publicRoutes, routeRedirects, blogPosts } = await import(pathToFileURL(path.resolve('dist-ssr', entry)));
if (publicRoutes.length !== new Set(publicRoutes).size) throw new Error('Duplicate public route');
const config = JSON.parse(await fs.readFile('vercel.json', 'utf8'));
if (JSON.stringify(config.redirects) !== JSON.stringify(routeRedirects) || config.rewrites?.length) {
  throw new Error('Hosting redirects must match the public route catalogue; catch-all SPA rewrites are unsafe');
}
const template = await fs.readFile('dist/index.html', 'utf8');
const manifest = JSON.parse(await fs.readFile('dist/.vite/manifest.json', 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[ch]));
const metaTags = data => {
  const canonical = data.path === null ? null : new URL(data.path, 'https://dcplabs.app').href;
  const image = new URL(data.image ?? '/og-dcp-labs.svg', 'https://dcplabs.app').href;
  const tags = ['<title>'+escape(data.title)+'</title>'];
  const meta = (attribute,key,value) => { if(value!==null)tags.push('<meta '+attribute+'="'+key+'" content="'+escape(value)+'" />') };
  meta('name','description',data.description);meta('name','robots',data.robots ?? 'index, follow');
  for(const [key,value]of Object.entries({title:data.title,description:data.description,type:data.type??'website',url:canonical,image}))meta('property','og:'+key,value);
  for(const [key,value]of Object.entries({card:'summary_large_image',title:data.title,description:data.description,image}))meta('name','twitter:'+key,value);
  if(canonical)tags.push('<link rel="canonical" href="'+escape(canonical)+'" />');
  for(const item of data.jsonLd ? (Array.isArray(data.jsonLd)?data.jsonLd:[data.jsonLd]) : [])tags.push('<script type="application/ld+json" data-dcp-json-ld="true">'+JSON.stringify(item).replace(/</g,'\\u003c')+'</script>');
  return {canonical,html:tags.join('\n')};
};
const stripSeo = source => source.replace(/<title>[\s\S]*?<\/title>/gi,'').replace(/<meta\b[^>]*(?:name="(?:description|robots|twitter:[^"]*)"|property="og:[^"]*")[^>]*>/gi,'').replace(/<link\b[^>]*rel="canonical"[^>]*>/gi,'');
const cleanHead = stripSeo(template);
// The initial English hero uses this exact face. Discover it before stylesheet
// layout so its first measurement does not need a fallback-font reflow.
const latinFont = (await fs.readdir('dist/assets')).find(file => /^manrope-latin-wght-normal-.*\.woff2$/.test(file));
if (!latinFont) throw new Error('Missing critical Manrope Latin font');
const criticalFont = '<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/'+latinFont+'" />';
// Non-JavaScript readers get the same static vertical alternative rather than
// invisible Framer reveals or a clipped horizontal track. JS motion is unchanged.
const revealTargets=['main h1','[data-hero]','[data-story-hero]','[data-rf-hero]','[data-cr-hero]','[data-ll-hero]','[data-kb-hero]'];
const guarded=revealTargets.map(selector=>'#root[data-prerendered]:not([data-hydrated]) '+selector).join(',');
const noJsVisible=revealTargets.map(selector=>'#root[data-prerendered] '+selector).join(',');
const startupStyle = `<style>
[data-hydration-loading]{display:none}
@media(prefers-reduced-motion:no-preference){
${guarded}{visibility:hidden}
#root[data-prerendered]:not([data-hydrated])+[data-hydration-loading]{display:block;visibility:hidden;animation:dcp-hydration-visible 0s linear .2s forwards}
#root:has([data-route-loading])+[data-hydration-loading]{display:none!important}
}
@media(prefers-reduced-motion:reduce){[data-nojs-reveal]{opacity:1!important;transform:none!important}}
@keyframes dcp-hydration-visible{to{visibility:visible}}
</style>`;
const hydrationStatus='<div data-hydration-loading role="status" aria-live="polite" aria-atomic="true" class="pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-[#100C19] px-5 py-3 text-sm font-semibold text-[#F5F1EA] shadow-lg">Loading page…</div>';
const noScript = `<noscript><style>
${noJsVisible}{visibility:visible!important}
[data-hydration-loading]{display:none!important}
[data-nojs-reveal]{opacity:1!important;transform:none!important}
[data-story-viewport],[data-rf-viewport],[data-cr-viewport],[data-story]{height:auto!important;min-height:0!important;overflow:visible!important}
[data-story-track],[data-rf-track],[data-cr-track]{display:block!important;width:100%!important;height:auto!important;transform:none!important}
[data-story-chapter],[data-rf-chapter],[data-cr-chapter],[data-product-panel]{width:100%!important;height:auto!important;min-height:100svh}
[data-story-chrome]{position:relative!important}
[data-story-ambient],[data-handoff-grid]{display:none!important}
[data-story-base]{opacity:1!important}
</style></noscript>`;
const productPaths = ['/kinbrief','/servicesphere-field-service-app','/learnlift-ai','/caretail','/coinrelic','/roleforge'];
function assetsFor(route) {
  const entry = route==='/'||route==='/labs-preview' ? 'src/labs-preview/LabsPreviewPage.tsx' : productPaths.includes(route) ? 'src/ProductPages.tsx' : 'src/PageRoutes.tsx';
  const css = new Set(), scripts = new Set(), visited = new Set();
  const visit = key => {if(visited.has(key))return;visited.add(key);const item=manifest[key];if(!item)throw Error('Missing manifest entry '+key);if(item.file.endsWith('.js'))scripts.add(item.file);item.css?.forEach(file=>css.add(file));item.imports?.forEach(visit)};
  visit(entry);
  return [...[...scripts].filter(file=>!template.includes('/'+file)).map(file=>'<link rel="modulepreload" crossorigin href="/'+file+'" />'),...[...css].filter(file=>!template.includes('/'+file)).map(file=>'<link rel="stylesheet" href="/'+file+'" />')].join('\n');
}
const outputs=[],inventory=[];
for(const route of [...publicRoutes,'/labs-preview','/404']) {
  const {html,metadata}=await render(route);
  if(html.includes('<!--$?-->')||html.includes('<!--$!-->')||/hidden id="S:/.test(html))throw Error('Unresolved static Suspense boundary '+route);
  if(!/<h1\b/.test(html)||!/<main\b/.test(html))throw Error('Missing meaningful prerender for '+route);
  const head=metaTags(metadata);
  if(publicRoutes.includes(route) && (metadata.robots?.includes('noindex')||head.canonical!=='https://dcplabs.app'+route))throw Error('Invalid public canonical/indexability '+route);
  // Preserve the existing standalone legal document's entire body and styling.
  // Its head receives the same correct SEO fields, without mounting React.
  const standalone=route!=='/'?await fs.readFile('public'+route+'.html','utf8').catch(error=>{if(error.code==='ENOENT')return null;throw error}):null;
  const output=standalone?stripSeo(standalone).replace('</head>',head.html+'\n</head>'):cleanHead.replace('<head>', '<head>'+(['/caretail','/kinbrief'].includes(route)?'\n'+criticalFont:'')).replace('</head>',head.html+'\n'+assetsFor(route)+'\n'+startupStyle+'\n'+noScript+'\n</head>').replace('<div id="root"></div>',()=>'<div id="root" data-prerendered="true"'+(route==='/404'?' data-http-status="404"':'')+'>'+html+'</div>'+hydrationStatus);
  if(!standalone&&!output.includes('data-prerendered'))throw Error('Missing root placeholder');
  const file=route==='/'?'dist/index.html':route==='/404'?'dist/404.html':'dist'+route+'.html';
  outputs.push({file,output});inventory.push({route,canonical:head.canonical,indexable:publicRoutes.includes(route),standalone:!!standalone,htmlBytes:Buffer.byteLength(output)});
}
// No fabricated lastmod: publish dates describe publication, not modification.
// Omit lastmod until the editorial workflow provides verified modification data.
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+publicRoutes.map(route=>'  <url><loc>'+escape('https://dcplabs.app'+route)+'</loc></url>').join('\n')+'\n</urlset>\n';
for(const {file,output}of outputs){await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,output)}
await fs.writeFile('dist/sitemap.xml',sitemap);
await fs.writeFile('dist/.vite/seo-routes.json',JSON.stringify({publicRoutes:publicRoutes.length,publishedPosts:blogPosts.length,redirects:routeRedirects,inventory},null,2));
console.log('SEO build:',publicRoutes.length,'canonical URLs,',blogPosts.length,'published posts,',outputs.length,'prerendered documents.');
