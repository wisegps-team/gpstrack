import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import Drawer from 'material-ui/Drawer';

import STORE from '../_reducers/main';
import {ACT} from '../_actions';

import APP from '../_component/pc/app';
import {CarList} from '../_component/car_list';
import {UserTree,DepartList} from '../_component/user_tree';
import Map from '../_component/map';
import MapManager from '../_component/map_manager';
import AppBar from '../_component/base/appBar';
import SonPage from '../_component/base/sonPage';
import {ThemeProvider} from '../_theme/default';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import {getAllChild} from '../_modules/tool';
import DepartmentTree from '../_component/department_tree';

const styles = {
    container: {
        textAlign: 'center',
        paddingLeft:'256px'
    },
    userTreeBox:{
        display:'block',
        height:'35vh',
        overflow:'auto'
    },
    carListBox:{
        display:'block',
        borderTop:'solid 1px #999',
        overflow:'auto',
        paddingTop:'30px'
    },
    manager:{
        position: 'absolute',
        zIndex: 1,
        width: '300px',
        right: 0,
        top:'50px',
        maxHeight: '100%'
    },
    view:{
        display:'block',
        position: 'fixed',
        zIndex: '-1'
    },
    activeView:{
        display:'',
        position: '',
        zIndex: ''
    },
    w:{width:'100%',height: 'calc(100vh - 50px)'}
};

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
let userView;
thisView.addEventListener('load',function(){
    ReactDOM.render(
    <Provider store={STORE}>
        <ConnectAPP/>
    </Provider>
    ,thisView);

    userView=thisView.prefetch('#carList',3);
    ReactDOM.render(<Provider store={STORE}>
        <ConnectUserApp/>
    </Provider>,userView);
    userView.addEventListener('show',function(){
        Object.assign(thisView.style,styles.view);
    });
    thisView.addEventListener('show',function(){
        Object.assign(thisView.style,styles.activeView);
    });
});


class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            drawer:false
        }
        this.handleUser = this.handleUser.bind(this);

    }

    componentDidMount(){
        STORE.dispatch(ACT.fun.getCars());//异步的action
    }

    handleUser(){
        thisView.goTo('#carList');
    }

    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar
                        iconElementRight={<IconButton onClick={this.handleUser}><MoreVertIcon /></IconButton>}
                    />
                    <Map 
                        id='monitor_map' 
                        style={styles.w} 
                        cars={this.props.show_cars} 
                        active={this.props.select_car} 
                        carClick={carClick}
                    />
                </div>
            </ThemeProvider>
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


class UserApp extends Component{
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar/>
                <Paper style={{position:'fixed',top:'50px',width:'100%',background: '#fff',zIndex:1}} zDepth={1}>
                    <DepartmentTree onSelect={departClick} check={true} mode={'select'} checked={true} open={true}/>
                </Paper>
                <div >
                    
                </div>
                <div style={styles.carListBox}>
                    <CarList 
                        data={this.props.show_cars} 
                        carClick={carClick} 
                        active={this.props.select_car}
                    />
                </div>
            </div>
            </ThemeProvider>
        );
    }
}
const ConnectUserApp=connect(function select(state) {
    let sta={
        user:state.user,
        select_car:state.select_car
    };
    sta.show_cars=(state.show_cars==ACT.const.all)?state.cars:state.show_cars;
    return sta;
})(UserApp);