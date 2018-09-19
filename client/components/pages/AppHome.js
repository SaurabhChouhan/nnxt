import React, {Component} from 'react';
import {ContentMain, Sidebar} from "../sections"

class AppHome extends Component {
    render() {
        return <div className="container-fluid">
            <div className="row no-gutter">
                <Sidebar {...this.props}/>
                <div className="col-md-9 rightContent">
                    <ContentMain {...this.props}/>

                </div>
            </div>
        </div>
    }
}

export default AppHome
