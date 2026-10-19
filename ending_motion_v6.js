/* === 独立结尾时间轴：正反滚动、按需加载和静态回退 === */
(()=>{'use strict';
const section_v6=document.getElementById('ending'),stage_v6=section_v6.querySelector('.ending-stage'),video_v6=document.getElementById('ending-video-v6'),start_v6=document.getElementById('ending-start-v6'),hold_v6=document.getElementById('ending-hold-v6'),reduce_v6=matchMedia('(prefers-reduced-motion: reduce)');
let scheduled_v6=false,loaded_v6=false,decoded_v6=false,failed_v6=false,target_v6=0;
const clamp_v6=value_v6=>Math.min(1,Math.max(0,value_v6));
function staticMode_v6(){return reduce_v6.matches||document.body.classList.contains('motion-static')}
function load_v6(){if(loaded_v6||failed_v6||staticMode_v6())return;loaded_v6=true;video_v6.src=video_v6.dataset.src;video_v6.preload='auto';video_v6.load()}
function seek_v6(){if(staticMode_v6()||failed_v6||video_v6.readyState<1||video_v6.seeking)return;if(Math.abs(video_v6.currentTime-target_v6)>1/48)video_v6.currentTime=target_v6}
function sync_v6(){
 scheduled_v6=false;
 const rect_v6=section_v6.getBoundingClientRect(),isStatic_v6=staticMode_v6(),span_v6=Math.max(1,section_v6.offsetHeight-stage_v6.offsetHeight),progress_v6=clamp_v6(-rect_v6.top/span_v6),clipProgress_v6=clamp_v6((progress_v6-.07)/.81);
 section_v6.dataset.progress=progress_v6.toFixed(4);section_v6.dataset.mode=isStatic_v6?'static':'scroll';
 if(rect_v6.top<innerHeight*2&&rect_v6.bottom>-innerHeight)load_v6();
 const last_v6=Number.isFinite(video_v6.duration)?Math.max(0,video_v6.duration-1/24):5-1/24;
 target_v6=clipProgress_v6*last_v6;video_v6.dataset.requestedTime=target_v6.toFixed(4);
 const final_v6=isStatic_v6||clipProgress_v6>=.5;
 start_v6.style.opacity=final_v6?'0':'1';hold_v6.style.opacity=final_v6?'1':'0';
 if(!isStatic_v6)seek_v6();
 const show_v6=!isStatic_v6&&decoded_v6&&!failed_v6&&clipProgress_v6>0&&clipProgress_v6<1;
 video_v6.style.opacity=show_v6?'1':'0';section_v6.dataset.renderer=isStatic_v6?'static-hold':failed_v6?'poster-fallback':show_v6?'ai-video':'static-hold';
}
function schedule_v6(){if(!scheduled_v6){scheduled_v6=true;requestAnimationFrame(sync_v6)}}
video_v6.muted=true;video_v6.pause();
video_v6.addEventListener('loadedmetadata',schedule_v6);
video_v6.addEventListener('loadeddata',()=>{decoded_v6=true;schedule_v6()});
video_v6.addEventListener('seeked',()=>{decoded_v6=true;video_v6.dataset.decodedTime=video_v6.currentTime.toFixed(4);seek_v6();schedule_v6()});
video_v6.addEventListener('error',()=>{failed_v6=true;section_v6.dataset.failed='1';schedule_v6()});
window.addEventListener('scroll',schedule_v6,{passive:true});window.addEventListener('resize',schedule_v6);window.addEventListener('pageshow',schedule_v6);window.addEventListener('hashchange',schedule_v6);window.addEventListener('portfolio-language-changed',schedule_v6);window.addEventListener('portfolio-content-ready',schedule_v6);
reduce_v6.addEventListener('change',schedule_v6);new MutationObserver(schedule_v6).observe(document.body,{attributes:true,attributeFilter:['class']});new ResizeObserver(schedule_v6).observe(stage_v6);
new IntersectionObserver(entries_v6=>{if(entries_v6.some(entry_v6=>entry_v6.isIntersecting)){load_v6();schedule_v6()}},{rootMargin:'100% 0px'}).observe(section_v6);
schedule_v6();
})();
