import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import * as SC from '../../../server/serverconstants'
import * as A from '../../actions'
import * as COC from '../componentConsts'
import * as U from '../../../server/utils'
import { initialize } from 'redux-form'

const SidebarSection = (props) => {
    let roles = []
    if (props && props.loggedInUser && props.loggedInUser.roleNames && props.loggedInUser.roleNames.length)
        roles = props.loggedInUser.roleNames

    return <section className="sidebar">
        <div className="clearfix">
            <div className="sidebarContent">
                <div className="col-md-12 pad">
                    <ul className="list-unstyled">
                        {/*
                            (roles.indexOf(SC.ROLE_MANAGER) > -1 || roles.indexOf(SC.ROLE_LEADER) > -1) &&
                            <li><Link to="/app-home/dashboard" onClick={() => {
                                props.dispatch(A.showComponentHideOthers(COC.DASHBOARD_SECTION))
                                props.dispatch(A.getUserReleasesFromServer(SC.ALL)).then(releases => {
                                    console.log("inside then of get release from server ", releases)
                                    if (releases && releases.length) {
                                        props.dispatch(A.setReleaseID(releases[0]._id))
                                        props.dispatch(A.getReleaseForDashboard(releases[0]._id))
                                    }
                                })
                            }}>Dashboard</Link></li>
                        */}
                        {
                            (roles.indexOf(SC.ROLE_TOP_MANAGEMENT) > -1) &&
                            <li><Link to="/app-home/company" onClick={() => {
                                props.dispatch(A.showComponentHideOthers(COC.COMPANY_SECTION))
                                props.dispatch(A.getAllDeveloperFromServer())
                                props.dispatch(initialize('developer-Schedule', {
                                    employeeID: SC.ALL
                                }))

                            }}>Company</Link></li>
                        }
                        {
                            (roles.indexOf(SC.ROLE_TOP_MANAGEMENT) > -1 || roles.indexOf(SC.ROLE_LEADER) > -1 || roles.indexOf(SC.ROLE_MANAGER) > -1) &&
                            <li><Link to="/app-home/billing" onClick={() => {
                                props.dispatch(A.getAllClientsFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.BILLING_SECTION))
                            }}>Billing</Link></li>
                        }
                        {
                            (roles.indexOf(SC.ROLE_MANAGER) > -1 || roles.indexOf(SC.ROLE_LEADER) > -1 ||
                                roles.indexOf('Developer') > -1) &&
                            <li><Link to="/app-home/calendar" onClick={() => {
                                props.dispatch(A.getAllTaskPlansFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.CALENDAR_TASK_PAGE))

                            }}>Calendar</Link></li>
                        }
                        {

                            (roles.indexOf(SC.ROLE_MANAGER) > -1 || roles.indexOf(SC.ROLE_LEADER) > -1) &&
                            <li><Link to="/app-home/release" onClick={() => {
                                props.dispatch(A.getAllActiveClientsFromServer())
                                props.dispatch(A.getAllProjectsFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.RELEASE_LIST))
                            }}>Release</Link></li>
                        }
                        {
                            (roles.indexOf(SC.ROLE_MANAGER) > -1 || roles.indexOf(SC.ROLE_LEADER) > -1 ||
                                roles.indexOf(SC.ROLE_DEVELOPER) > -1 || roles.indexOf(SC.ROLE_NON_PROJECT_DEVELOPER) > -1) &&
                            <li><Link to="/app-home/reporting" onClick={() => {
                                //props.dispatch(A.getUserReleasesFromServer(SC.ALL))
                                /*on reporting click by default all task plans and projects will be there with params
                                releaseID,
                                 * @param releaseID - releaseId by default all release will be fetched
                                 * @param nowString - Current Date Of Indian Time-ZOne
                                 * @param 'planned' - release-plan iteration type
                                 * @param task status - 'all'
                                 */
                                props.dispatch(A.getReportingTasksForDate(SC.ALL, U.getNowStringInIndia(), SC.ITERATION_TYPE_PLANNED, SC.ALL))
                                props.dispatch(A.setReleaseID(SC.ALL))
                                props.dispatch(A.setReportDate(U.getNowStringInIndia()))
                                props.dispatch(A.setReportedStatus(SC.ALL))
                                props.dispatch(A.setIterationType(SC.ITERATION_TYPE_PLANNED))
                                props.dispatch(A.showComponentHideOthers(COC.REPORTING_TASK_PAGE))

                            }}>Reporting</Link></li>
                        }
                        {
                            (roles.indexOf(SC.ROLE_NEGOTIATOR) > -1 || roles.indexOf(SC.ROLE_ESTIMATOR) > -1) &&
                            <li><Link to="/app-home/estimation" onClick={() => {
                                props.dispatch(A.getAllEstimationsFromServer(SC.ALL, SC.ALL))
                                props.dispatch(A.getAllProjectsUserEstimationsFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.ESTIMATION_LIST))

                            }}>Estimation</Link></li>
                        }

                        {
                            roles.indexOf(SC.ROLE_TOP_MANAGEMENT) > -1 &&
                            <li><Link to="/app-home/client" onClick={() => {
                                props.dispatch(A.getAllClientsFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.CLIENT_LIST))

                            }}>Client</Link></li>
                        }

                        {
                            roles.indexOf(SC.ROLE_NEGOTIATOR) > -1 &&
                            <li><Link to="/app-home/projects" onClick={() => {
                                props.dispatch(A.getAllClientsFromServer())
                                props.dispatch(A.getAllProjectsFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.PROJECT_LIST))
                            }}>Projects</Link></li>
                        }


                        {
                            roles.indexOf(SC.ROLE_NEGOTIATOR) > -1 &&
                            <li><Link to="/app-home/modules" onClick={() => {
                                props.dispatch(A.getAllProjectsFromServer())
                                props.dispatch(A.getAllModulesFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.MODULE_LIST))
                            }}>Modules</Link></li>
                        }


                        {
                            roles.indexOf(SC.ROLE_NEGOTIATOR) > -1 &&
                            <li><Link to="/app-home/technology" onClick={() => {
                                props.dispatch(A.getAllTechnologiesFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.TECHNOLOGIES_LIST))

                            }}>Technology</Link></li>
                        }

                        {
                            (roles.indexOf(SC.ROLE_MANAGER) > -1 || roles.indexOf(SC.ROLE_LEADER) > -1 ||
                                roles.indexOf(SC.ROLE_DEVELOPER) > -1 || roles.indexOf(SC.ROLE_NON_PROJECT_DEVELOPER) > -1 || roles.indexOf(SC.ROLE_TOP_MANAGEMENT) > -1) &&
                            <li><Link to="/app-home/leave" onClick={() => {
                                props.dispatch(A.getAllLeavesFromServer(SC.ALL))
                                props.dispatch(A.getAllLeaveTypesFromServer())
                                props.dispatch(A.showComponentHideOthers(COC.LEAVE_LIST))
                            }}>Leave</Link></li>
                        }

                        {
                            roles.indexOf(SC.ROLE_TOP_MANAGEMENT) > -1 &&
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