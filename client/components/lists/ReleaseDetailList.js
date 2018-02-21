import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'

class ReleaseDetailList extends Component {

    constructor(props) {
        super(props);
        this.options = {
            onRowClick: this.onRowClick.bind(this)
        }

    }

    onRowClick(row) {
        this.props.history.push("/app-home/release-project-detail")

    }


    formatStatus(status) {
        return ''
    }

    formatStartDate(row) {
        if (row) {
            return moment(row.devStartDate).format("DD-MM-YYYY")
        }
        return ''

    }

    formateTaskName(task) {
        if (task)
            return task.name
        return ''
    }


    render() {
        let team = 0
        const {release} = this.props

        console.log("release", this.props.release)
        return (


            <div key="estimation_list" className="clearfix">

                <div className="col-md-12 releaseHeader">
                    <div className=" col-md-1 backarrow">
                        <a href=""><i className="glyphicon glyphicon-arrow-left"></i></a>
                    </div>
                    <div className="col-md-3">
                        <div className="releaseTitle">
                            <span>Project Name</span></div>
                        <div className="releasecontent">
                            <p>{release.project ? release.project.name : ''}</p>
                        </div>
                    </div>
                    {/* <div className="col-md-3">
                            <div className="releaseTitle">
                                <span>Project Description</span></div>
                            <div className="releasecontent">
                                <p>Accusation Nation....(Read More)</p>
                            </div>
                        </div>*/}
                    <div className="col-md-2">
                        <div className="releaseTitle">
                            <span>Start Date</span></div>
                        <div className="releasecontent">
                            <p>{release.initial ? moment(release.initial.devStartDate).format("DD-MM-YYYY") : ''}</p>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="releaseTitle">
                            <span>End Date</span></div>
                        <div className="releasecontent">
                            <p>{release.initial ? moment(release.initial.devEndDate).format("DD-MM-YYYY") : ''}</p>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="releaseTitle">
                            <span>Release Date</span></div>
                        <div className="releasecontent">
                            <p>{release.initial ? moment(release.initial.clientReleaseDate).format("DD-MM-YYYY") : ''}</p>
                        </div>
                    </div>
                    <div className=" col-md-2 releasefileoption">
                        <ul className="list-unstyled">
                            <li><a href=""> <i className="fa fa-file-pdf-o"></i></a></li>
                            <li><a href=""> <i className="fa fa-file-word-o"></i></a></li>
                            <li><a href=""> <i className=" fa fa-file-excel-o"></i></a></li>
                        </ul>
                    </div>

                </div>
                <div className="col-md-12">
                    <div className="col-md-12 releaseOption">
                        <div className="col-md-6 ">
                            <div className="searchRelease">
                                <input type="text" className="form-control" placeholder="Search Features/Tasks"/>
                                <button type="submit" className="btn searchBtn"><i className="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="releaseSelect">
                                <select className="form-control" onChange={(flag) =>
                                    this.props.changeReleaseFlag(flag.target.value)
                                }>
                                    <option value="all">All Flags</option>
                                    <option value={SC.FLAG_UNPLANNED}>{SC.FLAG_UNPLANNED}</option>
                                    <option value={SC.FLAG_EMPLOYEE_ON_LEAVE}>{SC.FLAG_EMPLOYEE_ON_LEAVE}</option>
                                    <option value={SC.FLAG_DEV_DATE_MISSED}>{SC.FLAG_DEV_DATE_MISSED}</option>
                                    <option value={SC.FLAG_HAS_UNREPORTED_DAYS}>{SC.FLAG_HAS_UNREPORTED_DAYS}</option>
                                    <option
                                        value={SC.FLAG_PENDING_AFTER_END_DATE}>{SC.FLAG_PENDING_AFTER_END_DATE}</option>
                                    <option
                                        value={SC.FLAG_COMPLETED_BEFORE_END_DATE}>{SC.FLAG_COMPLETED_BEFORE_END_DATE}</option>

                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="releaseSelect">
                                <select className="form-control" onChange={(status) =>
                                    this.props.changeReleseStatus(status.target.value)
                                }>
                                    <option value="all">All Status</option>
                                    <option value={SC.STATUS_PLAN_REQUESTED}>{SC.STATUS_PLAN_REQUESTED}</option>
                                    <option value={SC.STATUS_DEV_IN_PROGRESS}>{SC.STATUS_DEV_IN_PROGRESS}</option>
                                    <option value={SC.STATUS_DEV_COMPLETED}>{SC.STATUS_DEV_COMPLETED}</option>
                                    <option value={SC.STATUS_RELEASED}>{SC.STATUS_RELEASED}</option>
                                    <option value={SC.STATUS_ISSUE_FIXING}>{SC.STATUS_ISSUE_FIXING}</option>
                                    <option value={SC.STATUS_OVER}>{SC.STATUS_OVER}</option>

                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 releaseOption">
                        <div className="col-md-4 pad ">
                            <div className="releaseTeamManager"><span>Manager</span>
                            </div>
                            <div className="estimationuser tooltip"><span>AB</span>
                                <p className="tooltiptext">{release.manager ? release.manager.firstName : ''}</p></div>
                            <div className="estimationuser"><span>CD</span></div>
                            <div className="estimationuser"><span>EF</span></div>
                            <div className="estimationuser"><span>GH</span></div>


                        </div>
                        <div className="col-md-3 pad ">
                            <div className="releaseTeamManager"><span> Leader</span>
                            </div>
                            <div className="estimationuser tooltip"><span>AB</span>
                                <p className="tooltiptext">{release.leader ? release.leader.firstName : ''}</p></div>
                            <div className="estimationuser"><span>CD</span></div>
                            <div className="estimationuser"><span>EF</span></div>
                            <div className="estimationuser"><span>GH</span></div>


                        </div>
                        <div className="col-md-5 pad ">
                            <div className="releaseTeam"><span>TeamMember</span>
                            </div>

                            <div className="estimationuser tooltip"><span>AB</span>
                                <p className="tooltiptext">{release.team ? release.team[team].name : ''}</p></div>
                            <div className="estimationuser"><span>CD</span></div>
                            <div className="estimationuser"><span>EF</span></div>
                            <div className="estimationuser"><span>GH</span></div>
                            <div className="estimationuser"><span>IJ</span></div>
                            <div className="estimationuser"><span>KL</span></div>

                        </div>

                    </div>
                    <div className="estimation">
                        <BootstrapTable options={this.options} data={this.props.releasePlans}
                                        striped={true}
                                        hover={true}>
                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='initial'
                                               dataFormat={this.formatStartDate.bind(this)}>Start
                                Date</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='task'
                                               dataFormat={this.formateTaskName.bind(this)}>Task
                                Name</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='employee'>Emp. Name</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='flag'>Emp. Flag</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='estimated-hour'>Est Hours</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='status'>Status</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='requested-hour'>Requested
                                Hours</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ReleaseDetailList)
