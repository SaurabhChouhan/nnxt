import React, {Component} from 'react';
import Header from '../sections/Header'
import Tabs from '../sections/Tabs'

class AppHome extends Component {
    render() {
        return ([<Header key="app_home_header" {...this.props}/>,
            <div key="adminhome_div" className="col-md-12 pad topNav">
                <Tabs match={this.props.match} {...this.props}/>
            </div>])
    }
}

export default AppHome
