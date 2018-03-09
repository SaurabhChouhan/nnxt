import {Field, reduxForm} from 'redux-form'
import React from 'react'
import {renderText} from './fields'
import * as SC from '../../../server/serverconstants'

let ReleaseProjectSearchForm = (props) => {
    const {releaseProject} = props
    return <form onSubmit={props.handleSubmit}>
        <div className="col-md-6 pad">
            <div className="search">
                <Field name="search" className="form-control" component={renderText}
                       placeholder="Search Project Names"/>
                <button type="submit" className="btn searchBtn"><i className="fa fa-search"></i>
                </button>
            </div>
        </div>
        <div className="col-md-3">
            <div className="estimation releaseSelect">
                <select className="form-control" onChange={(status) =>
                    props.changeReleaseStatus(status.target.value)
                }>
                    <option value="all">All</option>
                    <option value={SC.STATUS_PLAN_REQUESTED}>{SC.STATUS_PLAN_REQUESTED}</option>
                    <option value={SC.STATUS_DEV_IN_PROGRESS}>{SC.STATUS_DEV_IN_PROGRESS}</option>
                    <option value={SC.STATUS_DEV_COMPLETED}>{SC.STATUS_DEV_COMPLETED}</option>
                    <option value={SC.STATUS_RELEASED}>{SC.STATUS_RELEASED}</option>
                    <option value={SC.STATUS_ISSUE_FIXING}>{SC.STATUS_ISSUE_FIXING}</option>
                    <option value={SC.STATUS_OVER}>{SC.STATUS_OVER}</option>

                </select>
            </div>
        </div>
    </form>
}

ReleaseProjectSearchForm = reduxForm({
    form: 'release-project-search'
})(ReleaseProjectSearchForm)

export default ReleaseProjectSearchForm