import React, {Component} from 'react';
import Header from '../sections/Header'
import Tabs from '../sections/Tabs'
import {Sidebar, ContentMain} from "../sections"

class AppHome extends Component {
    render() {
        return <div className="container-fluid">
            <div className="row no-gutter">
                    <Sidebar loggedInUser={this.props.loggedInUser}/>
                <div className="col-md-9 rightContent">
                    <ContentMain {...this.props}/>

                </div>
            </div>
        </div>
    }
}

export default AppHome
