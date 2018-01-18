import React from 'react';
import {Link} from 'react-router-dom'

class Tab extends React.Component {
    render() {
        return (
            <li className={this.props.isActive ? "active" : null}>
                <Link onClick={this.props.handleClick}
                      to={this.props.match.url + this.props.data.url}>{this.props.data.displayName?this.props.data.displayName:this.props.data.name}</Link>
            </li>

        );
    }
}

export default Tab;
