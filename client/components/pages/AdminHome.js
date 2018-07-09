import React, {Component} from 'react';
import Header from '../sections/Header'
import Tabs from '../sections/Tabs'

class AdminHome extends Component {
    render() {
        return ([<Header key="admin_header1" {...this.props}/>,
            <div key="admin-home_div" className="col-md-12 pad topNav">
                <Tabs match={this.props.match} {...this.props}/>
            </div>])
    }
}

export default AdminHome
