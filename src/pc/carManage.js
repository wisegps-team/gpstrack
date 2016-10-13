import React from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {Provider,connect} from 'react-redux';

import STORE from '../_reducers/main';
import Fab from '../_component/base/fab';
import Input from '../_component/base/input';

import AppBar from 'material-ui/AppBar';
import {ThemeProvider} from '../_theme/default';
import Paper from 'material-ui/Paper';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import IconButton from 'material-ui/IconButton';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import ActionInfo from 'material-ui/svg-icons/action/info';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Checkbox from 'material-ui/Checkbox';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

import CarBrand from '../_component/base/carBrand';
import APP from '../_component/pc/app';
import Page from '../_component/base/page';
import AddCar from '../_component/add_car';
import Sonpage from '../_component/base/sonPage';
import CarDriver from '../_component/car_driver';
import CarDevice from '../_component/car_device';
import CarInfo from '../_component/car_info';

import {getDepart} from '../_modules/tool';



import {department_act} from '../_reducers/dictionary';

STORE.dispatch(department_act.get({uid:_user.customer.objectId}));//部门
let unsubscribe = STORE.subscribe(() =>{
    if(STORE.getState().department){
        ReactDOM.render(
            <App/>
        ,W('#APP'));
        unsubscribe();
    }}
);

const styles={
    main:{width:'100%',paddingLeft:'25px',paddingRight:'25px'},
    bottomBtn:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    iconStyle:{marginRight: '12px'},
    sonpage:{padding:'1em'},
    tableHeight:window.innerHeight-180,
    info_tr:{height:'40px'},
    info_td:{paddingLeft:'1em'},
}

//测试用数据
const _car={
    objectId:1,
    name:'a car',
    brand:'a brand',
    model:'a model',
    departId:1,
    deviceType:'a deveceType',
    serviceType:'a serviceType',
    serviceExpireIn:'a serviceExpireIn'
}
let _cars=[];
for(let i=0;i<22;i++){
    let c=Object.assign({},_car);
    c.objectId+=i;
    c.name+=i;
    _cars.push(c);
}


class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            vehicles:[],            //所有车辆
            isAddingCar:false,      //正在添加车辆，为true则显示添加车辆子页面
            isEditingDriver:false,  //正在编辑驾驶人员，为true则显示'驾驶人员'子页面
            isEditingDevice:false,  //正在编辑设备，为true则显示'设备管理'子页面
            isShowingInfo:false,    //正在显示信息，为true则显示'详细信息'子页面
            curCar:{},              //当前车辆，用于显示'驾驶人员''设备管理'的时候判断当前所选车辆
            drivers:[],             //驾驶人员，当前所选车辆的驾驶人员数组
            did:{},                 //设备id，当前所选车辆绑定的设备id
            fabDisplay:'block',     //feb的display，当显示子页面的时候，设置为'none'以隐藏右下角'添加车辆'按钮
            
            //分页相关
            limit:10,
            page_no:1,
            total_page:0,
        }
        //分页相关
        this.changePage=this.changePage.bind(this);
        
        //'添加车辆'相关
        this.addCar=this.addCar.bind(this);
        this.addCarCancel=this.addCarCancel.bind(this);
        this.addCarSubmit=this.addCarSubmit.bind(this);
        //'驾驶人员'相关
        this.editDriver=this.editDriver.bind(this);
        this.editDriverCancel=this.editDriverCancel.bind(this);
        this.editDriverSubmit=this.editDriverSubmit.bind(this);
        //'设备信息'相关
        this.editDevice=this.editDevice.bind(this);
        this.editDeviceCancel=this.editDeviceCancel.bind(this);
        this.editDeviceSubmit=this.editDeviceSubmit.bind(this);
        //'更多信息'相关
        this.showInfo=this.showInfo.bind(this);
        this.showInfoCancel=this.showInfoCancel.bind(this);
        this.showInfoSubmit=this.showInfoSubmit.bind(this);
        
    }

    componentDidMount(){
        this.getVehicles();//初始化时获取所有车辆数据
    }
    getVehicles(data){
        if(!data)
            Wapi.vehicle.list(res=>{
                if(res.data.length>0){
                    this.setState({
                        vehicles:res.data,
                        total_page:Math.ceil(res.total/this.state.limit),
                    });
                }
            },{
                uid:_user.customer.objectId
            },{
                fields:'objectId,name,uid,departId,brandId,brand,model,modelId,type,typeId,desc,frameNo,engineNo,buyDate,mileage,maintainMileage,insuranceExpireIn,inspectExpireIn,serviceType,feeType,serviceRegDate,serviceExpireIn,did,drivers,managers,deviceType',
                limit:this.state.limit,
            });
        else{
            this.setState({
                vehicles:[data].concat(this.state.vehicles)
            });
        }
    }
    changePage(no){
        Wapi.vehicle.list(res=>{
            if(res.data.length>0){
                this.setState({
                    vehicles:res.data,
                    page_no:no,
                });
            }
        },{
            uid:_user.customer.objectId
        },{
            fields:'objectId,name,uid,departId,brandId,brand,model,modelId,type,typeId,desc,frameNo,engineNo,buyDate,mileage,maintainMileage,insuranceExpireIn,inspectExpireIn,serviceType,feeType,serviceRegDate,serviceExpireIn,did,drivers,managers,deviceType',
            limit:this.state.limit,
            page_no:no,
        });
    }

    addCar(){
        this.setState({
            isAddingCar:true,
            fabDisplay:'none'
        });
    }
    addCarCancel(){
        this.setState({
            isAddingCar:false,
            fabDisplay:'block'
        });
    }
    addCarSubmit(data){
        this.setState({
            isAddingCar:false,
            fabDisplay:'block'
        });
        this.getVehicles(data);//车辆新增成功后重新获得车辆数据
    }
    
    editDriver(car){
        this.setState({
            curCar:car,
            isEditingDriver:true,
            fabDisplay:'none',
        });
    }
    editDriverCancel(){
        this.setState({
            isEditingDriver:false,
            fabDisplay:'block',
        });
    }
    editDriverSubmit(){
        this.setState({
            isEditingDriver:false,
            fabDisplay:'block',
        });
    }

    editDevice(car){
        let _this=this;
        if(!car.did){
            W.confirm(___.confirm_device_bind,function(b){
                if(b){
                    _this.setState({
                        isEditingDevice:true,
                        fabDisplay:'none',
                        curCar:car,
                    });
                }else{
                    return;
                }
            });
        }else{
            _this.setState({
                isEditingDevice:true,
                fabDisplay:'none',
                curCar:car,
            });
        }
    }
    editDeviceCancel(){
        this.setState({
            isEditingDevice:false,
            fabDisplay:'block',
        });
    }
    editDeviceSubmit(data){
        this.setState({
            isEditingDevice:false,
            fabDisplay:'block',
        });
        this.getVehicles();
    }
    
    showInfo(car){
        this.setState({
            curCar:car,
            isShowingInfo:true,
            fabDisplay:'none',
        });
    }
    showInfoCancel(){
        this.setState({
            isShowingInfo:false,
            fabDisplay:'block',
        });
        this.getVehicles();
    }
    showInfoSubmit(intent,objectId){
        this.setState({
            isShowingInfo:false,
            fabDisplay:'block',
        });
        this.getVehicles();
    }

    render() {
        return (
            <APP leftBar={false}>
                <div style={styles.main} >
                    <Cars data={this.state.vehicles} editDriver={this.editDriver} editDevice={this.editDevice} showInfo={this.showInfo} />
                    <Page curPage={this.state.page_no} totalPage={this.state.total_page} changePage={this.changePage} />
                </div>
                <Fab onClick={this.addCar} sty={{display:this.state.fabDisplay}}/>
                <Sonpage open={this.state.isAddingCar} back={this.addCarCancel}>
                    <AddCar cancel={this.addCarCancel} success={this.addCarSubmit}/>
                </Sonpage>

                <Sonpage open={this.state.isEditingDriver} back={this.editDriverCancel}>
                    <CarDriver cancel={this.editDriverCancel} submit={this.editDriverSubmit} curCar={this.state.curCar}/>
                </Sonpage>
                
                <Sonpage open={this.state.isEditingDevice} back={this.editDeviceCancel}>
                    <CarDevice cancel={this.editDeviceCancel} submit={this.editDeviceSubmit} curCar={this.state.curCar}/>
                </Sonpage>
                                
                <Sonpage open={this.state.isShowingInfo} back={this.showInfoCancel}>
                    <CarInfo cancel={this.showInfoCancel} submit={this.showInfoSubmit} curCar={this.state.curCar}/>
                </Sonpage>
            </APP>
        );
    }
}


class Cars extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    changePage(){}
    render(){
        let vehicleItems = this.props.data.map(ele=>
            <TableRow key={ele.objectId} >
                <TableRowColumn>{ele.name}</TableRowColumn>
                <TableRowColumn>{ele.brand+' '+ele.model}</TableRowColumn>
                <TableRowColumn>{getDepart(ele.departId)}</TableRowColumn>
                <TableRowColumn>{ele.deviceType}</TableRowColumn>
                {/*<TableRowColumn>{ele.serviceType}</TableRowColumn>
                <TableRowColumn>{ele.serviceExpireIn}</TableRowColumn>*/}
                <TableRowColumn>
                    <DriverBtn data={ele} onClick={this.props.editDriver} />
                    <DeviceBtn data={ele} onClick={this.props.editDevice} />
                    <InfoBtn data={ele} onClick={this.props.showInfo}/>
                </TableRowColumn>
            </TableRow>);
        //vehicleItems.push(<TableRow key={-1}/>);//最后加上一条空的信息，防止最下面一个车辆元素右侧图标被“添加”按钮挡住,实测证明，挡不住
        return(
            <div>
                <Table height={styles.tableHeight+'px'} fixedHeader={true}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow key={0}>
                            <TableHeaderColumn>{___.carNum}</TableHeaderColumn>
                            <TableHeaderColumn>{___.car_model}</TableHeaderColumn>
                            <TableHeaderColumn>{___.car_depart}</TableHeaderColumn>
                            <TableHeaderColumn>{___.device_type}</TableHeaderColumn>
                            {/*<TableHeaderColumn>{___.service_type}</TableHeaderColumn>
                            <TableHeaderColumn>{___.service_expireIn}</TableHeaderColumn>*/}
                            <TableHeaderColumn>{___.operation}</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false} stripedRows={true} >
                        {vehicleItems}
                    </TableBody>
                </Table>
                
                
            </div>
        );
    }
}


const _driver={
    name:'123',
    status:'0',
    distributeTime:'2016-08-22',
    syncTime:'今天',
    bindTime:'明天',
    stopTime:'后天',
}
const _drivers=[];
for(let i=0;i<9;i++){
    _drivers[i]=_driver;
}
const _statuses=['status0','status1','status2'];

class DriverBtn extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data);
    }
    render(){
        return(
            <ActionAccountCircle style={styles.iconStyle} onClick={this.handleClick.bind(this)} />
        )
    }
}

class DeviceBtn extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data);
    }
    render(){
        return(
            <ActionSettings style={styles.iconStyle} onClick={this.handleClick.bind(this)} />
        )
    }
}

class InfoBtn extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    handleClick(){
        this.props.onClick(this.props.data);
    }
    render(){
        return(
            <ActionInfo style={styles.iconStyle} onClick={this.handleClick.bind(this)} />
        )
    }
}