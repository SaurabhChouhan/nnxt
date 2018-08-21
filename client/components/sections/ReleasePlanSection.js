import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import * as U from '../../../server/utils'
import moment from 'moment'
import {
    TaskPlanListContainer,
    ReleasePlanListContainer,
    WarningListContainer,
    TaskReportListContainer,
    ReleaseDashboardSectionContainer
} from '../../containers'

class ReleasePlanSection extends Component {

    constructor(props) {
        super(props);
        this.options = {
            onRowClick: this.onRowClick.bind(this)
        }
    }

    componentDidMount() {
        console.log("ReleasePlanSection-> componentDidMount() called")
    }

    onRowClick(row) {
        this.props.history.push("/app-home/release-task-planning")
        this.props.releasePlanSelected(row, this.props.release.rolesInThisRelease)
    }

    render() {
        let team = 0
        const {release, releasePlans, loggedInUser, selectedTab} = this.props

        return (

            <div key="estimation_list" className="clearfix">

                <div className="col-md-12 releaseHeader">
                    <div className=" col-md-1 backarrow" title="Go Back">
                        <button className="btn-link" onClick={() => {
                            this.props.history.push("/app-home/release")
                            this.props.ReleaseProjectGoBack(release)
                        }}><i className="glyphicon glyphicon-arrow-left"></i></button>
                    </div>
                    <div className="col-md-3">
                        <div className="releaseTitle">
                            <span
                                title={release && release.project && release.project.name ? release.project.name : ''}>Project Name</span>
                        </div>
                        <div className="releasecontent">
                            <p>{release && release.project && release.project.name ? release.project.name + ' (' + release.name + ')' : ''}</p>
                        </div>
                    </div>
                    <div
                        className={loggedInUser && U.userHasRole(loggedInUser, SC.ROLE_MANAGER) ? "col-md-1" : "col-md-2"}>
                        <div className="releaseTitle">
                            <span
                                title={release && release.iterations[0] && release.iterations[0].devStartDate ? moment(release.iterations[0].devStartDate).format("DD-MM-YYYY") : ''}>Start Date</span>
                        </div>
                        <div className="releasecontent">
                            <p>{release && release.iterations[0] && release.iterations[0].devStartDate ? moment(release.iterations[0].devStartDate).format("DD-MM-YYYY") : ''}</p>
                        </div>
                    </div>
                    <div
                        className={loggedInUser && U.userHasRole(loggedInUser, SC.ROLE_MANAGER) ? "col-md-1" : "col-md-2"}>
                        <div className="releaseTitle">
                            <span
                                title={release && release.iterations[0] && release.iterations[0].devEndDate ? moment(release.iterations[0].devEndDate).format("DD-MM-YYYY") : ''}>End Date</span>
                        </div>
                        <div className="releasecontent">
                            <p>{release && release.iterations[0] && release.iterations[0].devEndDate ? moment(release.iterations[0].devEndDate).format("DD-MM-YYYY") : ''}</p>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="releaseTitle">
                            <span
                                title={release && release.iterations[0] && release.iterations[0].clientReleaseDate ? moment(release.iterations[0].clientReleaseDate).format("DD-MM-YYYY") : ''}>Release Date</span>
                        </div>
                        <div className="releasecontent">
                            <p>{release && release.iterations[0] && release.iterations[0].clientReleaseDate ? moment(release.iterations[0].clientReleaseDate).format("DD-MM-YYYY") : ''}</p>
                        </div>
                    </div>
                    {loggedInUser && loggedInUser._id && release.manager._id && loggedInUser._id.toString() === release.manager._id.toString() ?
                        <div className="col-md-2">
                            <button className=" btn btn-custom customBtn " type="button"
                                    onClick={() => {
                                        this.props.openUpdateReleaseDatesForm(release)
                                    }}>Update Dates
                            </button>
                        </div> : null
                    }

                    <div className=" col-md-2 releasefileoption">
                        <ul className="list-unstyled">
                            <li><a href="#"> <i className="fa fa-file-pdf-o"></i></a></li>
                            <li><a href="#"> <i className="fa fa-file-word-o"></i></a></li>
                            <li><a href="#"> <i className=" fa fa-file-excel-o"></i></a></li>
                        </ul>
                    </div>

                </div>
                <div className="col-md-12">
                    <div className="col-md-12">
                        <div className="col-md-2 pad ">
                            <div className="releaseTeamManager"><span>Manager</span>
                            </div>
                            <div className="estimationuser tooltip"><span>M</span>
                                <p className="tooltiptext">{release && release.manager && release.manager.firstName ? release.manager.firstName : ''}</p>
                            </div>
                        </div>
                        <div className="col-md-2 pad ">
                            <div className="releaseTeamLeader"><span> Leader</span>
                            </div>
                            <div className="estimationuser tooltip"><span>L</span>
                                <p className="tooltiptext">{release && release.leader && release.leader.firstName ? release.leader.firstName : ''}</p>
                            </div>
                        </div>
                        <div className="col-md-5 pad ">
                            <div className="releaseTeam"><span>Team</span>
                            </div>
                            {
                                release && release.team && Array.isArray(release.team) && release.team.length ? release.team.map((teamMember, index) =>
                                    <div key={"teamMember" + index} className="estimationuser tooltip">
                                        <span>T{index + 1}</span>
                                        <p className="tooltiptext">{teamMember ? teamMember.name : ''}</p>
                                    </div>) : <span></span>
                            }

                        </div>
                        <div className="col-md-3">
                            <div className="col-md-6  releaseClock  releaseProjectPlannedHours">
                                <i className="fa fa-clock-o "
                                   title="Estimated Hours"></i><b>{release.iterations[0] ? release.iterations[0].estimatedHours : ''}
                                Hrs</b>
                            </div>
                            <div className="col-md-6  releaseClock releasePlannedHrs releaseProjectPlannedHours">
                                <i className="fa fa-clock-o "
                                   title="Planned Hours"></i><b>{release.iterations[0] ? release.iterations[0].plannedHours : ''}
                                Hrs</b>
                            </div>
                        </div>

                    </div>
                    <div className="col-md-12 pad">

                        <div className="container container-width">
                            <ul className="nav nav-tabs">
                                <li className={selectedTab === SC.RELEASE_DASHBOARD_TAB ? 'active' : ''}>
                                    <a
                                        data-toggle="tab"
                                        className={selectedTab === SC.RELEASE_DASHBOARD_TAB ? "btn  btn-link btn-size" : "btn  btn-link btn-size"}
                                        onClick={() => {
                                            this.props.tabSelected(SC.RELEASE_DASHBOARD_TAB)
                                            this.props.getDashboardData(release)
                                        }}>Dashboard
                                    </a>
                                </li>
                                <li className={selectedTab === SC.RELEASE_PLAN_TAB ? 'active' : ''}>
                                    <a
                                        data-toggle="tab"
                                        className={selectedTab === SC.RELEASE_PLAN_TAB ? "btn  btn-link btn-size" : "btn  btn-link btn-size"}
                                        onClick={() => {
                                            this.props.tabSelected(SC.RELEASE_PLAN_TAB)
                                        }}>Release Plans
                                    </a>
                                </li>
                                <li className={selectedTab === SC.RELEASE_WARNINGS_TAB ? 'active' : ''}>
                                    <a
                                        data-toggle="tab"
                                        className={selectedTab === SC.RELEASE_WARNINGS_TAB ? "btn  btn-link btn-size" : "btn  btn-link btn-size"}
                                        onClick={() => {
                                            this.props.tabSelected(SC.RELEASE_WARNINGS_TAB)
                                        }}>Warnings
                                    </a>
                                </li>
                                <li className={selectedTab === SC.RELEASE_TASK_PLANS_TAB ? 'active' : ''}>
                                    <a
                                        data-toggle="tab"
                                        className={selectedTab === SC.RELEASE_TASK_PLANS_TAB ? "btn btn-link btn-size " : "btn btn-link btn-size "}
                                        onClick={() => {
                                            this.props.tabSelected(SC.RELEASE_TASK_PLANS_TAB)
                                        }}>Task Plans
                                    </a>
                                </li>
                                <li className={selectedTab === SC.RELEASE_REPORT_TAB ? 'active' : ''}>
                                    <a
                                        data-toggle="tab"
                                        className={selectedTab === SC.RELEASE_REPORT_TAB ? "btn btn-link btn-size " : "btn btn-link btn-size "}
                                        onClick={() => {
                                            this.props.tabSelected(SC.RELEASE_REPORT_TAB)
                                        }}>Task Report
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {selectedTab === SC.RELEASE_DASHBOARD_TAB && <ReleaseDashboardSectionContainer release={release}/>}
                {selectedTab === SC.RELEASE_PLAN_TAB && <ReleasePlanListContainer release={release}/>}
                {selectedTab === SC.RELEASE_WARNINGS_TAB && <WarningListContainer release={release}/>}
                {selectedTab === SC.RELEASE_TASK_PLANS_TAB && <TaskPlanListContainer release={release}/>}
                {selectedTab === SC.RELEASE_REPORT_TAB && <TaskReportListContainer release={release}/>}

            </div>

        )
    }
}

export default withRouter(ReleasePlanSection)
