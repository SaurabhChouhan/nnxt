import React, {Component} from 'react'
import {Redirect, Route} from 'react-router-dom'
import {NotificationContainer} from 'react-notifications'
import {
    AdminHomeContainer,
    AppHomeContainer,
    HomeContainer,
    SuperAdminHomeContainer,
    ForgotPasswordFormContainer,
    LoginFormContainer
} from '../containers'

class AppRouter extends Component {
    render() {
        return ([<NotificationContainer key="notification"/>,
                <Route key="home_route" exact path="/" render={(props) => {

                    if (this.props.isAuthenticated && this.props.loggedInUser) {
                        if (this.props.loggedInUser.isSuperAdmin)
                            return <Redirect to="/super-admin"/>
                        else if (this.props.loggedInUser.isAdmin)
                            return <Redirect to="/admin"/>
                        else
                            return <Redirect to="/app-home"/>

                    }

                    return <HomeContainer/>

                }
                }/>,
                <Route key="login_route" exact path="/login" render={(props) => {
                    return <LoginFormContainer/>
                }
                }/>,
                <Route key="forgot_password_route" exact path="/forgot-password" render={(props) => {
                    return <ForgotPasswordFormContainer/>
                }
                }/>,
                <Route key="super_admin_route" path="/super-admin" render={(props) => {
                    return <SuperAdminHomeContainer/>
                }
                }/>,
                <Route key="admin_route" path="/admin" render={(props) => {
                    return <AdminHomeContainer/>
                }
                }/>,
                <Route key="app_home_route" path="/app-home" render={(props) => {
                    return <AppHomeContainer/>
                }
                }/>
            ]
        )
    }
}

export default AppRouter
