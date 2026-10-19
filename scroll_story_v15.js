/* === 阅读与表演分段：自然滚动，不锁滚轮、不拉回页面 === */
(()=>{'use strict';
const story_v7=document.getElementById('story'),home_v7=document.getElementById('home'),about_v7=document.getElementById('about'),work_v7=document.getElementById('work-intro'),gap_v7=document.getElementById('work-gap'),stage_v7=document.querySelector('.scene-stage'),motion_v7=document.getElementById('motion');
const images_v7=['scene-hero','scene-intro','scene-sofa'].map(id_v7=>document.getElementById(id_v7)),clips_v7=['transition-intro-v5','transition-sofa-v5'].map(id_v7=>document.getElementById(id_v7));
const reduce_v7=matchMedia('(prefers-reduced-motion: reduce)'),narrow_v7=matchMedia('(max-width:1100px)'),initialHash_v7=location.hash;
let paused_v7=false,queued_v7=false,gate_v7=false,previousY_v7=scrollY,navToken_v7=0,layout_v7={};
let checkpoint_v7=null;
const clamp_v7=x_v7=>Math.min(1,Math.max(0,x_v7));
const ease_v7=x_v7=>{const p_v7=clamp_v7(x_v7);return p_v7*p_v7*(3-2*p_v7)};
const scrubs_v7=clips_v7.map(clip_v7=>window.createScrubber_v7(clip_v7,schedule_v7));
const caption_v7=document.createElement('div');caption_v7.className='transition-caption-v7';caption_v7.setAttribute('aria-hidden','true');caption_v7.innerHTML='<span class="eyebrow"></span><h2></h2><div class="chapter-line-v7"><i></i></div>';stage_v7.append(caption_v7);let captionIndex_v7=0;
function captionText_v7(index_v7){captionIndex_v7=index_v7;caption_v7.querySelector('.eyebrow').textContent=(index_v7?'02 / ':'01 / ')+document.querySelector(index_v7?'header a[href="#work-intro"]':'header a[href="#about"]').textContent;caption_v7.querySelector('h2').innerHTML=document.getElementById(index_v7?'work-intro-title':'about-title').innerHTML}
function measure_v7(){layout_v7={firstStart:home_v7.offsetHeight*.65,firstEnd:home_v7.offsetHeight*.65+innerHeight*2.2,secondStart:gap_v7.offsetTop-innerHeight*.15,secondEnd:gap_v7.offsetTop+innerHeight*2.05};const column_v9=work_v7.querySelector('.story-column'),top_v9=parseFloat(getComputedStyle(column_v9).top)||0;work_v7.style.setProperty('--work-hold-v9',Math.ceil(layout_v7.secondEnd-work_v7.offsetTop+top_v9+column_v9.offsetHeight+24)+'px');story_v7.dataset.timeline=JSON.stringify(layout_v7);schedule_v7()}
// 保存语义位置，避免语言行数或静态模式高度变化把用户送往其他章节。
function capture_v7(){
 const y_v7=scrollY,ending_v7=document.getElementById('ending'),static_v7=document.body.classList.contains('motion-static');
 if(!static_v7){for(const [index_v7,start_v7,end_v7] of [[0,layout_v7.firstStart,layout_v7.firstEnd],[1,layout_v7.secondStart,layout_v7.secondEnd]])if(y_v7>start_v7&&y_v7<end_v7)return{kind:'transition',index:index_v7,progress:(y_v7-start_v7)/(end_v7-start_v7)};}
 if(y_v7>=ending_v7.offsetTop&&y_v7<ending_v7.offsetTop+ending_v7.offsetHeight)return{kind:'ending',progress:clamp_v7((y_v7-ending_v7.offsetTop)/Math.max(1,ending_v7.offsetHeight-ending_v7.querySelector('.ending-stage').offsetHeight))};
 const nav_v7=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-v7'))||0;
 const section_v7=[...document.querySelectorAll('#home,#about,#work-intro,#work,#approach,#contact')].filter(el_v7=>el_v7.offsetTop<=y_v7+nav_v7+1).at(-1)||home_v7;
 return{kind:'reading',id:section_v7.id,completedWork:section_v7.id==='work-intro'&&y_v7>=layout_v7.secondEnd,fraction:(y_v7+nav_v7-section_v7.offsetTop)/Math.max(1,section_v7.offsetHeight)};
}
function restore_v7(state_v7){
 if(!state_v7)return;measure_v7();const static_v7=document.body.classList.contains('motion-static');
 if(state_v7.kind==='transition'){if(static_v7){[about_v7,work_v7][state_v7.index].scrollIntoView({behavior:'instant'})}else{const a_v7=state_v7.index?layout_v7.secondStart:layout_v7.firstStart,b_v7=state_v7.index?layout_v7.secondEnd:layout_v7.firstEnd;scrollTo({top:a_v7+state_v7.progress*(b_v7-a_v7),behavior:'instant'})}}
 else if(state_v7.kind==='ending'){const el_v7=document.getElementById('ending');scrollTo({top:el_v7.offsetTop+(static_v7?0:state_v7.progress*Math.max(0,el_v7.offsetHeight-el_v7.querySelector('.ending-stage').offsetHeight)),behavior:'instant'})}
 else{const el_v7=document.getElementById(state_v7.id),nav_v7=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-v7'))||0;scrollTo({top:Math.max(state_v7.completedWork&&!static_v7?Math.ceil(layout_v7.secondEnd)+1:0,el_v7.offsetTop+state_v7.fraction*el_v7.offsetHeight-nav_v7),behavior:'instant'})}
 schedule_v7();
}
function navigate_v9(target_v9){
 measure_v7();if(target_v9.id==='work-intro'&&!document.body.classList.contains('motion-static')){scrollTo({top:Math.ceil(layout_v7.secondEnd)+1,behavior:'instant'})}
 else if(target_v9.id==='about'&&!document.body.classList.contains('motion-static')){scrollTo({top:Math.max(0,target_v9.offsetTop-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-v7'))||0)),behavior:'instant'});}
 else target_v9.scrollIntoView({behavior:'instant',block:'start'});schedule_v7();
}
window.portfolioScroll_v7={capture:capture_v7,restore:restore_v7,navigate:navigate_v9};
function protectMedia_v7(){
 const mediaBottom_v7=stage_v7.getBoundingClientRect().bottom;
 for(const section_v7 of [home_v7,about_v7,work_v7,document.getElementById('work')]){
  const rect_v7=section_v7.getBoundingClientRect();
  section_v7.style.clipPath=narrow_v7.matches?'inset('+Math.max(0,Math.min(rect_v7.height,mediaBottom_v7+18-rect_v7.top))+'px 0 0 0)':'';
 }
}
function frame_v7(index_v7,progress_v7){
 const scrub_v7=scrubs_v7[index_v7];scrub_v7.setProgress(progress_v7);
 images_v7[index_v7+(progress_v7<.5?0:1)].style.opacity='1';
 const blend_v7=Math.min(ease_v7(progress_v7/.025),ease_v7((1-progress_v7)/.025));
 clips_v7[index_v7].style.opacity=scrub_v7.ready?String(blend_v7):'0';
 story_v7.dataset.renderer=scrub_v7.ready?'ai-video':'poster-fallback';story_v7.dataset.time=(index_v7*5+progress_v7*5).toFixed(4);
}
function sync_v7(){
 queued_v7=false;const y_v7=scrollY,static_v7=paused_v7||reduce_v7.matches;
 images_v7.forEach(img_v7=>img_v7.style.opacity='0');clips_v7.forEach(video_v7=>video_v7.style.opacity='0');story_v7.dataset.renderer='static-hold';
 const first_v7=clamp_v7((y_v7-layout_v7.firstStart)/Math.max(1,layout_v7.firstEnd-layout_v7.firstStart)),second_v7=clamp_v7((y_v7-layout_v7.secondStart)/Math.max(1,layout_v7.secondEnd-layout_v7.secondStart));
 let phase_v7='hero';
 window.heroMotion_v1.setEnabled((y_v7<2||gate_v7)&&!static_v7);
 scrubs_v7.forEach(scrub_v7=>scrub_v7.setEnabled(!static_v7&&!gate_v7));
 if(static_v7){const index_v7=y_v7>=work_v7.offsetTop-innerHeight*.5?2:y_v7>=about_v7.offsetTop-innerHeight*.5?1:0;images_v7[index_v7].style.opacity='1';phase_v7=['hero','about','work'][index_v7];story_v7.dataset.time=String(index_v7*5)}
 else if(gate_v7||y_v7<=layout_v7.firstStart){images_v7[0].style.opacity='1';story_v7.dataset.time='0'}
 else if(first_v7<1){phase_v7='to-about';frame_v7(0,first_v7)}
 else if(y_v7<=layout_v7.secondStart){phase_v7='about';images_v7[1].style.opacity='1';story_v7.dataset.time='5'}
 else if(second_v7<1){phase_v7='to-work';frame_v7(1,second_v7)}
 else{phase_v7='work';images_v7[2].style.opacity='1';story_v7.dataset.time='10'}
 about_v7.style.opacity=static_v7?'1':String(ease_v7((first_v7-.04)/.14));work_v7.style.opacity=static_v7?'1':String(ease_v7((second_v7-.03)/.14));
 story_v7.dataset.phase=gate_v7?'returning':phase_v7;story_v7.dataset.mode=static_v7?'static':'scroll';
 const moving_v7=false,captionProgress_v7=phase_v7==='to-work'?second_v7:first_v7;
 captionText_v7(phase_v7==='to-work'?1:0);caption_v7.style.opacity=moving_v7?String(Math.min(ease_v7(captionProgress_v7/.15),ease_v7((1-captionProgress_v7)/.12))):'0';caption_v7.querySelector('i').style.transform='scaleX('+captionProgress_v7+')';
 home_v7.querySelectorAll('.hero-copy,.story-aside,.story-home-bottom,.pose-buttons').forEach(el_v7=>el_v7.style.opacity=String(1-ease_v7(y_v7/(home_v7.offsetHeight*.58))));
 protectMedia_v7();previousY_v7=y_v7;checkpoint_v7=capture_v7();
}
function schedule_v7(){if(!queued_v7){queued_v7=true;requestAnimationFrame(sync_v7)}}
async function returnWhileScrolling_v7(){gate_v7=true;await window.heroMotion_v1.returnFront();gate_v7=false;schedule_v7()}
window.addEventListener('scroll',()=>{if(previousY_v7<2&&scrollY>2&&!gate_v7&&!paused_v7&&!reduce_v7.matches&&!window.heroMotion_v1.isNeutral())void returnWhileScrolling_v7();schedule_v7()},{passive:true});
// 导航是明确跳转；不穿越数十屏来快速播放全部人物动作。
document.querySelectorAll('a[href^="#"]').forEach(link_v7=>link_v7.addEventListener('click',event_v7=>{const hash_v7=link_v7.getAttribute('href'),target_v7=hash_v7&&document.getElementById(hash_v7.slice(1));if(!target_v7)return;event_v7.preventDefault();if(!document.getElementById('case').hidden)closeCase_v5(false);navToken_v7++;gate_v7=false;void window.heroMotion_v1.returnFront();history.pushState(null,'',hash_v7);navigate_v9(target_v7);if(target_v7.hasAttribute('tabindex'))target_v7.focus({preventScroll:true});schedule_v7()}));
function mode_v7(){document.body.classList.toggle('motion-static',paused_v7||reduce_v7.matches);motion_v7.disabled=reduce_v7.matches;motion_v7.textContent=reduce_v7.matches?t_v4('reduce'):paused_v7?t_v4('enable'):t_v4('pause');motion_v7.setAttribute('aria-pressed',String(paused_v7||reduce_v7.matches));window.heroMotion_v1.setPaused(paused_v7||reduce_v7.matches);measure_v7()}
motion_v7.addEventListener('click',()=>{const saved_v7=capture_v7();paused_v7=!paused_v7;mode_v7();restore_v7(saved_v7)});reduce_v7.addEventListener('change',()=>{const saved_v7=checkpoint_v7;mode_v7();restore_v7(saved_v7)});window.addEventListener('portfolio-language-changed',()=>{captionText_v7(captionIndex_v7);mode_v7()});
new ResizeObserver(measure_v7).observe(about_v7);new ResizeObserver(measure_v7).observe(work_v7.querySelector('.story-column'));window.addEventListener('resize',measure_v7);window.addEventListener('pageshow',measure_v7);window.addEventListener('hashchange',()=>{if(/^#(home|about|work-intro|work|approach|ending|contact)$/.test(location.hash))navigate_v9(document.getElementById(location.hash.slice(1)));else schedule_v7()});
// 等待浏览器原生片段定位结束，再恢复章节语义；用户已有操作时不抢回滚动。
let initialIntent_v9=false,initialReady_v9=false;
for(const event_v9 of ['wheel','touchstart','pointerdown','keydown'])window.addEventListener(event_v9,()=>{initialIntent_v9=true},{passive:true,once:true});
function settleInitial_v9(){if(!initialReady_v9||initialIntent_v9||navToken_v7!==0||location.hash!==initialHash_v7||!/^#(home|about|work-intro|work|approach|ending|contact)$/.test(initialHash_v7))return;navigate_v9(document.getElementById(initialHash_v7.slice(1)));}
window.addEventListener('portfolio-content-ready',()=>{initialReady_v9=true;measure_v7();settleInitial_v9()},{once:true});
window.addEventListener('load',()=>requestAnimationFrame(()=>requestAnimationFrame(settleInitial_v9)),{once:true});
images_v7.forEach(img_v7=>img_v7.addEventListener('load',schedule_v7));mode_v7();measure_v7();sync_v7();
})();
