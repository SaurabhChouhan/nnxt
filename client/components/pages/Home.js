import React, {Component} from 'react';
import Header from '../sections/Header'
import LoginFormContainer from '../../containers/forms/LoginFormContainer'

class AdminHome extends Component {
    render() {
        return ([<Header {...this.props}/>, <div id="login"><LoginFormContainer/></div>])
    }
}

export default AdminHome
