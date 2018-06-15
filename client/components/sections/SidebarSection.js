import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import * as A from '../../actions'
import * as COC from '../componentConsts'

const SidebarSection = (props) => <section className="sidebar">
    <div className="clearfix">
        <div className="sidebarContent">
            <div className="col-md-12 pad">
                <ul className="list-unstyled">
                    <li><Link to="/app-home/client" onClick={() => {
                        props.dispatch(A.getAllClientsFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.CLIENT_LIST))

                    }}>Client</Link></li>

                    <li><Link to="/app-home/projects" onClick={() => {
                        props.dispatch(A.getAllClientsFromServer())
                        props.dispatch(A.getAllProjectsFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.PROJECT_LIST))

                    }}>Projects</Link></li>

                    <li><Link to="/app-home/technology" onClick={() => {
                        props.dispatch(A.getAllTechnologiesFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.TECHNOLOGIES_LIST))

                    }}>Technology</Link></li>

                    <li><Link to="/app-home/estimation" onClick={() => {
                        props.dispatch(A.getAllEstimationsFromServer('all', 'all'))
                        props.dispatch(A.getAllProjectsFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.ESTIMATION_LIST))

                    }}>Estimation</Link></li>

                    <li><Link to="/app-home/leave" onClick={() => {
                        props.dispatch(A.getAllLeavesFromServer('all'))
                        props.dispatch(A.getAllLeaveTypesFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.LEAVE_LIST))

                    }}>Leave</Link></li>

                    <li><Link to="/app-home/attendance" onClick={() => {
                        props.dispatch(A.getAttendanceSettingFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.ATTENDANCE_SETTING_FORM))

                    }}>Attendance Setting</Link></li>

                    <li><Link to="/app-home/release" onClick={() => {
                        props.dispatch(A.getAllReleasesFromServer("all"))
                        props.dispatch(A.showComponentHideOthers(COC.RELEASE_LIST))

                    }}>Release</Link></li>

                    <li><Link to="/app-home/calendar" onClick={() => {
                        props.dispatch(A.getAllTaskPlansFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.CALENDAR_TASK_PAGE))

                    }}>Calendar</Link></li>

                    <li><Link to="/app-home/reporting" onClick={() => {
                        props.dispatch(A.getUserReleasesFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.REPORTING_TASK_PAGE))

                    }}>Reporting</Link></li>

                </ul>
            </div>
        </div>
    </div>
</section>

export default connect()(SidebarSection)