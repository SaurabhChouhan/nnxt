import React, {Component} from 'react'
import {Link} from 'react-router-dom'


class Header extends Component {

    render() {
        return <nav key="headerNav" className="navbar navbar-default">
            <div className="container">
                <div className="navbar-header"><Link className="navbar-brand" to="/"></Link>
                    <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                            aria-expanded="false"><span
                        className="sr-only">Toggle navigation</span> <span className="icon-bar"></span> <span
                        className="icon-bar"></span> <span className="icon-bar"></span></button>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <div className="navbar-right">

                        {this.props.loggedInUser ?
                            <span className="pull-right user-icon">
                                <div className="dropdown" key={'1'}>
                                        <span className="dropdown-toggle hoverTooltip span-hover"
                                              type="button" data-toggle="dropdown"><i className="fa fa-user"><i
                                            className="fa fa-caret-down"></i></i>
                                        </span>
                                            <ul className="dropdown-menu">
                                                <li key={12}>
                                                    <a href={'/logout'}><i
                                                        className="fa fa-sign-out"></i> Logout</a>
                                                </li>
                                            </ul>
                                </div>
                            </span> :  <Link onClick={this.props.handleClick}
                                             to={'/register'}><i className="fa fa-users"></i>Register</Link>
                        }
                    </div>
                </div>
            </div>
        </nav>
    }

}

export default Header