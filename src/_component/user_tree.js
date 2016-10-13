import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';

import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import P from '../_modules/public';


const sty={
    ids:{fontSize:'14px',borderBottom:'solid 1px #ccc',paddingTop:'10px',paddingBottom:'10px',paddingLeft:'50px'},
    nls:{paddingLeft:'15px',paddingTop:'0px',paddingBottom:'0px'},
    cb:{marginLeft:'-10px',marginTop:'-5px'},
    main:{borderBottom:'solid 1px #ccc'}
}

export class UserTree extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            checked:true,
            name:props.data.cust_name
        }
    }

    componentWillReceiveProps(nextProps) {
        let state={
            name:nextProps.data.cust_name,
            checked:(nextProps.parentChecked!=this.props.parentChecked)?nextProps.parentChecked:this.state.checked
        }
        this.setState(state);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return !P.requal(this.state,nextState);
    }
    
    handleTouch(e){
        this.setState({checked:!this.state.checked});
        let taht=this;
        setTimeout(function(){
            if(!taht.state.checked){
                taht.props.userClick(taht.props.data,"delete");
            }else{
                taht.props.userClick(taht.props.data,"add");
            }
        },500);
        
    }
    render(){
        let fun=this.props.userClick;
        let children=[];
        if(this.props.data.children)
            children=this.props.data.children.map(function (ele) {
                return <UserTree key={ele.cust_id} data={ele} userClick={fun} parentChecked={this.state.checked}/>;
            },this);
        return (
            <ListItem
                primaryText={this.state.name}
                initiallyOpen={true}
                primaryTogglesNestedList={true}
                innerDivStyle={sty.ids}
                nestedItems={children}
                nestedListStyle={sty.nls}
                leftCheckbox={<Checkbox style={sty.cb} defaultChecked={this.state.checked} onClick={this.handleTouch.bind(this)}/>}
                
            />
        );
    }
}

// export default UserTree;


export class DepartList extends Component{
    render() {
        return null;
        return (
            <ListItem
                primaryText={_user.username}
                initiallyOpen={true}
                primaryTogglesNestedList={true}
                nestedItems={department.map((e,i)=>(<Depart data={e} userClick={this.props.userClick} key={i}/>))}
                nestedListStyle={sty.nls} 
                innerDivStyle={sty.main}       
            />
        );
    }
}

class Depart extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            checked:true
        }
        this.handleTouch = this.handleTouch.bind(this);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
    

    handleTouch(){
        this.setState({checked:!this.state.checked});
        let taht=this;
        if(this.state.checked){
            this.props.userClick(this.props.data.objectId,"delete");
        }else{
            this.props.userClick(this.props.data.objectId,"add");
        }
        // setTimeout(function(){
        //     if(!taht.state.checked){
        //         taht.props.userClick(taht.props.data,"delete");
        //     }else{
        //         taht.props.userClick(taht.props.data,"add");
        //     }
        // },500);
    }
    render() {
        return (
            <ListItem
                primaryText={this.props.data.name}
                innerDivStyle={sty.ids}
                leftCheckbox={<Checkbox style={sty.cb} defaultChecked={this.state.checked} onClick={this.handleTouch.bind(this)}/>}                
            />
        );
    }
}

export default DepartList;

var department=[
    {
        "uid":'12',
        "name":'部门1',
        "adminId":'',
        "parentId":'',
        "treePath":''
    },
    {
        "uid":'12',
        "name":'部门2',
        "adminId":'',
        "parentId":'',
        "treePath":''
    },
    {
        "uid":'12',
        "name":'部门3',
        "adminId":'',
        "parentId":'',
        "treePath":''
    },
    {
        "uid":'12',
        "name":'部门4',
        "adminId":'',
        "parentId":'',
        "treePath":''
    }
]
