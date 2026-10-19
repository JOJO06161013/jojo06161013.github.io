/* === 结尾约三屏完成动作，保留首尾停留并与正文独立 === */
(()=>{'use strict';
const section_v7=document.getElementById('ending'),stage_v7=section_v7.querySelector('.ending-stage'),video_v7=document.getElementById('ending-video-v6'),start_v7=document.getElementById('ending-start-v6'),hold_v7=document.getElementById('ending-hold-v6'),reduce_v7=matchMedia('(prefers-reduced-motion: reduce)');
let queued_v7=false,loaded_v7=false;const scrub_v7=window.createScrubber_v7(video_v7,schedule_v7),clamp_v7=x_v7=>Math.min(1,Math.max(0,x_v7));
function staticMode_v7(){return reduce_v7.matches||document.body.classList.contains('motion-static')}
function load_v7(){if(loaded_v7||staticMode_v7())return;loaded_v7=true;video_v7.src=video_v7.dataset.src;video_v7.preload='auto';video_v7.load()}
function sync_v7(){queued_v7=false;const rect_v7=section_v7.getBoundingClientRect(),static_v7=staticMode_v7(),span_v7=Math.max(1,section_v7.offsetHeight-stage_v7.offsetHeight),progress_v7=clamp_v7(-rect_v7.top/span_v7),clip_v7=clamp_v7((progress_v7-.08)/.84);
 section_v7.dataset.progress=progress_v7.toFixed(4);section_v7.dataset.mode=static_v7?'static':'scroll';section_v7.dataset.scrollSpan=String(span_v7*.84);
 if(rect_v7.top<innerHeight*2&&rect_v7.bottom>-innerHeight)load_v7();scrub_v7.setEnabled(!static_v7);if(!static_v7)scrub_v7.setProgress(clip_v7);
 const final_v7=static_v7||clip_v7>=.5;start_v7.style.opacity=final_v7?'0':'1';hold_v7.style.opacity=final_v7?'1':'0';
 const visible_v7=!static_v7&&scrub_v7.ready&&clip_v7>0&&clip_v7<1;video_v7.style.opacity=visible_v7?'1':'0';section_v7.dataset.renderer=static_v7?'static-hold':scrub_v7.failed?'poster-fallback':visible_v7?'ai-video':'static-hold';if(scrub_v7.failed)section_v7.dataset.failed='1';
}
function schedule_v7(){if(!queued_v7){queued_v7=true;requestAnimationFrame(sync_v7)}}
for(const event_v7 of ['scroll','resize','pageshow','hashchange','portfolio-language-changed','portfolio-content-ready'])window.addEventListener(event_v7,schedule_v7,{passive:true});
reduce_v7.addEventListener('change',schedule_v7);new MutationObserver(schedule_v7).observe(document.body,{attributes:true,attributeFilter:['class']});new ResizeObserver(schedule_v7).observe(stage_v7);
new IntersectionObserver(entries_v7=>{if(entries_v7.some(entry_v7=>entry_v7.isIntersecting)){load_v7();schedule_v7()}},{rootMargin:'100% 0px'}).observe(section_v7);schedule_v7();
})();
