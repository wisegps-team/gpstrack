import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import Paper from 'material-ui/Paper';
import AppBar from '../_component/base/appBar';
import MyAccount from '../_component/my_account';


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    p:{
        padding: '10px',
    }
}

class App extends Component {
    constructor(props, context) {
        super(props, context);
    }
    
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.my_account}/>
                <div style={sty.p}>
                    <MyAccount/>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}

