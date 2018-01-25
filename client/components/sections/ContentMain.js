import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ContentSection from './ContentSection'
import {ClientFormContainer} from "../../containers"
import {PERMISSION_FORM} from "../componentConsts"
import {Route} from 'react-router-dom'
import * as logger from '../../clientLogger'

class ContentMain extends Component {
    constructor(props) {
        super(props)
        logger.debug(logger.CONTENT_MAIN_LIFECYCLE, 'constructor() called: ', props)
        // All the routes that should be configured based on permissions this user has
        let routes = []

        routes.push({
            url: "/",
            render: (props) => {
                return <ContentSection>

                </ContentSection>
            }
        })


        routes.push({
            url: "/client",
            render: (props) => {
                return <ContentSection>
                    <ClientFormContainer/>
                </ContentSection>
            }
        })

        this.state = {
            routes: routes
        }
    }

    render() {
        logger.debug(logger.CONTENT_MAIN_RENDER, this.props)
        return <div>
            {
                this.state.routes.length > 0 &&
                <Route key={"admin_idx_route"} exact path={this.props.match.url} render={this.state.routes[0].render}/>
            }
            {
                this.state.routes.map((route, idx) => <Route key={"approute" + idx}
                                                             path={this.props.match.url + route.url}
                                                             render={route.render}/>)

            }
        </div>
    }
}

ContentMain.contextTypes = {
    store: PropTypes.object
}

export default ContentMain