import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import moment from 'moment'
import {ReleaseDeveloperFilterFormContainer} from '../../containers'

class ReleaseTaskDetailPage extends Component {

    constructor(props) {
        super(props);

    }

    deleteCellButton(cell, row, enumObject, rowIndex) {
        if (row._id) {

        }
        else return (<button className="glyphicon glyphicon-trash pull-left btn btn-custom" type="button"
                             onClick={() => {
                                 this.props.deleteTaskPlanningRow(row)
                             }}></button>)
    }

    formatPlanningDate(row) {
        if (row) {
            return moment(row).format("DD-MM-YYYY")
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


    render() {
       // const {release} = this.props
        const {releasePlan, taskPlanning,developerPlanned} = this.props
        return (
            <div className=" col-md-12 clearfix  ">
                <div className="col-md-8 pad">
                    <div className="col-md-12 estimateheader">
                        <div className="col-md-8 pad">
                            <div className="backarrow">

                                <h5>
                                    <a href=""><i className="glyphicon glyphicon-arrow-left"></i></a><b>{releasePlan.task ? releasePlan.task.name : ''} </b></h5>
                            </div>
                        </div>
                        <div className="col-md-4  releaseClock ">
                            <i className="fa fa-clock-o "></i><b>8 Hrs</b>
                        </div>
                    </div>
                    <div className="col-md-12 ">
                        <div className=" releasecontent">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ipsum sem, interdum et
                                est id, pellentesque tempus leo. Nulla sagittis quam sapien, nec egestas. Nulla arcu
                                odio.(Read More...)</p>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-4 planchk"><input type="checkbox" name="" value=""/><span>Project Users Only</span>
                        </div>
                        <div className="col-md-4 planBtn">
                            <button type="button" className="btn taskbtn"   onClick={() => this.props.showTaskPlanningCreationForm(releasePlan)}><i className="fa fa-plus-circle"></i>
                                Add New Row
                            </button>
                        </div>
                        <div className="col-md-4 planBtn">
                            <button className="btn customBtn" onClick={() => this.props.planTask(taskPlanning)}>
                                Plan Task
                            </button>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="estimation">
                            <BootstrapTable options={this.options} data={taskPlanning}
                                            striped={true}
                                            hover={true}>
                                <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planningDate'
                                                   dataFormat={this.formatPlanningDate.bind(this)}>Date</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='planning'
                                                   dataFormat={this.formatPlannedHours.bind(this)}>Est
                                    Hours</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='employee'
                                                   dataFormat={this.formatDeveloper.bind(this)}>>Developer</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='report'
                                                   dataFormat={this.formatReport.bind(this)}>Reported
                                    Status</TableHeaderColumn>
                                <TableHeaderColumn width="8%" dataField='button'
                                                   dataFormat={this.deleteCellButton.bind(this)}><i
                                    className="fa fa-trash"></i>
                                </TableHeaderColumn>
                            </BootstrapTable>
                        </div>
                    </div>
                    <div className="col-md-12 planDivider">
                        <div className="col-md-2 planDividerDate"><span>Base Date</span><input type="text"
                                                                                               className="form-control"
                                                                                               placeholder="Date"/>
                        </div>
                        <div className="col-md-2 planDividerDate"><span>Days to Shift</span>
                            <select className="form-control">
                                <option value="">01</option>
                                <option value="">02</option>
                                <option value="">03</option>
                                <option value="">04</option>
                            </select>
                        </div>
                        <div className="col-md-8 planDividerBtn">
                            <form>
                                <button className="btn customBtn Future">
                                    Shift in Future
                                </button>
                                <button className="btn customBtn Past ">
                                    Shift in Past
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="col-md-12 planDateSlct">
                        <ReleaseDeveloperFilterFormContainer/>
                    </div>
                    <div className="col-md-12">
                        <div className="estimation">
                            <BootstrapTable options={this.options} data={developerPlanned}
                                            striped={true}
                                            hover={true}>
                                <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='created'>Date</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='task'>Task
                                    Name</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='employee'>Developer</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='palnning'>Planned Effort</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='project'>Project</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='flags'>Action</TableHeaderColumn>
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
                                <h5>Developer1</h5><i className="glyphicon glyphicon-resize-full pull-right"></i><span className="pull-right">26-feb to 29-feb</span>
                            </div>
                            <div className="releaseDayRow">
                                <div className="releaseDayCell">  <h5>Sun</h5></div>
                                <div className="releaseDayCell"><h5>Mon</h5><div className="estimationuser"><span>E</span></div> </div>
                                <div className="releaseDayCell"><h5>Tue</h5><div className="estimationuser"><span>E</span></div></div>
                                <div className="releaseDayCell"><h5>Wed</h5><div className="estimationuser"><span>E</span></div></div>
                                <div className="releaseDayCell"><h5>Thu</h5><div className="estimationuser"><span>E</span></div></div>
                                <div className="releaseDayCell"><h5>Fri</h5><div className="estimationuser"><span>E</span></div></div>
                                <div className="releaseDayCell"><h5>Sat</h5><div className="estimationuser"><span>E</span></div> </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



export default withRouter(ReleaseTaskDetailPage)
