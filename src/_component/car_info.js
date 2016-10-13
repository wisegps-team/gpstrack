import React, {Component} from 'react';

import {Tabs, Tab} from 'material-ui/Tabs';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {getDepart} from '../_modules/tool';


const styles={
    bottomBtn:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
    sonpage:{paddingLeft:'1em',paddingRight:'1em'},
    td_left:{whiteSpace:'nowrap'},
    td_right:{paddingLeft:'1em'}
}


export default class CarInfo extends React.Component{
    constructor(props,context){
        super(props,context);
        this.state={
            onManage:false
        }
        this.onManageChange=this.onManageChange.bind(this);
        this.deleteCar=this.deleteCar.bind(this);
        this.cancel=this.cancel.bind(this);
        this.submit=this.submit.bind(this);
    }
    onManageChange(e,value){
        this.setState({onManage:value});
    }
    deleteCar(){
        let _this=this;
        W.confirm(___.confirm_car_delete,function(b){
            if(b){
                // alert(b);
                let targetId=_this.props.curCar.objectId;
                Wapi.vehicle.delete(res=>{
                    // _this.props.cancel();
                    _this.submit('delete');
                },{
                    objectId:targetId
                });
            }else{
                return;
            }
        });
        
    }
    cancel(){
        history.back();
        this.props.cancel();
    }
    submit(intent){
        // history.back();
        if(intent=='delete'){
            this.props.submit('delete',this.props.curCar.objectId);
        }else{
            this.props.cancel();
        }
        
    }
    render(){
        let car=this.props.curCar;
        return(
            <div>
                <Tabs>
                    <Tab label={___.base_info}>
                        <table style={styles.sonpage}>
                            <tbody>
                                <tr>
                                    <td style={styles.td_left}>{___.carNum}</td>
                                    <td style={styles.td_right}>{car.name}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.brand}</td>
                                    <td style={styles.td_right}>{car.brand+' '+car.model}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.frame_no}</td>
                                    <td style={styles.td_right}>{car.frameNo}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.engine_no}</td>
                                    <td style={styles.td_right}>{car.engineNo}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.buy_date}</td>
                                    <td style={styles.td_right}>{car.buyDate?car.buyDate.slice(0,10):''}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.car_depart}</td>
                                    <td style={styles.td_right}>{getDepart(car.departId)}</td>
                                </tr>
                                {/*<tr>
                                    <td style={styles.td_left}>{___.on_manage}</td>
                                    <td style={styles.td_right}><Checkbox name='onManage' onCheck={this.onManageChange} defaultChecked={this.state.onManage} /></td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.management}</td>
                                    <td style={styles.td_right}>{car.managers}</td>
                                </tr>*/}
                            </tbody>
                        </table>
                        <div style={{marginLeft:'1em'}}>
                            <RaisedButton
                                label={___.delete}
                                primary={true}
                                onClick={this.deleteCar}
                            />
                        </div>
                    </Tab>
                    <Tab label={___.insurance_info}>
                        <table style={styles.sonpage}>
                            <tbody>
                                <tr>
                                    <td style={styles.td_left}>{___.mileage}</td>
                                    <td style={styles.td_right}>{car.mileage}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.maintain_mileage}</td>
                                    <td style={styles.td_right}>{car.maintainMileage}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.insurance_expire}</td>
                                    <td style={styles.td_right}>{car.insuranceExpireIn?car.insuranceExpireIn.slice(0,10):''}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.inspect_expireIn}</td>
                                    <td style={styles.td_right}>{car.inspectExpireIn?car.inspectExpireIn.slice(0,10):''}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Tab>
                    {/*<Tab label={___.financial_info}>
                        <table style={styles.sonpage}>
                            <tbody>
                                <tr>
                                    <td style={styles.td_left}>{___.service_type}</td>
                                    <td style={styles.td_right}>{car.serviceType}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.charge_standard}</td>
                                    <td style={styles.td_right}>{car.feeType}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.service_reg_date}</td>
                                    <td style={styles.td_right}>{car.serviceRegDate||''}</td>
                                </tr>
                                <tr>
                                    <td style={styles.td_left}>{___.service_expire}</td>
                                    <td style={styles.td_right}>{car.serviceExpireIn||''}</td>
                                </tr>
                            </tbody>
                        </table>
                    </Tab>*/}
                </Tabs>
                <div style={styles.bottomBtn}>
                    {/*<FlatButton
                        label={___.cancel}
                        primary={true}
                        onClick={this.cancel}
                    />*/}
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