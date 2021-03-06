"use strict";
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider,connect} from 'react-redux';

import {ThemeProvider} from '../_theme/default';
import AppBar from '../_component/base/appBar';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {List,ListItem} from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import TextField from 'material-ui/TextField';
import Card from 'material-ui/Card';

import STORE from '../_reducers/main';
import BrandSelect from'../_component/base/brandSelect';
import SonPage from '../_component/base/sonPage';
import AutoList from '../_component/autoList';
import DeviceIn from '../_component/device_in';



var thisView=window.LAUNCHER.getView();//第一句必然是获取view


thisView.addEventListener('load',function(){
    ReactDOM.render(
        <AppDeviceManage/>,thisView);
});




//测试用数据
// let _device={
//     model:'w13',
//     did:'123456',
//     activedIn:'2016-08-15',
//     carNum:'粤B23333',
//     bindDate:'2016-08-16',
//     status:0,
// }
// let _devices=[];
// for(let i=0;i<20;i++){
//     let device=Object.assign({},_device);
//     device.did+=i;
//     _devices[i]=device;
// }


const op={
    page:'createdAt',
    sorts:'-createdAt',
}
const styles = {
    ta:{textAlign:'center',margin:0},
    main:{width:'90%',paddingTop:'50px',marginLeft:'5%',marginRight:'5%',},
    show:{paddingTop:'50px',width:'750px'},
    hide:{display:'none'},
    scan_input:{color:'#00bbbb',borderBottom:'solid 1px'},
    product_id:{borderBottom:'solid 1px #999999'},
    ids_box:{marginTop:'1em'},
    btn_cancel:{marginTop:'30px',marginRight:'20px'},
    input_page:{marginTop:'20px',textAlign:'center'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'20px',width:'150px',overflow:'hidden'},
};


class DumbList extends React.Component{
    shouldComponentUpdate(nextProps, nextState) {
        return !this.props.data;
    }

    render() {
        let item=this.props.data?this.props.data.map(ele=>{
            let isOnline=___.offline;
            let rcvTime='--';
            if(ele.activeGpsData&&ele.activeGpsData.rcvTime){
                let t=W.date(ele.activeGpsData.rcvTime);
                isOnline=((new Date()-t)/1000/60<10)?___.online:___.offline;
                rcvTime=W.dateToString(t);
            }
            let version=ele.params?ele.params.version:'--';
            return (<Card key={ele.did} style={{marginTop:'1em', padding:'0.5em 1em'}} >
                <table>
                    <tbody>
                        <tr>
                            <td style={styles.td_left}>{___.device_type}</td>
                            <td style={styles.td_right}>{ele.model}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.device_id}</td>
                            <td style={styles.td_right}>{ele.did}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.carNum}</td>
                            <td style={styles.td_right}>{ele.vehicleName}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.device_version}</td>
                            <td style={styles.td_right}>{version}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.rcv_time}</td>
                            <td style={styles.td_right}>{rcvTime}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.device_status}</td>
                            <td style={styles.td_right}>{isOnline}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>);
        }):(<h3 style={styles.ta}>{___.loading}</h3>);
        return (
            <div>
                {item}
            </div>
        );
    }
}
let Alist=AutoList(DumbList);

class DeviceList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:[],
            total:-1
        }
        this.page=1;
        this.loadNextPage = this.loadNextPage.bind(this);
        this.add = this.add.bind(this);
    }
    
    componentDidMount() {//初始化数据
        Wapi.device.list(res=>this.setState({data:res.data,total:res.total}),{
            uid:_user.customer.objectId
        },Object.assign(op,{page_no:this.page}));
        window.addEventListener('add_device',this.add);
    }
        componentWillUnmount() {
        window.removeEventListener('add_device',this.add);
    }
    add(e){
        this.setState({data:this.state.data.concat(e.params)});
    }


    loadNextPage(){
        //加载下一页的方法
        let arr=this.state.data;
        let last=arr[arr.length-1];
        this.page++;
        Wapi.device.list(res=>this.setState({data:arr.concat(res.data)}),{
            uid:_user.customer.objectId
        },Object.assign(op,{page_no:this.page}));
    }
    
    render() {
        return (
            <Alist 
                max={this.state.total} 
                limit={20} 
                data={this.state.data} 
                next={this.loadNextPage} 
            />
        );
    }
}

class AppDeviceManage extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            intent:'list',
            devices:[],
            total:0,
        }
        this.page_no=1;
        this.getDevices=this.getDevices.bind(this);
        this.deviceIn=this.deviceIn.bind(this);
        this.toList=this.toList.bind(this);
    }

    componentDidMount(){
        this.getDevices();
    }
    getDevices(){
        Wapi.device.list(res=>{
            if(res.data.length>0)
                this.setState({
                    devices:res.data,
                    total:res.total,
                });
        },{
            uid:_user.customer.objectId
        },{
            limit:20
        });

        //测试用数据
        // this.setState({devices:_devices});
    }

    deviceIn(){
        history.replaceState('home','home','home.html');
        this.setState({intent:'in'});
    }
    toList(){
        this.setState({intent:'list'});
    }

    render(){
        return(
            <ThemeProvider>
                <div style={{overflow:'auto'}}>
                    <AppBar 
                        title={___.device_manage} 
                        style={{position:'fixed'}}
                        iconElementRight={
                            <IconMenu
                                iconButtonElement={
                                    <IconButton><MoreVertIcon/></IconButton>
                                }
                                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                >
                                <MenuItem primaryText={___.import} onTouchTap={this.deviceIn}/>
                            </IconMenu>
                        } 
                    />
                    <div style={styles.main}>
                        <DeviceList/>
                    </div>
                    <SonPage open={this.state.intent=='in'} back={this.toList}>
                        <DeviceIn toList={this.toList}/>
                    </SonPage>
                </div>
            </ThemeProvider>
        );
    }
}


