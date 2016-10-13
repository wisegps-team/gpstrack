import React, {Component} from 'react';

import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import Sonpage from '../_component/base/sonPage';


const styles={
    bottomBtn:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    sonpage:{paddingLeft:'1em',paddingRight:'1em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'}
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

export default class CarDriver extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            drivers:_drivers,
            isAdding:false,
        }
        this.cancel=this.cancel.bind(this);
        this.submit=this.submit.bind(this);
        this.add=this.add.bind(this);
        this.addCancel=this.addCancel.bind(this);
        this.addSubmit=this.addSubmit.bind(this);
    }
    cancel(){
        history.back();
        this.props.cancel();
    }
    submit(){
        this.props.submit();
    }
    add(){
        this.setState({isAdding:true});
    }
    addCancel(){
        this.setState({isAdding:false});
    }
    addSubmit(driver){
        let car=this.props.curCar;
        let drivers=this.state.drivers;
        drivers.push(driver);
        Wapi.vehicle.update(res=>{
            this.setState({isAdding:false});
        },{
            _objectId:car.objectId,
            drivers:drivers,
        });
    }
    componentDidMount(){
        let drivers=this.props.curCar.drivers||[];
        this.setState({drivers:drivers});
    }
    componentWillReceiveProps(nextProps){
        let drivers=nextProps.curCar.drivers||[];
        this.setState({drivers:drivers});
    }
    render(){
        let data=this.state.drivers;
        // let data=_drivers;
        
        let main;
        let addPage;
        let driverItems=data.map((ele,index)=>
            <Card key={index} style={{marginTop:'1em',padding:'0.5em 1em'}} >
                <table >
                    <tbody>
                        <tr>
                            <td style={styles.td_left}>{___.person}</td>
                            <td style={styles.td_right}>{ele.name}</td>
                        </tr>
                        {/*<tr>
                            <td style={styles.td_left}>{___.driver_status}</td>
                            <td style={styles.td_right}>{ele.status}</td>
                        </tr>*/}
                        <tr>
                            <td style={styles.td_left}>{___.distribute_time}</td>
                            <td style={styles.td_right}>{ele.distributeTime?ele.distributeTime.slice(5,10):''}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.sync_time}</td>
                            <td style={styles.td_right}>{ele.syncTime?ele.syncTime.slice(5,10):''}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.bind_time}</td>
                            <td style={styles.td_right}>{ele.bindTime?ele.bindTime.slice(5,10):''}</td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.stop_time}</td>
                            <td style={styles.td_right}>{ele.stopTime?ele.stopTime.slice(5,10):''}</td>
                        </tr>
                    </tbody>
                </table>
            </Card>
        );
        main=driverItems;
        addPage=<Sonpage open={this.state.isAdding} back={this.addCancel}>
                    <DriverAdd cancel={this.addCancel} submit={this.addSubmit}/>
                </Sonpage>;

        return(
            <div style={styles.sonpage}>
                {main}
                <div style={{marginTop:'1em', display:data.length>0?'none':'block'}}>{___.confirm_driver_add}</div>
                <div style={styles.bottomBtn}>
                    {/*<FlatButton
                        label={___.cancel}
                        primary={true}
                        onClick={this.cancel}
                    />*/}
                    <FlatButton
                        label={___.add}
                        primary={true}
                        onClick={this.add}
                    />
                </div>
                {addPage}
            </div>
        )
    }
}
class DriverAdd extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            name:'',
            status:1,
            distributeTime:'',
            syncTime:'',
            bindTime:'',
            stopTime:'',

            statuses:[],
        }
        this.nameChange=this.nameChange.bind(this);
        this.statusChange=this.statusChange.bind(this);
        this.distributeTimeChange=this.distributeTimeChange.bind(this);
        this.syncTimeChange=this.syncTimeChange.bind(this);
        this.bindTimeChange=this.bindTimeChange.bind(this);
        this.stopTimeChange=this.stopTimeChange.bind(this);
        this.cancel=this.cancel.bind(this);
        this.submit=this.submit.bind(this);
    }
    componentDidMount(){
        this.setState({statuses:_statuses});
    }
    nameChange(e,value){
        this.setState({name:value});
    }
    statusChange(e,value){
        this.setState({status:value});
    }
    distributeTimeChange(e,value){
        this.setState({distributeTime:W.dateToString(value).slice(0,10)});
    }
    syncTimeChange(e,value){
        this.setState({syncTime:W.dateToString(value).slice(0,10)});
    }
    bindTimeChange(e,value){
        this.setState({bindTime:W.dateToString(value).slice(0,10)});
    }
    stopTimeChange(e,value){
        this.setState({stopTime:W.dateToString(value).slice(0,10)});
    }
    cancel(){
        history.back();
        this.props.cancel();
    }
    submit(){
        let data={
            name:this.state.name,
            status:this.state.statuses[this.state.status],
            distributeTime:this.state.distributeTime,
            syncTime:this.state.syncTime,
            bindTime:this.state.bindTime,
            stopTime:this.state.stopTime,
        }
        this.props.submit(data);
    }
    render(){
        let statusItems=this.state.statuses.map((ele,index)=><MenuItem value={index} primaryText={ele} key={index}/>);
        return(
            <div style={styles.sonpage} >
                <table>
                    <tbody>
                        <tr>
                            <td style={styles.td_left}>{___.person}</td>
                            <td style={styles.td_right}><TextField name='name' onChange={this.nameChange} /></td>
                        </tr>
                        {/*<tr>
                            <td style={styles.td_left}>{___.driver_status}</td>
                            <td style={styles.td_right}>
                                <SelectField name='status' value={this.state.status} onChange={this.statusChange}>
                                    {statusItems}
                                </SelectField>
                            </td>
                        </tr>*/}
                        <tr>
                            <td style={styles.td_left}>{___.distribute_time}</td>
                            <td style={styles.td_right}>
                                <DatePicker 
                                    name='distributeTime' 
                                    hintText={___.please_pick_date}
                                    onChange={this.distributeTimeChange}
                                    okLabel={___.ok}
                                    cancelLabel={___.cancel}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.sync_time}</td>
                            <td style={styles.td_right}>
                                <DatePicker 
                                    name='syncTime' 
                                    hintText={___.please_pick_date}
                                    onChange={this.syncTimeChange}
                                    okLabel={___.ok}
                                    cancelLabel={___.cancel}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.bind_time}</td>
                            <td style={styles.td_right}>
                                <DatePicker 
                                    name='bindTime' 
                                    hintText={___.please_pick_date}
                                    onChange={this.bindTimeChange}
                                    okLabel={___.ok}
                                    cancelLabel={___.cancel}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={styles.td_left}>{___.stop_time}</td>
                            <td style={styles.td_right}>
                                <DatePicker 
                                    name='stopTime' 
                                    hintText={___.please_pick_date}
                                    onChange={this.stopTimeChange}
                                    okLabel={___.ok}
                                    cancelLabel={___.cancel}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div style={styles.bottomBtn}>
                    <FlatButton
                        label={___.cancel}
                        primary={true}
                        onClick={this.cancel}
                    />
                    <FlatButton
                        label={___.ok}
                        primary={true}
                        onClick={this.submit}
                    />
                </div>
            </div>
        )
    }
}