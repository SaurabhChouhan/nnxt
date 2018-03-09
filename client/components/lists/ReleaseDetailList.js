import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import {ReleaseTaskSearchFormContainer} from '../../containers'

class ReleaseDetailList extends Component {

    constructor(props) {
        super(props);
        this.options = {
            onRowClick: this.onRowClick.bind(this)
        }
    }

    onRowClick(row) {
        this.props.taskPlanSelected(row)
        this.props.history.push("/app-home/release-task-detail")

    }

    formatDate(row) {
        if (row) {
            return moment(row).format("DD-MM-YYYY")
        }
        return ''
    }

    formatEstimatedHours(task) {
        if (task)
            return task.estimatedHours
        return 0
    }

    formatReportedHours(report) {
        if (report)
            return report.reportedHours
        return 0
    }

    formatReportedStatus(report) {
        if (report)
            return report.finalStatus
        return 'unplanned'
    }


    formateTaskName(task) {
        if (task)
            return task.name
        return ''
    }

    formatTaskPlanStartDate(planning) {
        if (planning && planning.minPlanningDate) {
            return moment(planning.minPlanningDate).format("DD-MM-YYYY")
        }
        return ''
    }

    formatTaskPlanEndDate(planning) {
        if (planning && planning.maxPlanningDate) {
            return moment(planning.maxPlanningDate).format("DD-MM-YYYY")
        }
        return ''
    }

    render() {
        let team = 0
        const {release} = this.props
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

                        <ReleaseTaskSearchFormContainer/>
                    </div>
                    <div className="col-md-12 releaseOption">
                        <div className="col-md-2 pad ">
                            <div className="releaseTeamManager"><span>Manager</span>
                            </div>
                            <div className="estimationuser tooltip"><span>M</span>
                                <p className="tooltiptext">{release.manager ? release.manager.firstName : ''}</p>
                            </div>
                        </div>
                        <div className="col-md-2 pad ">
                            <div className="releaseTeamLeader"><span> Leader</span>
                            </div>
                            <div className="estimationuser tooltip"><span>L</span>
                                <p className="tooltiptext">{release.leader ? release.leader.firstName : ''}</p></div>
                        </div>
                        <div className="col-md-8 pad ">
                            <div className="releaseTeam"><span>Team</span>
                            </div>
                            {
                                release.team.map((teamMember, index) => {
                                    return <div key={"teamMember" + index} className="estimationuser tooltip">
                                        <span>T{index + 1}</span>
                                        <p className="tooltiptext">{teamMember ? teamMember.name : ''}</p>
                                    </div>
                                })
                            }

                        </div>

                    </div>
                    <div className="estimation">
                        <BootstrapTable options={this.options} data={this.props.releasePlans}
                                        striped={true}
                                        hover={true}>
                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='created' dataFormat={this.formatDate.bind(this)}>Created</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='task'
                                               dataFormat={this.formateTaskName.bind(this)}>Task
                                Name</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='employee'>Emp./Team Name</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='flags'>Emp./Team Flag</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='task'
                                               dataFormat={this.formatEstimatedHours.bind(this)}>Est
                                Hours</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='report'
                                               dataFormat={this.formatReportedHours.bind(this)}>Reported
                                Hours</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='planning'
                                               dataFormat={this.formatTaskPlanStartDate.bind(this)}>Start Date
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='planning'
                                               dataFormat={this.formatTaskPlanEndDate.bind(this)}>End Date
                            </TableHeaderColumn>

                            <TableHeaderColumn columnTitle dataField='report'
                                               dataFormat={this.formatReportedStatus.bind(this)}>Status</TableHeaderColumn>

                        </BootstrapTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ReleaseDetailList)
