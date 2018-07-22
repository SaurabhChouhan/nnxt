import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import * as SC from '../../../server/serverconstants'
import * as A from '../../actions'
import * as COC from '../componentConsts'

const SidebarSection = (props) => {
    let roles = []
    if (props && props.loggedInUser && props.loggedInUser.roleNames && props.loggedInUser.roleNames.length)
        roles = props.loggedInUser.roleNames

    return <section className="sidebar">
        <div className="clearfix">
            <div className="sidebarContent">
                <div className="col-md-12 pad">
                    <ul className="list-unstyled">
                        {
                            (roles.indexOf('Manager') > -1 || roles.indexOf('Leader') > -1 ||
                                roles.indexOf('Developer') > -1) &&
                            <li><Link to="/app-home/calendar" onClick={() => {
                                props.dispatch(A.getAllTaskPlansFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.CALENDAR_TASK_PAGE))

                            }}>Calendar</Link></li>
                        }

                        {
                            (roles.indexOf('Manager') > -1 || roles.indexOf('Leader') > -1) &&
                            <li><Link to="/app-home/release" onClick={() => {
                                props.dispatch(A.getAllReleasesFromServer(SC.ALL))
                                props.dispatch(A.showComponentHideOthers(COC.RELEASE_LIST))

                            }}>Release</Link></li>
                        }

                        {
                            (roles.indexOf('Manager') > -1 || roles.indexOf('Leader') > -1 ||
                                roles.indexOf('Developer') > -1) &&
                            <li><Link to="/app-home/reporting" onClick={() => {
                                props.dispatch(A.getUserReleasesFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.REPORTING_TASK_PAGE))

                            }}>Reporting</Link></li>
                        }

                        {
                            (roles.indexOf('Negotiator') > -1 || roles.indexOf('Estimator') > -1) &&
                            <li><Link to="/app-home/estimation" onClick={() => {
                                props.dispatch(A.getAllEstimationsFromServer(SC.ALL, SC.ALL))
                                props.dispatch(A.getAllProjectsUserEstimationsFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.ESTIMATION_LIST))

                            }}>Estimation</Link></li>
                        }

                        {
                            roles.indexOf('Negotiator') > -1 &&
                            <li><Link to="/app-home/client" onClick={() => {
                                props.dispatch(A.getAllClientsFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.CLIENT_LIST))

                            }}>Client</Link></li>
                        }

                        {
                            roles.indexOf('Negotiator') > -1 &&
                            <li><Link to="/app-home/projects" onClick={() => {
                                props.dispatch(A.getAllClientsFromServer())
                                props.dispatch(A.getAllProjectsFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.PROJECT_LIST))
                            }}>Projects</Link></li>
                        }

                        {
                            roles.indexOf('Negotiator') > -1 &&
                            <li><Link to="/app-home/technology" onClick={() => {
                                props.dispatch(A.getAllTechnologiesFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.TECHNOLOGIES_LIST))

                            }}>Technology</Link></li>
                        }

                        {
                            (roles.indexOf('Manager') > -1 || roles.indexOf('Leader') > -1 ||
                                roles.indexOf('Developer') > -1) &&
                            <li><Link to="/app-home/leave" onClick={() => {
                                props.dispatch(A.getAllLeavesFromServer(SC.ALL))
                                props.dispatch(A.getAllLeaveTypesFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.LEAVE_LIST))
                            }}>Leave</Link></li>
                        }

                        {
                            roles.indexOf('Top Management') > -1 &&
                            <li><Link to="/app-home/attendance" onClick={() => {
                                props.dispatch(A.getAttendanceSettingFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.ATTENDANCE_SETTING_FORM))

                            }}>Attendance Setting</Link></li>
                        }

                    </ul>
                </div>
            </div>
        </div>
    </section>
}

export default connect()(SidebarSection)