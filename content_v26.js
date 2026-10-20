'use strict';
// === 内容：沿用已核实的履历与案例，接入本人照片参考生成的卡通人物 ===
const get_v5=selector_v5=>document.querySelector(selector_v5);
const escape_v5=text_v5=>String(text_v5??'').replace(/[&<>"']/g,char_v5=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char_v5]));
let content_v5=null;let selected_v5=0;let previousFocus_v5=null;let drag_v5=null;let suppress_v5=false;let scrollTick_v5=null;
let activeCase_v2=0;let locales_v4=null;
const reduced_v5=matchMedia('(prefers-reduced-motion:reduce)');
function diagram_v5(project_v5){const steps_v5=project_v5.steps||t_v4('defaultSteps');return '<div class="diagram">'+steps_v5.map(step_v5=>'<span><b>'+escape_v5(step_v5[0])+'</b><small>'+escape_v5(step_v5[1])+'</small></span>').join('')+'</div>';}
function visual_v5(project_v5,mockup_v5=false){if(!project_v5.image)return diagram_v5(project_v5);const image_v5='<img src="'+escape_v5(project_v5.image)+'" alt="'+escape_v5(project_v5.imageAlt||project_v5.title)+'">';if(project_v5.referenceMaterial)return '<div class="public-reference-visual">'+image_v5+'<span class="reference-label">'+escape_v5(project_v5.referenceLabel)+'</span></div>';return mockup_v5?'<div class="product-mockup"><div class="mockup-bar"><i></i><i></i><i></i></div>'+image_v5+'</div>':image_v5;}
function render_v5(){
 get_v5('#summary').textContent=content_v5.summary;document.querySelectorAll('[data-resume-link]').forEach(link_v1=>link_v1.href=content_v5.resume);get_v5('#email').href='mailto:'+content_v5.email;get_v5('#email').innerHTML=escape_v5(content_v5.email)+' <span>↗</span>';
 get_v5('#timeline').innerHTML=content_v5.experience.map(item_v5=>'<article class="timeline-item">'+(item_v5.date?'<span class="date">'+escape_v5(item_v5.date)+'</span>':'')+'<h3>'+escape_v5(item_v5.company)+'</h3><span class="role">'+escape_v5(item_v5.role)+'</span><p>'+escape_v5(item_v5.text)+'</p></article>').join('');
 get_v5('#education').innerHTML='<div class="eyebrow" style="margin-bottom:18px">'+t_v4("education")+'</div>'+content_v5.education.map(item_v5=>'<div class="edu-item"><strong>'+escape_v5(item_v5.school)+'</strong><span>'+escape_v5(item_v5.degree)+' / '+escape_v5(item_v5.year)+'</span></div>').join('');
 get_v5('#skills').innerHTML=content_v5.skills.map(skill_v5=>'<span>'+escape_v5(skill_v5)+'</span>').join('');
 renderDirectory_v17();
 renderContact_v2();
}
// === 补充资料填入后自动展示；空项不留占位 ===
function renderContact_v2(){
 const links_v2=[['LinkedIn',content_v5.linkedin],['GitHub',content_v5.github]].filter(row_v2=>/^https:\/\//.test(row_v2[1]||''));
 get_v5('#social-links').hidden=links_v2.length===0;
 get_v5('#social-links').innerHTML=links_v2.map(row_v2=>'<a href="'+escape_v5(row_v2[1])+'" target="_blank" rel="noopener">'+row_v2[0]+' ↗</a>').join('');
 get_v5('#service-scope').hidden=!content_v5.serviceScope?.trim();get_v5('#service-scope p').textContent=content_v5.serviceScope||'';
}
function select_v5(index_v5){selected_v5=Math.min(Math.max(index_v5,0),content_v5.projects.length-1);}
let returnCard_v17=null;
function directoryTop_v17(){return (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-v7'))||75)+(innerWidth<=1100?document.querySelector('.scene-stage').offsetHeight:0)+24;}
function restoreDirectory_v17(){
 openDirectory_v17(false,false);
 const id_v17=returnCard_v17?.id||content_v5.projects[activeCase_v2]?.id;
 const card_v17=[...document.querySelectorAll('[data-project-id]')].find(el_v17=>el_v17.dataset.projectId===id_v17);
 if(card_v17){const top_v17=Math.max(directoryTop_v17(),returnCard_v17?.top??0);scrollBy({top:card_v17.getBoundingClientRect().top-top_v17,behavior:'instant'});card_v17.focus({preventScroll:true});}else document.querySelector('#work').scrollIntoView({behavior:'instant'});
}
function openCase_v5(index_v5,write_v5=true){const project_v5=content_v5.projects[index_v5];if(!project_v5)return;if(get_v5('#case').hidden){previousFocus_v5=document.activeElement;const card_v17=document.querySelector('[data-case="'+index_v5+'"]');returnCard_v17=card_v17&&!get_v5('#folder-dialog').hidden?{id:project_v5.id,top:card_v17.getBoundingClientRect().top}:null;}activeCase_v2=index_v5;get_v5('#case-title').textContent=project_v5.title;get_v5('#case-category').textContent=project_v5.category;get_v5('#case-number').textContent=String(index_v5+1).padStart(2,'0')+' / '+t_v4('story');get_v5('#case-subtitle').textContent=project_v5.subtitle+' — '+project_v5.intro;get_v5('#case-visual').innerHTML=visual_v5(project_v5);get_v5('#case-ownership').textContent=project_v5.ownership+' / '+project_v5.galleryCaption;get_v5('#case-sections').innerHTML=[[t_v4('background'),project_v5.background],[t_v4('goal'),project_v5.goal],[t_v4('process'),project_v5.process],[t_v4('result'),project_v5.result]].map(row_v5=>'<section class="case-row"><h2>'+row_v5[0]+'</h2><p>'+escape_v5(row_v5[1])+'</p></section>').join('');get_v5('#case-metrics').textContent=project_v5.metrics;get_v5('.metrics').hidden=!project_v5.metrics?.trim();get_v5('#case-tags').innerHTML=project_v5.tags.map(tag_v2=>'<span>'+escape_v5(tag_v2)+'</span>').join('');get_v5('#case-count').textContent=String(index_v5+1).padStart(2,'0')+' / '+String(content_v5.projects.length).padStart(2,'0');get_v5('#case-prev').disabled=index_v5===0;get_v5('#case-next').disabled=index_v5===content_v5.projects.length-1;const link_v5=get_v5('#case-visit');link_v5.hidden=!project_v5.url;if(project_v5.url)link_v5.href=project_v5.url;const dialog_v5=get_v5('#case');const wasHidden_v8=dialog_v5.hidden;dialog_v5.hidden=false;get_v5('#folder-dialog').hidden=true;get_v5('#open-folder').setAttribute('aria-expanded','false');if(write_v5||wasHidden_v8){get_v5('#work').scrollIntoView({behavior:'instant'});dialog_v5.focus({preventScroll:true})}renderGallery_v3(project_v5);if(write_v5)history.pushState(null,'','#case/'+project_v5.id);}
function closeCase_v5(write_v5=true){
 // 返回主页面时恢复默认展开的作品列表。
 openDirectory_v17(false,false);
 if(write_v5){history.replaceState(null,'','#work');restoreDirectory_v17();}
 else if(location.hash==='#work')requestAnimationFrame(restoreDirectory_v17);
 else if(/^#(home|about|work-intro|approach|ending|contact)$/.test(location.hash)){requestAnimationFrame(()=>{const target_v17=get_v5(location.hash);if(target_v17)window.portfolioScroll_v7.navigate(target_v17)});}
}
function route_v5(){if(!content_v5)return;const match_v5=location.hash.match(/^#case\/(.+)$/);if(match_v5){const index_v5=content_v5.projects.findIndex(project_v5=>project_v5.id===match_v5[1]);if(index_v5>=0)openCase_v5(index_v5,false);else{if(!get_v5('#case').hidden)closeCase_v5(false);history.replaceState(null,'','#work');get_v5('#work').scrollIntoView({behavior:'instant'});}}else if(!get_v5('#case').hidden)closeCase_v5(false);else if(location.hash==='#work')openDirectory_v17(false,false);}
function bind_v5(){
 get_v5('#project-list-v17').addEventListener('click',event_v17=>{const card_v17=event_v17.target.closest('[data-case]');if(card_v17)openCase_v5(Number(card_v17.dataset.case));});
 get_v5('#case-prev').addEventListener('click',()=>openCase_v5(activeCase_v2-1));get_v5('#case-next').addEventListener('click',()=>openCase_v5(activeCase_v2+1));
 get_v5('#close-case').addEventListener('click',()=>closeCase_v5());get_v5('#case').addEventListener('cancel',event_v5=>{event_v5.preventDefault();closeCase_v5();});window.addEventListener('popstate',route_v5);window.addEventListener('hashchange',route_v5);
}
// === 语言切换保留案例、图片缩放、主页面阅读位置 ===
function useLocale_v4(){content_v5=locales_v4[language_v4];content_v5={...content_v5,projects:content_v5.projects.filter(project_v4=>project_v4.status==='published').sort((left_v4,right_v4)=>left_v4.sortOrder-right_v4.sortOrder)}}
async function changeLanguage_v4(){
 if(!locales_v4)return;
 const sceneCheckpoint_v7=window.portfolioScroll_v7?.capture();
 const caseOpen_v4=!get_v5('#case').hidden,caseScroll_v4=get_v5('#case').scrollTop,caseId_v4=caseOpen_v4?content_v5.projects[activeCase_v2].id:null,selectedId_v4=content_v5.projects[selected_v5]?.id;
 const readingSelectors_v8='.case-bar,#case-title,#case-subtitle,#case-visual,#case-tags,#case-period,#case-gallery figure,.case-row,.case-source,.case-navigation';
 const readingLine_v8=(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-v7'))||0)+(innerWidth<=1100?document.querySelector('.scene-stage').offsetHeight+18:20);
 const readingBlocks_v8=[...get_v5('#case').querySelectorAll(readingSelectors_v8)];
 const readingIndex_v8=caseOpen_v4?readingBlocks_v8.findIndex(el_v8=>el_v8.getBoundingClientRect().bottom>readingLine_v8):-1;
 const readingTop_v8=readingIndex_v8>=0?readingBlocks_v8[readingIndex_v8].getBoundingClientRect().top:0;
 const imageOpen_v4=get_v5('#image-dialog').open,imageSrc_v4=get_v5('#image-full').getAttribute('src'),imageScroll_v4=[get_v5('#image-scroll').scrollLeft,get_v5('#image-scroll').scrollTop];
 const section_v4=[...document.querySelectorAll('#home,#about,#work-intro,#work,#approach,#ending,#contact')].filter(element_v4=>element_v4.getBoundingClientRect().top<=80).at(-1)||get_v5('#home');
 const fraction_v4=(scrollY-section_v4.offsetTop)/Math.max(1,section_v4.offsetHeight);
 language_v4=language_v4==='en'?'zh':'en';try{localStorage.setItem('portfolio-language-v23',language_v4)}catch{}
 translateStatic_v4();useLocale_v4();render_v5();
 window.dispatchEvent(new Event('portfolio-content-ready'));window.dispatchEvent(new Event('portfolio-language-changed'));
 const selection_v4=content_v5.projects.findIndex(project_v4=>project_v4.id===selectedId_v4);select_v5(Math.max(0,selection_v4));
 if(caseOpen_v4){openCase_v5(content_v5.projects.findIndex(project_v4=>project_v4.id===caseId_v4),false);get_v5('#case').scrollTop=caseScroll_v4}
 if(imageOpen_v4){const media_v4=content_v5.projects[activeCase_v2].gallery.find(item_v4=>item_v4.src===imageSrc_v4);if(media_v4){get_v5('#image-title').textContent=media_v4.caption||media_v4.alt;get_v5('#image-full').alt=media_v4.alt}get_v5('#image-scroll').scrollTo(...imageScroll_v4);imageFocus_v3=get_v5('.gallery-open')}
 if(sceneCheckpoint_v7)window.portfolioScroll_v7.restore(sceneCheckpoint_v7);else window.scrollTo({top:section_v4.offsetTop+fraction_v4*section_v4.offsetHeight,behavior:'instant'});
 if(caseOpen_v4&&readingIndex_v8>=0){const newBlock_v8=get_v5('#case').querySelectorAll(readingSelectors_v8)[readingIndex_v8];if(newBlock_v8)scrollBy({top:newBlock_v8.getBoundingClientRect().top-readingTop_v8,behavior:'instant'})}

}
async function initialize_v5(){try{
 const responses_v4=await Promise.all(['zh','en'].map(async lang_v4=>{const response_v4=await fetch('content_'+lang_v4+'_v26.json');if(!response_v4.ok)throw Error('Content request failed');const data_v4=await response_v4.json();validateContent_v3(data_v4);return data_v4}));
 locales_v4=await window.portfolioCms_v1.load({zh:responses_v4[0],en:responses_v4[1]});
 translateStatic_v4();
 if(JSON.stringify(locales_v4.zh.projects.map(project_v4=>project_v4.id))!==JSON.stringify(locales_v4.en.projects.map(project_v4=>project_v4.id)))throw Error('Locale project IDs differ');
 useLocale_v4();render_v5();bind_v5();openDirectory_v17(false,false);route_v5();window.dispatchEvent(new Event('portfolio-content-ready'));
 document.querySelectorAll('.language-toggle').forEach(button_v4=>{button_v4.disabled=false;button_v4.addEventListener('click',changeLanguage_v4)});
 }catch(error_v4){get_v5('#error').hidden=false;console.error('Portfolio content failed',error_v4)}}
initialize_v5();
