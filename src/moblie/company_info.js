import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import AppBar from '../_component/base/appBar';
import CompanyInfo from '../_component/company_info';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

const sty={
    p:{
        padding: '10px'
    }
}

class App extends Component {
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar title={___.company_info}/>
                <div style={sty.p}>
                    <CompanyInfo/>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}

