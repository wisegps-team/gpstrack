import {Redux,createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import { ACT } from '../_actions';

const initialState = {
    user:{},
    cars:[],
    show_cars:ACT.const.all,
    select_users:ACT.const.all,
    select_car:0
};
var user_ids=[];//全部用户的id
var obj_ids=[];//全部车辆的id
let cars=[];

// function monitorApp(state = initialState, action) {
//     return {
//         cars:carsReducer(state.cars,action),
//         show_cars:showCarsReducer(state.show_cars,action),
//         select_car:selectCarReducer(state.select_car,action)
//     };
// }

export function carsReducer(state = [], action) {
    let newState;
    switch (action.type) {
        case ACT.action.GETED_CARS://获取到车辆数据
            let arr=action.data;
            arr.forEach((ele)=>{
                obj_ids.push(ele.obj_id);
            });
            cars=action.data;
            return action.data;
        case ACT.action.GETED_DEVICES:
            state.forEach(car=>{
                car._device=action.data.find(d=>(d.did==car.did));//匹配上
            });
            return state.concat();
        default:
            return state
    }
}

export function showCarsReducer(state = ACT.const.all, action) {
    switch (action.type) {
        case ACT.action.GETED_CARS://获取到车辆数据
            return action.data;
        case ACT.action.SELECT_DEPART_DELETE:
            if(!Array.prototype.isPrototypeOf(state))
                return state;
            return state.filter(car=>action.id.indexOf(car.departId)==-1);
        case ACT.action.SELECT_DEPART_ADD:{
            if(!Array.prototype.isPrototypeOf(state))
                return state;
            let newState=state.filter(car=>action.id.indexOf(car.departId)==-1);
            return newState.concat(cars.filter(car=>action.id.indexOf(car.departId)!=-1));
        }
        case ACT.action.GETED_DEVICES:
            return state.concat();
        default:
            return state;
    }
}

export function selectCarReducer(state = {}, action) {
    switch (action.type) {
        case ACT.action.SELECT_CAR:
            return action.car;
        default:
            return state;
    }
}





// let STORE=createStore(
//     monitorApp,
//     applyMiddleware(//应用中间件，为了可以使用异步action
//         thunkMiddleware //为了可以使用异步action
//     )
// );



// export default STORE;