import React, {Component} from 'react';
import {LoginFormContainer} from '../../containers'

class DemoHome extends Component {

    componentDidMount() {
        this.props.autoLogin()
    }

    render() {
        return <div></div>
    }
}

export default DemoHome
