import React, {Component, PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import {reCode} from '../_modules/tool';

//如果是普通浏览器，直接弹出输入框
let isWxSdk=false;
if(WiStorm.isWeb&&!WiStorm.agent.weixin){
    W.native={
        scanner:{
            start:function(callback){
                W.prompt(___.please_input_correct_device_num,'',str=>{if(str)callback(str)});
            }
        }
    }
    isWxSdk=true;
}else{
    if(W.native)isWxSdk=true;
    else
        window.addEventListener('nativeSdkReady',()=>{isWxSdk=true;});
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
    p:{paddingLeft:'20px',width:'150px',overflow:'hidden'}
};

class DeviceIn extends Component {
        constructor(props,context){
        super(props,context);
        this.state={
            brands:[],
            types:[],
            brand:'',
            type:'',
            brandId:'',
            typeId:'',
            product_ids:[],
        }
        this.data={}
        this.brandChange=this.brandChange.bind(this);
        this.typeChange=this.typeChange.bind(this);
        this.addId=this.addId.bind(this);
        this.submit=this.submit.bind(this);
        this.cancel=this.cancel.bind(this);
    }
    componentDidMount(){
        this.setState({
            brands:[],
            types:[],
            brand:' ',
            type:' ',
        });
    }
    brandChange(value){
        this.setState({brand:value.brand,brandId:value.brandId,type:value.product,typeId:value.productId});
    }
    typeChange(e,value){
        this.setState({type:value});
    }
    addId(){
        let _this=this;
        if(isWxSdk){
            W.native.scanner.start(function(did){//扫码，did添加到当前用户
                let code=reCode(did);
                Wapi.device.get(function(res_pre){//检查是否已经有这个设备
                    if(res_pre.data){
                        W.alert(___.please_input_correct_device_num);
                        return;
                    }
                    Wapi.device.add(function(res){
                        W.alert(___.import_success);
                        W.emit(window,'add_device',res_pre.data);
                    },{
                        did,
                        uid:_user.customer.objectId,
                        status: 3,
                        commType: 'GPRS',
                        commSign: '',
                        binded: false
                    });
                },{
                    did:code
                });
            });
        }else{
            W.alert(___.please_wait);
        }
    }
    cancel(){
        this.setState({
            brand:' ',
            type:' ',
            product_ids:[]
        });
        this.props.toList();
        
    }
    submit(){
        this.cancel();
    }

    render(){
        let brands=this.state.brands.map(ele=><MenuItem value={ele.id} key={ele.id} primaryText={ele.brand_name}/>);
        let types=this.state.types.map(ele=><MenuItem value={ele.id} key={ele.id} primaryText={ele.type}/>);
        return(
            <div style={styles.input_page}>
                <h3>{___.device_in}</h3>
                <ScanGroup product_ids={this.state.product_ids} addId={this.addId} cancel={this.cancel} submit={this.submit} />
            </div>
        )
    }
}

class ScanGroup extends React.Component{
    constructor(props,context){
        super(props,context);
    }
    render(){
        let productItems=[];
        let product_ids=this.props.product_ids;
        let len=product_ids.length;
        for(let i=0;i<len;i++){
            productItems.push(
                <div key={i} style={styles.ids_box}>
                    {___.device_id} <span style={styles.product_id}>{product_ids[i]}</span>
                </div>
            )
        }
        return(
            <div>
                {productItems}
                <div style={styles.ids_box}>
                    <a onClick={this.props.addId} style={styles.scan_input}>{___.scan_input}</a>
                </div>
                <RaisedButton style={{marginTop:'1em'}} onClick={this.props.submit} label={___.ok} primary={true}/>
            </div>
        )
    }
}
export default DeviceIn;