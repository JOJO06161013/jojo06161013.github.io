'use strict';
// === 可扩展内容契约：草稿不进入前台，新增案例不依赖固定数量 ===
function validateContent_v3(data_v3){
 const ids_v3=new Set(),groups_v3=new Set(data_v3.groups.map(group_v3=>group_v3.id));
 if(!Array.isArray(data_v3.projects)||!data_v3.projects.some(project_v3=>project_v3.status==='published'))throw Error('至少需要一个已发布案例');
 for(const project_v3 of data_v3.projects){
  if(!/^[a-z0-9-]+$/.test(project_v3.id)||ids_v3.has(project_v3.id))throw Error('案例 ID 无效或重复');
  ids_v3.add(project_v3.id);
  if(!groups_v3.has(project_v3.group)||!['draft','published'].includes(project_v3.status)||!Number.isFinite(project_v3.sortOrder))throw Error('案例分类、状态或顺序无效');
  if(project_v3.url&&!/^https:\/\//.test(project_v3.url))throw Error('项目链接须为 HTTPS');
  if(project_v3.image&&(!/^assets\/[\w./-]+$/.test(project_v3.image)||project_v3.image.includes('..')))throw Error('封面须为本地素材');
  if(project_v3.status==='draft')continue;
  for(const key_v3 of ['title','subtitle','ownership','background','goal','process','result'])if(typeof project_v3[key_v3]!=='string'||!project_v3[key_v3].trim())throw Error('缺少案例字段：'+key_v3);
  for(const item_v3 of project_v3.gallery||[])if(!/^assets\/[\w./-]+$/.test(item_v3.src)||item_v3.src.includes('..')||!item_v3.alt)throw Error('图片地址或说明无效');
 }
}
// === 左侧内嵌目录：自然页面滚动，不遮挡人物舞台 ===
const folder_v3=document.querySelector('#folder-dialog'),imageDialog_v3=document.querySelector('#image-dialog');
// === 目录是唯一项目列表，新增案例自动加入 ===
function openDirectory_v17(write_v17=true,scroll_v17=true){
 folder_v3.hidden=false;document.querySelector('#case').hidden=true;
 document.querySelector('#open-folder').setAttribute('aria-expanded','true');
 if(write_v17&&location.hash!=='#work')history.pushState(null,'','#work');
 if(scroll_v17){document.querySelector('#work').scrollIntoView({behavior:'instant'});folder_v3.focus({preventScroll:true});}
}
document.querySelector('#open-folder').addEventListener('click',()=>openDirectory_v17());
function closeFolder_v3(){folder_v3.hidden=true;document.querySelector('#open-folder').setAttribute('aria-expanded','false');document.querySelector('#open-folder').focus({preventScroll:true});}
document.querySelector('#close-folder').addEventListener('click',()=>{closeFolder_v3();history.replaceState(null,'','#work-intro');window.portfolioScroll_v7.navigate(document.querySelector('#work-intro'));});
folder_v3.addEventListener('cancel',event_v17=>{event_v17.preventDefault();document.querySelector('#close-folder').click();});
function renderDirectory_v17(){
 const zh_v17=language_v4==='zh';
 const labels_v17={pinpet:zh_v17?'个人产品 · 独立开发':'Independent product · Solo development',quality:zh_v17?'数据与自动化 · 中康':'Data & automation · Sinohealth',research:zh_v17?'生物统计 · IQVIA':'Biostatistics · IQVIA',oncology:zh_v17?'真实世界研究 · IQVIA':'Real-world research · IQVIA'};
 document.querySelector('#project-list-v17').innerHTML=content_v5.projects.map((p_v17,i_v17)=>{
  const group_v17=content_v5.groups.find(g_v17=>g_v17.id===p_v17.group);
  const label_v17=labels_v17[p_v17.id]||group_v17?.label||p_v17.category;
  const image_v17=p_v17.image?'<img src="'+escape_v5(p_v17.image)+'" alt="'+escape_v5(p_v17.imageAlt||p_v17.title)+'" loading="lazy">':diagram_v5(p_v17);
  const note_v17=p_v17.visualLabel|| (p_v17.referenceMaterial?(zh_v17?'公开资料示意':'Public reference'):(p_v17.image?'':(zh_v17?'工作流程示意':'Workflow illustration')));
  return '<button type="button" class="directory-card-v17" data-case="'+i_v17+'" data-project-id="'+escape_v5(p_v17.id)+'" aria-label="'+escape_v5(t_v4('viewCase')+p_v17.title)+'"><span class="directory-copy-v17"><span class="directory-label-v17">'+escape_v5(label_v17)+'</span><strong>'+escape_v5(p_v17.title)+'</strong><span class="directory-description-v17">'+escape_v5(p_v17.id==='pinpet'?p_v17.subtitle:p_v17.intro)+'</span><span class="directory-cta-v17">'+(zh_v17?'查看案例':'View case')+' <span aria-hidden="true">↗</span></span></span><span class="directory-art-v17"><span class="directory-image-v17">'+image_v17+'</span>'+(note_v17?'<span class="directory-image-note-v17">'+escape_v5(note_v17)+'</span>':'')+'</span></button>';
 }).join('');
}

// === 完整图片与大图浏览：原比例、可滚动放大、恢复打开位置 ===
let imageScale_v3=1,imageFocus_v3=null;
function applyZoom_v3(){document.querySelector('#image-full').style.width=(imageScale_v3*100)+'%';document.querySelector('#zoom-value').textContent=Math.round(imageScale_v3*100)+'%';document.querySelector('#zoom-out').disabled=imageScale_v3<=1;document.querySelector('#zoom-in').disabled=imageScale_v3>=3}
function openImage_v3(item_v3){imageFocus_v3=document.activeElement;imageScale_v3=1;document.querySelector('#image-full').src=item_v3.src;document.querySelector('#image-full').alt=item_v3.alt;document.querySelector('#image-title').textContent=item_v3.caption||item_v3.alt;applyZoom_v3();imageDialog_v3.showModal();document.querySelector('#image-scroll').scrollTo(0,0)}
function closeImage_v3(){imageDialog_v3.close();imageFocus_v3?.focus({preventScroll:true})}
document.querySelector('#close-image').addEventListener('click',closeImage_v3);
imageDialog_v3.addEventListener('cancel',event_v3=>{event_v3.preventDefault();closeImage_v3()});
document.querySelector('#zoom-in').addEventListener('click',()=>{imageScale_v3=Math.min(3,imageScale_v3+.5);applyZoom_v3()});
document.querySelector('#zoom-out').addEventListener('click',()=>{imageScale_v3=Math.max(1,imageScale_v3-.5);applyZoom_v3()});
window.addEventListener('popstate',()=>{if(imageDialog_v3.open)closeImage_v3()});
function renderGallery_v3(project_v3){
 document.querySelector('#case').classList.toggle('pinpet-case-v20',project_v3.id==='pinpet'); document.querySelector('#image-dialog').classList.toggle('pinpet-images-v20',project_v3.id==='pinpet');
 document.querySelector('#case').classList.toggle('quality-case-v18',project_v3.id==='quality');
 document.querySelector('#case').classList.toggle('reference-case-v16',!!project_v3.referenceMaterial);
 document.querySelector('#case-period').textContent=project_v3.period||'';
 document.querySelector('#case-source').textContent=project_v3.sourceNote||'';
 document.querySelector('#case-source').hidden=!project_v3.sourceNote?.trim();
 const media_v3=project_v3.gallery?.length?project_v3.gallery:project_v3.image?[{src:project_v3.image,alt:project_v3.imageAlt||project_v3.title,caption:project_v3.galleryCaption}]:[];
 const visual_v3=document.querySelector('#case-visual'),gallery_v3=document.querySelector('#case-gallery');
 gallery_v3.innerHTML='';
 if(!media_v3.length){visual_v3.classList.remove('has-gallery');return}
 visual_v3.classList.add('has-gallery');visual_v3.innerHTML='';
 media_v3.forEach((item_v3,index_v3)=>{
  const figure_v3=document.createElement('figure'),button_v3=document.createElement('button'),img_v3=document.createElement('img'),caption_v3=document.createElement('figcaption');
  figure_v3.dataset.format=item_v3.format||'wide';if(item_v3.title){const heading_v20=document.createElement('h3');heading_v20.className='gallery-title-v20';heading_v20.textContent=item_v3.title;figure_v3.append(heading_v20);}
  button_v3.className='gallery-open';button_v3.setAttribute('aria-label',t_v4('zoom')+item_v3.alt);img_v3.src=item_v3.src;img_v3.alt=item_v3.alt;img_v3.loading=index_v3?'lazy':'eager';button_v3.append(img_v3);button_v3.addEventListener('click',()=>openImage_v3(item_v3));caption_v3.textContent=(item_v3.caption||item_v3.alt)+t_v4('zoomHint');figure_v3.append(button_v3,caption_v3);if(item_v3.sourceUrl&&/^https:\/\//.test(item_v3.sourceUrl)){const source_v16=document.createElement('a');source_v16.className='reference-source-v16';source_v16.href=item_v3.sourceUrl;source_v16.target='_blank';source_v16.rel='noopener noreferrer';source_v16.textContent=item_v3.sourceLabel||'IQVIA';figure_v3.append(source_v16);}(index_v3?gallery_v3:visual_v3).append(figure_v3);
 });
}
// === 结尾视频由 ending_motion_v6.js 独立管理 ===
const reduce_v3=matchMedia('(prefers-reduced-motion: reduce)');
// === 首屏细水波：仅局部响应，离开首屏和暂停时清理 ===
const rippleHost_v3=document.createElement('div');rippleHost_v3.className='ripple-host';rippleHost_v3.setAttribute('aria-hidden','true');document.querySelector('#home').append(rippleHost_v3);let rippleLast_v3=0;
function ripple_v3(event_v3,clicked_v3=false){if(reduce_v3.matches||document.body.classList.contains('motion-static')||scrollY>2||event_v3.target.closest('a,button')||(!clicked_v3&&event_v3.pointerType==='touch'))return;const now_v3=performance.now();if(!clicked_v3&&now_v3-rippleLast_v3<180)return;rippleLast_v3=now_v3;const ring_v3=document.createElement('i'),bounds_v3=rippleHost_v3.getBoundingClientRect();ring_v3.className=clicked_v3?'clicked':'';ring_v3.style.left=(event_v3.clientX-bounds_v3.left)+'px';ring_v3.style.top=(event_v3.clientY-bounds_v3.top)+'px';if(rippleHost_v3.childElementCount>=8)rippleHost_v3.firstChild.remove();rippleHost_v3.append(ring_v3);ring_v3.addEventListener('animationend',()=>ring_v3.remove(),{once:true})}
document.querySelector('#home').addEventListener('pointermove',event_v3=>ripple_v3(event_v3));document.querySelector('#home').addEventListener('click',event_v3=>ripple_v3(event_v3,true));
function clearRipples_v3(){rippleHost_v3.replaceChildren()}
window.addEventListener('scroll',clearRipples_v3,{passive:true});reduce_v3.addEventListener('change',clearRipples_v3);document.querySelector('#motion').addEventListener('click',clearRipples_v3);

// === Escape 按图片、故事、目录的顺序返回 ===
document.addEventListener('keydown',event_v8=>{if(event_v8.key!=='Escape'||imageDialog_v3.open)return;if(!document.querySelector('#case').hidden){event_v8.preventDefault();closeCase_v5()}else if(!folder_v3.hidden){event_v8.preventDefault();document.querySelector('#close-folder').click()}});
