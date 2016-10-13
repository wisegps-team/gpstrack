import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import Drawer from 'material-ui/Drawer';

import STORE from '../_reducers/main';
import {ACT} from '../_actions';

import APP from '../_component/pc/app';
import {CarList} from '../_component/car_list';
import DepartmentTree from '../_component/department_tree';
import Map from '../_component/map';
import MapManager from '../_component/map_manager';
import {department_act} from '../_reducers/dictionary';
import {getAllChild} from '../_modules/tool';

// 打印初始状态
console.log(STORE.getState());
// 每次 state 更新时，打印日志
// 注意 subscribe() 返回一个函数用来注销监听器
STORE.subscribe(() =>
    console.log(STORE.getState())
)

const styles = {
    container: {
        textAlign: 'center',
        paddingLeft:'256px'
    },
    userTreeBox:{
        display:'block',
        // maxHeight:'35vh',
        overflow:'auto'
    },
    carListBox:{
        display:'block',
        // height:'55vh',
        borderTop:'solid 1px #999',
        overflow:'auto'
    },
    manager:{
        position: 'absolute',
        zIndex: 1,
        width: '300px',
        right: 0,
        top:'50px',
        maxHeight: '100%'
    },
    w:{width:'100%',height: 'calc(100vh - 50px)'}
};


STORE.dispatch(department_act.get({uid:_user.customer.objectId}));//部门
let unsubscribe = STORE.subscribe(() =>{
    if(STORE.getState().department){
        ReactDOM.render(
            <Provider store={STORE}>
                <ConnectAPP/>
            </Provider>
        ,W('#APP'));
        unsubscribe();
    }}
);

window.addEventListener('load',function(){
    ReactDOM.render(
        <Provider store={STORE}>
            <ConnectAPP/>
        </Provider>
        ,W('#APP'));
});



class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            drawer:true
        }
    }

    componentDidMount(){
        STORE.dispatch(ACT.fun.getCars());
    }

    render() {
        return (
            <APP
                leftContent={[
                    <div style={styles.userTreeBox} key={0}>
                        <DepartmentTree onSelect={departClick} check={true} mode={'select'} checked={true} open={true}/>
                    </div>,
                    <div style={styles.carListBox} key={1}>
                        <CarList 
                            data={this.props.show_cars} 
                            carClick={carClick} 
                            active={this.props.select_car}
                        />
                    </div>]
                }
                leftBar={!WiStorm.agent.mobile}                
            >
                <Map 
                    id='monitor_map' 
                    cars={this.props.show_cars} 
                    style={styles.w} 
                    active={this.props.select_car} 
                    carClick={carClick}
                />
            </APP>
        );
    }
}

const ConnectAPP=connect(function select(state) {
    let sta={
        select_car:state.select_car
    };
    sta.show_cars=(state.show_cars==ACT.const.all)?state.cars:state.show_cars;
    return sta;
})(App);

function  carClick(data) {
    STORE.dispatch(ACT.fun.selectCar(data));
}

function departClick(data){
    let id=getAllChild(data).join('|');
    if(data.checked){
        STORE.dispatch(ACT.fun.selectDepartAdd(id));
    }else{
        STORE.dispatch(ACT.fun.selectDepartDelete(id));
    }
}