'use strict';
// === 只读取已发布内容；中英文一次性校验通过后才替换本地内容 ===
window.portfolioCms_v1=(()=>{
 const query_v1='{"settings":*[_type=="siteSettings" && _id=="site-settings"][0],"copy":*[_type=="pageCopy" && _id=="page-copy"][0],"projects":*[_type=="project" && status=="published" && !(_id in path("drafts.**"))] | order(sortOrder asc, id asc)}';
 const escape_v1=value_v1=>String(value_v1).replace(/[&<>"']/g,char_v1=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char_v1]));
 const clean_v1=value_v1=>Array.isArray(value_v1)?value_v1.map(clean_v1):value_v1&&typeof value_v1==='object'?Object.fromEntries(Object.entries(value_v1).filter(([key_v1])=>!key_v1.startsWith('_')).map(([key_v1,item_v1])=>[key_v1,clean_v1(item_v1)])):value_v1;
 const localAsset_v1=value_v1=>typeof value_v1==='string'&&/^assets\/[\w./-]+$/.test(value_v1)&&!value_v1.includes('..');
 const https_v1=value_v1=>{try{const url_v1=new URL(value_v1);return url_v1.protocol==='https:'&&!url_v1.username&&!url_v1.password}catch{return false}};
 function assert_v1(condition_v1,message_v1){if(!condition_v1)throw Error(message_v1)}
 function adapt_v1(result_v1){
  assert_v1(result_v1?.settings?._id==='site-settings'&&result_v1?.copy?._id==='page-copy','缺少已发布的资料或页面文案');
  assert_v1(Array.isArray(result_v1.projects)&&result_v1.projects.length>0,'至少保留一个已发布案例');
  const locales_v1={},ids_v1=new Set();
  result_v1.projects.forEach(project_v1=>{assert_v1(!project_v1._id?.startsWith('drafts.')&&project_v1.status==='published','不得读取草稿');assert_v1(/^[a-z0-9-]+$/.test(project_v1.id)&&!ids_v1.has(project_v1.id),'项目标识无效或重复');ids_v1.add(project_v1.id)});
  for(const lang_v1 of ['zh','en']){
   const profile_v1=clean_v1(result_v1.settings[lang_v1]);assert_v1(profile_v1&&typeof profile_v1.summary==='string','个人简介不完整');
   for(const list_v1 of ['education','experience','groups','skills'])assert_v1(Array.isArray(profile_v1[list_v1]),'资料列表不完整：'+list_v1);
   assert_v1(profile_v1.skills.every(item_v1=>typeof item_v1==='string'),'技能必须是文字');
   for(const [list_v1,keys_v1] of [['education',['school','degree','year']],['experience',['company','role','date','text']],['groups',['id','title','subtitle','label']]])profile_v1[list_v1].forEach(row_v1=>keys_v1.forEach(key_v1=>assert_v1(typeof row_v1?.[key_v1]==='string','列表字段不完整：'+key_v1)));
   assert_v1(localAsset_v1(profile_v1.resume)||https_v1(profile_v1.resume),'简历地址无效');
   assert_v1(typeof profile_v1.email==='string'&&/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(profile_v1.email),'邮箱无效');
   for(const key_v1 of ['linkedin','github'])assert_v1(!profile_v1[key_v1]||https_v1(profile_v1[key_v1]),'联系链接无效');
   assert_v1(!profile_v1.serviceScope||typeof profile_v1.serviceScope==='string','合作范围格式无效');
   const projects_v1=result_v1.projects.map(project_v1=>{
    assert_v1(project_v1[lang_v1]&&typeof project_v1[lang_v1]==='object','项目缺少语言版本');
    const item_v1={...clean_v1(project_v1[lang_v1]),id:project_v1.id,group:project_v1.group,status:project_v1.status,sortOrder:project_v1.sortOrder};
    item_v1.tags=item_v1.tags||[];item_v1.gallery=item_v1.gallery||[];
    assert_v1(Array.isArray(item_v1.tags)&&item_v1.tags.every(tag_v1=>typeof tag_v1==='string'),'项目标签无效');
    assert_v1(Array.isArray(item_v1.gallery),'项目配图无效');
    if(item_v1.steps?.length){assert_v1(Array.isArray(item_v1.steps)&&item_v1.steps.every(step_v1=>typeof step_v1.number==='string'&&typeof step_v1.title==='string'),'流程步骤无效');item_v1.steps=item_v1.steps.map(step_v1=>[step_v1.number,step_v1.title])}else delete item_v1.steps;
    return item_v1;
   });
   locales_v1[lang_v1]={...profile_v1,schemaVersion:4,projects:projects_v1};validateContent_v3(locales_v1[lang_v1]);
  }
  assert_v1(JSON.stringify(locales_v1.zh.groups.map(item_v1=>item_v1.id))===JSON.stringify(locales_v1.en.groups.map(item_v1=>item_v1.id)),'中英文分类标识必须一致');
  const static_v1={};
  for(const [key_v1,mapping_v1] of Object.entries(window.portfolioCopyTemplates_v1))static_v1[mapping_v1.selector]=['zh','en'].map(lang_v1=>mapping_v1.templates[lang_v1].map(part_v1=>{if(typeof part_v1==='string')return part_v1;const text_v1=result_v1.copy[lang_v1]?.[key_v1]?.[part_v1.slot];assert_v1(typeof text_v1==='string','页面文字缺少语言版本');return escape_v1(text_v1)}).join(''));
  const ui_v1={};for(const [key_v1,field_v1] of [['title','seoTitle'],['description','seoDescription']])ui_v1[key_v1]=['zh','en'].map(lang_v1=>{const text_v1=result_v1.copy[lang_v1]?.[field_v1];assert_v1(typeof text_v1==='string'&&text_v1.trim(),'缺少搜索摘要');return text_v1});
  return {locales:locales_v1,static:static_v1,ui:ui_v1};
 }
 async function load_v1(fallback_v1){
  const config_v1=window.portfolioCmsConfig_v1||{};document.documentElement.dataset.contentSource='local';
  if(!config_v1.enabled)return fallback_v1;
  const controller_v1=new AbortController(),timer_v1=setTimeout(()=>controller_v1.abort(),config_v1.timeoutMs||4000);
  try{
   assert_v1(/^[a-z0-9]+$/.test(config_v1.projectId)&&/^[a-z0-9_-]+$/.test(config_v1.dataset),'CMS 配置无效');
   const url_v1=new URL('https://'+config_v1.projectId+'.apicdn.sanity.io/v2025-02-19/data/query/'+config_v1.dataset);url_v1.searchParams.set('perspective','published');url_v1.searchParams.set('query',query_v1);
   const response_v1=await fetch(url_v1,{signal:controller_v1.signal,credentials:'omit'});assert_v1(response_v1.ok,'CMS 请求失败');
   const data_v1=adapt_v1((await response_v1.json()).result);
   Object.assign(dictionary_v4.static,data_v1.static);Object.assign(dictionary_v4.ui,data_v1.ui);document.documentElement.dataset.contentSource='sanity';return data_v1.locales;
  }catch(error_v1){document.documentElement.dataset.contentSource='local-fallback';console.warn('CMS 不可用，本次显示随站点发布的文案快照。',error_v1.message);return fallback_v1}finally{clearTimeout(timer_v1)}
 }
 return {load:load_v1,adapt:adapt_v1,query:query_v1};
})();
