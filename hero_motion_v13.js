/* === 追视：方向防抖与短时缓动；沿用原动作轨迹 === */
(()=>{'use strict';
const home_v13=document.querySelector('#home'),area_v13=document.querySelector('#gaze-area'),video_v13=document.querySelector('#portrait'),hint_v13=document.querySelector('#hint'),media_v13=document.querySelector('#scene-media');
const reduce_v13=matchMedia('(prefers-reduced-motion: reduce)'),poses_v13={right:2,up:4,left:5.25,down:6.75};
let enabled_v13=true,paused_v13=false,ready_v13=video_v13.readyState>=2,returning_v13=false,target_v13=0,raf_v13=0,last_v13=0,motionFrom_v13=0,motionStart_v13=0,motionDuration_v13=.5,opacity_v13=0,desiredOpacity_v13=0,centerTimer_v13=0,leaveTimer_v13=0,direction_v13=null,pendingDirection_v13=null,pendingSince_v13=0;
const clamp_v13=(value_v13,min_v13,max_v13)=>Math.max(min_v13,Math.min(max_v13,value_v13));
function canTrack_v13(){return enabled_v13&&ready_v13&&!returning_v13&&!paused_v13&&!reduce_v13.matches&&scrollY<2}
function expression_v13(){video_v13.style.opacity=enabled_v13?String(opacity_v13):'0';home_v13.dataset.expression=opacity_v13<.005||!enabled_v13?'closed-mouth-smile':'source-motion';home_v13.dataset.mediaTime=video_v13.currentTime.toFixed(4);home_v13.dataset.gazeTarget=target_v13.toFixed(4);home_v13.dataset.gazeDirection=direction_v13||'front';home_v13.dataset.gazeOpacity=opacity_v13.toFixed(4)}
function wake_v13(){if(!raf_v13){last_v13=performance.now();raf_v13=requestAnimationFrame(tick_v13)}}
function tick_v13(now_v13){
 raf_v13=0;if(document.hidden)return;const dt_v13=clamp_v13((now_v13-last_v13)/1000,.008,.04);last_v13=now_v13;
 const opacityStep_v13=dt_v13/.20;opacity_v13+=clamp_v13(desiredOpacity_v13-opacity_v13,-opacityStep_v13,opacityStep_v13);
 if(opacity_v13<.005&&desiredOpacity_v13===0){opacity_v13=0;if(!video_v13.seeking&&video_v13.currentTime!==0)video_v13.currentTime=0;expression_v13();return}
 if(ready_v13&&!video_v13.seeking&&desiredOpacity_v13>0){
  // 按实际时间完成转向，不再逐帧限速；解码等待不会层层累积成慢动作。
  const progress_v13=clamp_v13((now_v13-motionStart_v13)/(motionDuration_v13*1000),0,1);
  const eased_v13=progress_v13*progress_v13*(3-2*progress_v13);
  const next_v13=motionFrom_v13+(target_v13-motionFrom_v13)*eased_v13;
  if(Math.abs(target_v13-video_v13.currentTime)>1/120)video_v13.currentTime=clamp_v13(next_v13,0,video_v13.duration-.05);
 }
 expression_v13();
 if(Math.abs(opacity_v13-desiredOpacity_v13)>.001||(desiredOpacity_v13>0&&Math.abs(target_v13-video_v13.currentTime)>1/120))raf_v13=requestAnimationFrame(tick_v13);
}
function neutral_v13(immediate_v13=false){clearTimeout(centerTimer_v13);clearTimeout(leaveTimer_v13);centerTimer_v13=0;direction_v13=null;pendingDirection_v13=null;target_v13=0;desiredOpacity_v13=0;if(immediate_v13){opacity_v13=0;cancelAnimationFrame(raf_v13);raf_v13=0;if(ready_v13)video_v13.currentTime=0;expression_v13()}else wake_v13()}
function aim_v13(directionNext_v13){if(!poses_v13[directionNext_v13]){neutral_v13();return}clearTimeout(centerTimer_v13);clearTimeout(leaveTimer_v13);pendingDirection_v13=null;centerTimer_v13=0;direction_v13=directionNext_v13;target_v13=poses_v13[directionNext_v13];motionFrom_v13=video_v13.currentTime;motionStart_v13=performance.now();motionDuration_v13=clamp_v13(.34+Math.abs(target_v13-motionFrom_v13)*.065,.38,.78);desiredOpacity_v13=1;wake_v13();expression_v13()}
function pointer_v13(event_v13){
 clearTimeout(leaveTimer_v13);if(!canTrack_v13()||event_v13.pointerType==='touch'||event_v13.target.closest('button,a'))return;
 // 以 contain 后的真实画幅与眼睛附近为原点；文字区域也能平稳追视。
 const rect_v13=media_v13.getBoundingClientRect(),width_v13=Math.min(rect_v13.width,rect_v13.height*16/9),height_v13=width_v13*9/16;
 const x_v13=(event_v13.clientX-(rect_v13.left+(rect_v13.width-width_v13)/2+width_v13*.5))/(width_v13*.5),y_v13=(event_v13.clientY-(rect_v13.top+(rect_v13.height-height_v13)/2+height_v13*.43))/(height_v13*.5);
 const magnitude_v13=Math.hypot(x_v13,y_v13);
 if(magnitude_v13<.18){if(!centerTimer_v13)centerTimer_v13=setTimeout(()=>{centerTimer_v13=0;if(canTrack_v13())neutral_v13()},260);return}
 clearTimeout(centerTimer_v13);centerTimer_v13=0;
 // 四个已存在的方向状态；斜向边界采用滞回，防止来回抖动。
 const scores_v13={right:x_v13,left:-x_v13,up:-y_v13,down:y_v13};
 const next_v13=Object.keys(scores_v13).reduce((a_v13,b_v13)=>scores_v13[a_v13]>scores_v13[b_v13]?a_v13:b_v13);
 if(direction_v13&&next_v13!==direction_v13&&scores_v13[next_v13]<scores_v13[direction_v13]+.16)return;
 if(next_v13===direction_v13){pendingDirection_v13=null;return}
 const now_v13=performance.now();if(pendingDirection_v13!==next_v13){pendingDirection_v13=next_v13;pendingSince_v13=now_v13}
 if(now_v13-pendingSince_v13>=50){aim_v13(next_v13);pendingDirection_v13=null}else{
  clearTimeout(leaveTimer_v13);leaveTimer_v13=setTimeout(()=>{if(canTrack_v13()&&pendingDirection_v13===next_v13){aim_v13(next_v13);pendingDirection_v13=null}},55);
 }
}
async function front_v13(){returning_v13=true;hint_v13.textContent=t_v4('returning');neutral_v13();const started_v13=performance.now();while(opacity_v13>.005&&performance.now()-started_v13<450)await new Promise(resolve_v13=>setTimeout(resolve_v13,16));neutral_v13(true);returning_v13=false;hint_v13.textContent=paused_v13||reduce_v13.matches?t_v4('static'):t_v4('track')}
home_v13.addEventListener('pointermove',pointer_v13);
home_v13.addEventListener('pointerleave',()=>{pendingDirection_v13=null;clearTimeout(centerTimer_v13);centerTimer_v13=0;clearTimeout(leaveTimer_v13);leaveTimer_v13=setTimeout(()=>neutral_v13(),350)});
window.addEventListener('blur',()=>neutral_v13());
document.querySelectorAll('[data-pose]').forEach(button_v13=>button_v13.addEventListener('click',()=>{if(canTrack_v13())aim_v13(button_v13.dataset.pose)}));
area_v13.addEventListener('keydown',event_v13=>{const key_v13={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',Escape:'front'}[event_v13.key];if(key_v13){event_v13.preventDefault();if(canTrack_v13())aim_v13(key_v13)}});
video_v13.addEventListener('seeked',()=>{expression_v13();if(opacity_v13>0||desiredOpacity_v13>0)wake_v13()});video_v13.addEventListener('loadeddata',()=>{ready_v13=true;video_v13.pause();neutral_v13(true)});video_v13.addEventListener('error',()=>{ready_v13=false;neutral_v13(true);hint_v13.textContent=t_v4('fallback')});
document.addEventListener('visibilitychange',()=>{if(document.hidden)neutral_v13(true)});
window.heroMotion_v1={returnFront:front_v13,isNeutral:()=>opacity_v13<.005,setEnabled:value_v13=>{if(enabled_v13===value_v13)return;enabled_v13=value_v13;area_v13.tabIndex=value_v13?0:-1;if(!value_v13)neutral_v13(true);expression_v13()},setPaused:value_v13=>{if(paused_v13===value_v13)return;paused_v13=value_v13;neutral_v13(true);hint_v13.textContent=value_v13||reduce_v13.matches?t_v4('static'):t_v4('track')}};
window.addEventListener('portfolio-language-changed',()=>{hint_v13.textContent=paused_v13||reduce_v13.matches?t_v4('static'):ready_v13?t_v4('track'):t_v4('fallback')});expression_v13();
})();
