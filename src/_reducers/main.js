import {Redux,createStore,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk';

import dictionaryReducer from './dictionary';
import {carsReducer,showCarsReducer,selectCarReducer} from './monitor';

const initialState = {
    department:null,
    cars:[],
    show_cars:[],
    select_car:0
    
};

function main(state = initialState, action) {
    return {
        department:dictionaryReducer(state.department,action,'department'),
        cars:carsReducer(state.cars,action),
        show_cars:showCarsReducer(state.show_cars,action),
        select_car:selectCarReducer(state.select_car,action),
    };
}





let STORE=createStore(
    main,
    applyMiddleware(//应用中间件，为了可以使用异步action
        thunkMiddleware //为了可以使用异步action
    )
);

window.STORE=STORE;



export default STORE;