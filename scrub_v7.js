/* === 视频跟随滚动：短缓冲消除细碎抖动，大幅跳转直接定位 === */
window.createScrubber_v7=function(video_v7,onChange_v7){
 let target_v7=0,raf_v7=0,last_v7=0,ready_v7=false,failed_v7=false,enabled_v7=true,immediate_v7=false;
 const wake_v7=()=>{if(!raf_v7&&enabled_v7&&!failed_v7){last_v7=performance.now();raf_v7=requestAnimationFrame(tick_v7)}};
 function tick_v7(now_v7){
  raf_v7=0;if(!enabled_v7||failed_v7||video_v7.readyState<1||video_v7.seeking)return;
  const delta_v7=target_v7-video_v7.currentTime,dt_v7=Math.min(.05,Math.max(.012,(now_v7-last_v7)/1000));last_v7=now_v7;
  if(Math.abs(delta_v7)<1/48)return;
  // 锚点或快速跨段不强制补播，避免停止滚动后人物仍长时间追赶。
  const snap_v7=immediate_v7||Math.abs(delta_v7)>.9||Math.abs(delta_v7)<1/24;
  const next_v7=snap_v7?target_v7:video_v7.currentTime+delta_v7*(1-Math.exp(-dt_v7/.055));
  immediate_v7=false;video_v7.currentTime=next_v7;
 }
 video_v7.muted=true;video_v7.pause();
 video_v7.addEventListener('loadeddata',()=>{ready_v7=true;wake_v7();onChange_v7()});
 video_v7.addEventListener('seeked',()=>{ready_v7=true;video_v7.dataset.decodedTime=video_v7.currentTime.toFixed(4);wake_v7();onChange_v7()});
 video_v7.addEventListener('error',()=>{failed_v7=true;onChange_v7()});
 return {
  setProgress(progress_v7,instant_v7=false){const end_v7=Number.isFinite(video_v7.duration)?Math.max(0,video_v7.duration-1/24):5;target_v7=Math.max(0,Math.min(1,progress_v7))*end_v7;video_v7.dataset.requestedTime=target_v7.toFixed(4);immediate_v7=immediate_v7||instant_v7;wake_v7()},
  setEnabled(value_v7){enabled_v7=value_v7;if(!value_v7){cancelAnimationFrame(raf_v7);raf_v7=0}else wake_v7()},
  get ready(){return ready_v7&&!failed_v7},get failed(){return failed_v7}
 };
};
