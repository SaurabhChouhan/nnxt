import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ContentSection from './ContentSection'
import {PermissionFormContainer} from "../../containers"
import {PERMISSION_FORM} from "../componentConsts"
import {Route} from 'react-router-dom'

class ContentMain extends Component {
    constructor(props) {
        super(props)
        // All the routes that should be configured based on permissions this user has
        let routes = []
        /*
        routes.push({
            url: "/client",
            render: (props) => {
                return <ContentSection>
                    <PermissionFormContainer name={PERMISSION_FORM}/>
                </ContentSection>
            }
        })
        */

        this.state = {
            routes: routes
        }


    }

    render() {
        return <div>
            {
                this.state.routes.length > 0 &&
                <Route key={"admin_idx_route"} exact path={this.props.match.url} render={this.state.routes[0].render}/>
            }
            {
                this.state.routes.map((route, idx) => <Route key={"approute" + idx} path={'/app-home/' + route.url}
                                                             render={route.render}/>)

            }
        </div>
    }
}

ContentMain.contextTypes = {
    store: PropTypes.object
}

export default ContentMain