import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import momentTZ from 'moment-timezone'
import * as SC from '../../../server/serverconstants'
import {ReleaseDeveloperFilterFormContainer, ReleaseDeveloperPlanShiftFormContainer} from '../../containers'

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
        let nowMoment = momentTZ.tz(now, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0)
        if (momentTZ.tz(row.planningDate, SC.DATE_FORMAT, SC.DEFAULT_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).isBefore(nowMoment))
            return ''
        else return (<button className="glyphicon glyphicon-trash pull-left btn btn-custom" type="button"
                        onClick={() => {
                            this.props.deleteTaskPlanningRow(row)
                        }}></button>)
    }

    projectUsersOnly(data) {
        let checkBox = document.getElementById("projectUsersOnlyCheck");
        // console.log("checkBox", checkBox)
        if (checkBox.checked) {
            this.setState({projectUsersOnly: true})
        } else this.setState({projectUsersOnly: false})

    }

    actionCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="pull-left btn btn-custom" type="button"
                        onClick={() => {
                            this.props.openMergeTaskPlanningForm(row)
                        }}>Merge</button>)
    }

    formatPlanningDate(row) {
        if (row) {
            return momentTZ.tz(row, SC.DATE_FORMAT, SC.INDIAN_TIMEZONE).hour(0).minute(0).second(0).millisecond(0).format("DD-MM-YYYY")
        }
        return ''
    }

    formatPlannedHours(planning) {
        if (planning)
            return planning.plannedHours
        return 0
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
        // const {release} = this.props
        const {taskPlan, taskPlans, developerPlans} = this.props
        return (
            <div>
                <div className="col-md-8 pad">
                    <div className="col-md-12 estimateheader">
                        <div className="col-md-8 pad">
                            <div className="backarrow">

                                <h5>
                                    <button className="btn-link" title="Go Back" onClick={() => {
                                        this.props.history.push("/app-home/release-project-tasks")
                                        this.props.ReleaseTaskGoBack()
                                    }}><i className="glyphicon glyphicon-arrow-left"></i></button>
                                    <b title={taskPlan.task ? taskPlan.task.name : ''}>{taskPlan.task ? taskPlan.task.name : ''} </b>
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-4  releaseClock ">
                            <i className="fa fa-clock-o "
                               title="Estimated Hours"></i><b>{taskPlan.task ? taskPlan.task.estimatedHours : ''}
                            Hrs</b>
                        </div>
                    </div>
                    <div className="col-md-12 ">
                        <div className="releasecontent">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ipsum sem, interdum et
                                est id, pellentesque tempus leo. Nulla sagittis quam sapien, nec egestas. Nulla arcu
                                odio.(Read More...)</p>
                        </div>
                    </div>
                    <div className="col-md-12">
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
                                    onClick={() => this.props.showTaskPlanningCreationForm(taskPlan, this.state.projectUsersOnly)}>
                                <i
                                className="fa fa-plus-circle"></i>
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
                                <TableHeaderColumn columnTitle dataField='planningDate'
                                                   dataFormat={this.formatPlanningDate.bind(this)}>Date</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planning'
                                                   dataFormat={this.formatPlannedHours.bind(this)}>Est
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
                        <ReleaseDeveloperPlanShiftFormContainer/>
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
                                <TableHeaderColumn columnTitle dataField='planningDate'
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
                    <div className="col-md-12 repositoryHeading RepositorySideHeight">
                        <div className="col-md-10 pad">
                            <h5><b>Developers Schedule</b></h5>
                        </div>
                        <div className="col-md-2 pad text-right">
                            <div className="searchReleasePlan">
                                <a href=""><i className="glyphicon glyphicon-search "></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 planSchedule">
                        <div className="col-md-3">
                            <input type="text" className="form-control " placeholder="From"/>
                        </div>
                        <div className="col-md-3">
                            <input type="text" className="form-control " placeholder="To"/>
                        </div>
                        <div className="col-md-6 planchkSchedule">
                            <input type="checkbox" name="" value="" className="checkbxInput"/><span>Relative free on days </span>
                        </div>
                    </div>
                    <div className="col-md-12 releaseSchedule">
                        <div className="repository releaseDevInfo">
                            <div className="releaseDevHeading">
                                <h5>Developer1</h5><i className="glyphicon glyphicon-resize-full pull-right"></i><span
                                className="pull-right">26-feb to 29-feb</span>
                            </div>
                            <div className="releaseDayRow">
                                <div className="releaseDayCell"><h5>Sun</h5></div>
                                <div className="releaseDayCell"><h5>Mon</h5>
                                    <div className="estimationuser"><span>E</span></div>
                                </div>
                                <div className="releaseDayCell"><h5>Tue</h5>
                                    <div className="estimationuser"><span>E</span></div>
                                </div>
                                <div className="releaseDayCell"><h5>Wed</h5>
                                    <div className="estimationuser"><span>E</span></div>
                                </div>
                                <div className="releaseDayCell"><h5>Thu</h5>
                                    <div className="estimationuser"><span>E</span></div>
                                </div>
                                <div className="releaseDayCell"><h5>Fri</h5>
                                    <div className="estimationuser"><span>E</span></div>
                                </div>
                                <div className="releaseDayCell"><h5>Sat</h5>
                                    <div className="estimationuser"><span>E</span></div>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default withRouter(ReleaseTaskPlanningPage)
