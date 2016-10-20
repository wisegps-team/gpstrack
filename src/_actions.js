var code="b573bcc9b949e6c593d1fb6d206f6c69";

export const ACT ={
    action:{
        SELECT_CAR:'SELECT_CAR',
        SELECT_USERS:'SELECT_USERS',
        SELECT_DEPART_ADD:'SELECT_USERS_ADD',
        SELECT_DEPART_DELETE:'SELECT_USERS_DELETE',
        SHOW_CARS:'SHOW_CARS',
        GET_USERS:'GET_USERS',
        GET_CARS:'GET_CARS',
        GETED_USERS:'GETED_USERS',
        GETED_CARS:'GETED_CARS',
        GETED_DEVICES:'GETED_DEVICES'
    },
    'const':{
        all:'ALL'
    },
    fun:{
        selectCar:function (car) {
            return {type: ACT.action.SELECT_CAR,car};
        },
        selectDepartAdd:function(id){//添加select_users里的用户(其实是部门)
            return {type: ACT.action.SELECT_DEPART_ADD,id};
        },
        selectDepartDelete:function(id){//删除select_users里的用户(其实是部门)
            return {type: ACT.action.SELECT_DEPART_DELETE,id};
        },
        showCars:function(cars){
            return {type: ACT.action.SHOW_CARS,cars};
        },
        getCars:function () {//异步获取车辆资料,所以是返回一个方法而不是一个json
            return function(dispatch) {
                Wapi.vehicle.list(res=>{
                    let cars=res.data;
                    dispatch(ACT.fun.getedCars(cars));
                    let device_ids=cars.map(car=>car.did);
                    dispatch(ACT.fun.getDevices(cars));
                },{
                    uid:_user.customer.objectId
                },{
                    limit:'-1'
                })
                // W.get(AJAX[1].url.replace('$user$',users),AJAX[1].data,function (res) {
                //     dispatch(ACT.fun.getedCars(res));
                //     setTimeout(()=>dispatch(ACT.fun.getCars(users)),10000);//10秒轮询
                // },AJAX[1].dataType);
            }
        },
        getDevices:function(cars){
            return function(dispatch) {
                let device_ids=cars.map(car=>car.did);
                device_ids=device_ids.filter(e=>!!e);
                Wapi.device.list(function(res){
                    var devices=res.data;
                    dispatch(ACT.fun.getedDevices(devices));
                    if(!ACT.fun.getDevices._id)//只能有一次轮询
                        ACT.fun.getDevices._id=setTimeout(()=>{
                            ACT.fun.getDevices._id=0;
                            dispatch(ACT.fun.getDevices(cars))
                        },10000);//10秒轮询
                },{
                    did:device_ids.join('|'),
                    map:WiStorm.config.map
                },{
                    limit:'-1'
                })
            }
        },
        startGetCars:function () {
            return {type: ACT.action.GET_CARS};
        },
        getedUsers:function (data) {
            return {type: ACT.action.GETED_USERS,data};
        },
        getedCars:function (data) {
            return {type: ACT.action.GETED_CARS,data};
        },
        getedDevices:function (data) {
            return {type: ACT.action.GETED_DEVICES,data};
        }
    }
};


const device={"uid":"763993890020790300","did":"56621884858","ip":"::ffff:116.30.244.43","objectId":865439229194014700,"activeGpsData":{"did":"56621884858","gpsTime":"2016-08-25T13:35:16.000Z","battery":0,"air":0,"temp":0,"fuel":0,"signal":0,"mileage":63279.3,"alerts":[],"status":[8196],"direct":290,"speed":29.632,"lat":26.57393366666667,"lon":106.680595,"gpsFlag":2}}



const AJAX=[
    {//获取子用户
        "url":"http://web.wisegps.cn/app/customer/237/customer",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "tree_path":",1,237,",
            "page_no":1,
            "page_count":1000
        },
        "timeout":10000
    },
    {//获取车辆
        "url":"http://web.wisegps.cn/app/customer/$user$/active_gps_data",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "update_time": "1700-01-01", 
            "mode": "multi"
        }
    },
    {//未读消息
        "url":"http://web.wisegps.cn/app/customer/237/noti_unread2",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "tree_path":",1,237,",
            "t":1467702757914
        },
        "timeout":10000
    },
    {//未读警告
        "url":"http://web.wisegps.cn/app/customer/237/alert_unread",
        "type":"GET",
        "dataType":"json",
        "data":{
            "auth_code":code,
            "tree_path":",1,237,",
            "update_time":"1700-01-01",
            "t":1467702765610
        },
        "timeout":10000
    }
]