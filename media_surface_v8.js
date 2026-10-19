/* === 与 contain 画幅同步的角落纹理遮罩，不裁切或重采样人物 === */
(()=>{'use strict';
for(const host_v8 of document.querySelectorAll('.scene-media,.ending-media-v6')){
 const corner_v8=document.createElement('div');corner_v8.className='media-clean-corner-v8';corner_v8.setAttribute('aria-hidden','true');host_v8.append(corner_v8);
 const reference_v8=new Image();reference_v8.src='assets/hero_smile_v1.png';corner_v8.style.backgroundImage='url("assets/hero_smile_v1.png")';
 function fit_v8(){const width_v8=host_v8.clientWidth,height_v8=host_v8.clientHeight,scale_v8=Math.min(width_v8/1920,height_v8/1080),frameWidth_v8=1920*scale_v8,frameHeight_v8=1080*scale_v8;Object.assign(corner_v8.style,{left:(width_v8-frameWidth_v8)/2+'px',top:(height_v8-frameHeight_v8)/2+'px',width:frameWidth_v8*.125+'px',height:frameHeight_v8*.135+'px',backgroundSize:frameWidth_v8+'px '+frameHeight_v8+'px',backgroundPosition:'0 '+(-frameHeight_v8*.145)+'px'})}
 new ResizeObserver(fit_v8).observe(host_v8);reference_v8.onload=fit_v8;fit_v8();
}
})();
