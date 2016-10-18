/**
 * 关于项目所有的配置
 */
const CONFIG={}

//本地测试时使用
console.debug(
W.setCookie('_app_config_','{"devKey":"59346d400236ab95e95193f35f3df6a4","devSecret":"c4fa7ada71d46843ebd99063c0b8c5bb","objectId":770933352235667600,"pushEngine":{"jpush":{"screct":"7de743e26f6a9b71a14b8ac3","key":"51ccb6294c18a0979cc10240"}},"desc":"\u901a\u7528\u8f66\u8f86\u8ddf\u8e2a\u5e73\u53f0","name":"\u8f66\u8054\u5728\u7ebf","enterUrl":"\/gpstrack\/index.html","devId":761250716898693100,"sid":770811593507344600,"appKey":"3cea92bd76089d5ebea86613c8dbd169","appSecret":"000daf0bd5827b47e3fbd861ad4fcfg5","wxAppKey":"wxa5c196f7ec4b5df9"}',30)
);

let keys=W.getCookie('_app_config_');
try {
    keys=JSON.parse(keys);
    Object.assign(CONFIG,keys);
} catch (error) {
    alert('app key error');
}


export default CONFIG;