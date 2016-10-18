import React, {Component} from 'react';
import Input from './input';
import Wapi from '../../_modules/Wapi/index';

class EmailInput extends Component{
    constructor(props, context){
        super(props, context);
        this.state={
            code_err:null,
            value:null,
        }
    }
    change(e,value){
        let state={
            value,
            code_err:null
        }
        let reg=/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
        if(reg.test(value)){
            if(value==this.props.old_value){
                this.setState(state);
                return;
            }

            let _this=this;
            Wapi.user.checkExists(function(json){
                if(!_this.props.needExist==!json.exist){
                    state.code_err=null;
                }else{
                    if(json.exist){
                        state.code_err=___.phone_registed;
                    }else{
                        state.code_err=___.phone_not_registed;
                    }
                }
                _this.props.onChange(state.value,state.code_err);
                _this.setState(state);
            },{email:value});
        }else{
            if(value==''){
                state.code_err=___.phone_empty;
            }else{
                state.code_err=___.phone_err;
            }
            this.props.onChange(state.value,state.code_err);
            this.setState(state);
        }
    }
    render(){
        return(
            <Input
                {...this.props}
                errorText={this.state.code_err}
                onChange={this.change.bind(this)}
                value={this.state.value||this.props.value}
            />
        );
    }
}

export default EmailInput;