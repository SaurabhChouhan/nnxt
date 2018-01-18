import React, {Component} from 'react'
import Header from '../sections/Header'
import Tabs from '../sections/Tabs'

class SuperAdminHome extends Component {
    render() {
        return ([<Header key="super_admin_header" {...this.props}/>,
            <div key="adminhome_div" className="col-md-12 pad topNav">
                <Tabs match={this.props.match} {...this.props}/>
            </div>])
    }
}

export default SuperAdminHome
