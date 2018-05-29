import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import * as SC from '../../../server/serverconstants'
import _ from 'lodash'
import {
    ReleaseDeveloperFilterFormContainer,
    ReleaseDeveloperScheduleFormContainer,
    ReleaseDevelopersSchedulesContainer,
    ReleaseTaskPlanningShiftFormContainer,
} from '../../containers'

moment.locale('en')
momentLocalizer()

class ReleaseTaskPlanningPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projectUsersOnly: true
        }
        this.projectUsersOnly = this.projectUsersOnly.bind(this);
    }

    deleteCellButton(cell, row, enumObject, rowIndex) {
        let now = new Date()
        let nowMomentString = moment(now).format(SC.DATE_FORMAT)
        let nowMoment = moment(nowMomentString)
        let planningMoment = moment(row.planningDateString)
        if (planningMoment.isBefore(nowMoment))
            return ''
        else return (<button className=" pull-left btn btn-custom" type="button"
                             onClick={() => {
                                 this.props.deleteTaskPlanningRow(row)
                             }}>
            <i className="fa fa-trash"></i>
        </button>)
    }

    projectUsersOnly(data) {
        let checkBox = document.getElementById("projectUsersOnlyCheck");
        if (checkBox.checked) {
            this.setState({projectUsersOnly: true})
        } else this.setState({projectUsersOnly: false})

    }

    actionCellButton(cell, row, enumObject, rowIndex) {
        if (row && row.canMerge)
            return (<button className="pull-left btn btn-custom customBtn" type="button"
                            onClick={() => {
                                this.props.openMergeTaskPlanningForm(row)
                            }}>Merge</button>)
        else return ''
    }

    formatPlanningDate(row) {
        if (row && !_.isEmpty(row)) {
            return row
        }
        return ''
    }

    formatPlannedHours(planning) {
        if (planning && planning.plannedHours)
            return Number(planning.plannedHours)
        else return 0
    }

    formatDeveloper(developer) {
        if (developer && developer.name) {
            return developer.name
        }
        return ''
    }

    formatReport(report) {
        if (report && report.status) {
            return report.status
        }
        return ''
    }

    formatTaskName(task) {
        if (task && task.name) {
            return task.name
        }
        return ''
    }

    render() {

        const {releasePlan, taskPlans, developerPlans, expanded} = this.props
        return (
            <div>
                <div className="col-md-8 pad">
                    <div className="col-md-12 estimateheader">
                        <div className="col-md-8 pad">
                            <div className="backarrow">
                                <h5>
                                    <button className="btn-link" title="Go Back" onClick={() => {
                                        this.props.history.push("/app-home/release-project-tasks")
                                        this.props.ReleaseTaskGoBack(releasePlan)
                                    }}><i className="glyphicon glyphicon-arrow-left"></i></button>
                                    <b title={releasePlan && releasePlan.task ? releasePlan.task.name : ''}>{releasePlan.task ? releasePlan.task.name : ''} </b>
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-2  releaseClock ">
                            <i className="fa fa-clock-o "
                               title="Estimated Hours"></i><b>{releasePlan && releasePlan.task ? releasePlan.task.estimatedHours : ''}
                            Hrs</b>
                        </div>
                        <div className="col-md-2  releaseClock releasePlannedHrs">
                            <i className="fa fa-clock-o "
                               title="Planned Hours"></i><b>{releasePlan && releasePlan.planning ? releasePlan.planning.plannedHours : ''}
                            Hrs</b>
                        </div>
                    </div>
                    <div className="col-md-12 ">
                        <div className={expanded ? "expanded-release-content" : 'release-content'}>
                            <p className="task-description">{releasePlan && releasePlan.task ? releasePlan.task.description : ''}</p>
                            {expanded ? <label className="div-hover releaseReadLessLabel releaseReadLessLabelClick"
                                               onClick={() => this.props.expandDescription(false)}>...Read
                                Less</label> : <label className="div-hover releaseReadMoreLabel"
                                                      onClick={() => this.props.expandDescription(true)}>...Read
                                More</label>}
                        </div>
                    </div>
                    <div className="col-md-12 releasePlanChkBtn">
                        <div className="col-md-4 planchk">
                            <input name="projectUsersOnly"
                                   type="checkbox"
                                   id="projectUsersOnlyCheck"
                                   checked={this.state && this.state.projectUsersOnly ? true : false}
                                   onChange={() => {
                                       this.projectUsersOnly(this)
                                   }}/>
                            <span>Project Users Only</span>
                        </div>
                        <div className="col-md-4 planBtn">
                            <button type="button" className="btn taskbtn"
                                    onClick={() => this.props.showTaskPlanningCreationForm(releasePlan, this.state.projectUsersOnly)}>
                                <i className="fa fa-plus-circle"></i>
                                Plan Task
                            </button>
                        </div>

                    </div>
                    <div className="col-md-12">
                        <div className="estimation">
                            <BootstrapTable options={this.options} data={taskPlans}
                                            striped={true}
                                            hover={true}>
                                <TableHeaderColumn columnTitle isKey dataField='_id'
                                                   hidden={true}>ID</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planningDateString'
                                                   dataFormat={this.formatPlanningDate.bind(this)}>Date</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planning'
                                                   dataFormat={this.formatPlannedHours.bind(this)}>Planned
                                    Hours</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='employee'
                                                   dataFormat={this.formatDeveloper.bind(this)}>Developer</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='report'
                                                   dataFormat={this.formatReport.bind(this)}>Reported
                                    Status</TableHeaderColumn>
                                <TableHeaderColumn columnTitle width="8%" dataField='button'
                                                   dataFormat={this.deleteCellButton.bind(this)}><i
                                    className="fa fa-trash"></i>
                                </TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                    </div>
                    <div>
                        <ReleaseTaskPlanningShiftFormContainer/>
                    </div>
                    <div>
                        <ReleaseDeveloperFilterFormContainer/>
                    </div>
                    <div className="col-md-12">
                        <div className="estimation">
                            <BootstrapTable options={this.options} data={developerPlans}
                                            striped={true}
                                            hover={true}>
                                <TableHeaderColumn columnTitle isKey dataField='_id'
                                                   hidden={true}>ID</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planningDateString'
                                                   dataFormat={this.formatPlanningDate.bind(this)}>
                                    Date
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='task'
                                                   dataFormat={this.formatTaskName.bind(this)}>
                                    Task Name
                                </TableHeaderColumn>
                                <TableHeaderColumn width="25%" columnTitle dataField='employee'
                                                   dataFormat={this.formatDeveloper.bind(this)}>
                                    Developer
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planning'
                                                   dataFormat={this.formatPlannedHours.bind(this)}>
                                    Planned Effort
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='report'
                                                   dataFormat={this.formatReport.bind(this)}>
                                    Reported
                                </TableHeaderColumn>
                                <TableHeaderColumn width="12%" dataField='button'
                                                   dataFormat={this.actionCellButton.bind(this)}>
                                    <i className="fa fa-plus"></i>
                                </TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 estimationsection pad">
                    <div>
                        <ReleaseDeveloperScheduleFormContainer/>
                    </div>
                    <ReleaseDevelopersSchedulesContainer/>
                </div>
            </div>
        )
    }
}

ReleaseTaskPlanningPage.defaultProps = {
    expanded: false
}
export default withRouter(ReleaseTaskPlanningPage)
