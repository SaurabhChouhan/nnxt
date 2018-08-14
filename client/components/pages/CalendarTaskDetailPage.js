import React from 'react'
import {Timeline, TimelineEvent} from 'react-event-timeline'
import moment from 'moment'
import * as SC from '../../../server/serverconstants'
import {withRouter} from 'react-router-dom'
import {BootstrapTable, TableHeaderColumn} from "react-bootstrap-table";

class CalendarTaskDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.commentListPageOptions = {
            sizePerPageList: [{
                text: '4', value: 4
            }],
            sizePerPage: 4,  // which size per page you want to locate as default
        }
    }

    render() {
        const {selectedTaskPlan, selectedRelease, selectedReleasePlan} = this.props
        return (

            <Timeline>
                <span>
                    <button className="btn-link calArrow" style={{marginLeft: '-3%'}}
                            onClick={() => {
                                this.props.history.push("/app-home/calendar")
                                this.props.calenderGoBack()
                            }}>
                        <i className="glyphicon glyphicon-arrow-left"></i></button>
                </span>

                <TimelineEvent title={'Assigned To You :'}
                               icon={<i className="glyphicon glyphicon-user calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <Timeline>


                        < TimelineEvent title={' Planned Date :'}
                                        icon={<i
                                            className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                        style={{fontSize: '20px'}}>
                            {selectedTaskPlan && selectedTaskPlan.planningDate ? moment(selectedTaskPlan.planningDate).format(SC.DATE_AND_TIME_FORMAT) : ''}
                        </TimelineEvent>


                        <TimelineEvent title={' Planned Hours :'}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            {selectedTaskPlan && selectedTaskPlan.planning && selectedTaskPlan.planning.plannedHours ? selectedTaskPlan.planning.plannedHours : ''}
                        </TimelineEvent>


                        <TimelineEvent title={'Details :'}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            <p className="description">    {selectedTaskPlan && selectedTaskPlan.description ? selectedTaskPlan.description : ''}</p>
                        </TimelineEvent>


                        <TimelineEvent title={' Reported Status :'}
                                       icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                                       style={{fontSize: '20px'}}>
                            {selectedTaskPlan && selectedTaskPlan.report && selectedTaskPlan.report.status ? selectedTaskPlan.report.status : ''}
                        </TimelineEvent>


                    </Timeline>
                </TimelineEvent>


                <TimelineEvent title={'Comments :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {
                        <div className="ReportingCommentTable">

                            <BootstrapTable data={selectedReleasePlan.comments}
                                            striped={true}
                                            hover={true}
                                            options={this.commentListPageOptions}
                                            pagination
                                            height={"200px"}>
                                <TableHeaderColumn width="12%" columnTitle dataField="dateInIndia">
                                    Date/Time
                                </TableHeaderColumn>
                                <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                                </TableHeaderColumn>
                                <TableHeaderColumn width="38%" columnTitle dataField='comment'
                                >Comment
                                </TableHeaderColumn>
                                <TableHeaderColumn width="10%" columnTitle dataField="commentType"
                                                   dataSort={true}>
                                    Comment Type</TableHeaderColumn>
                                <TableHeaderColumn width="10%" columnTitle dataField="name">
                                    Commented By</TableHeaderColumn>

                            </BootstrapTable>
                        </div>

                    }
                </TimelineEvent>


                <TimelineEvent title={'Task Name :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    {selectedTaskPlan && selectedTaskPlan.task && selectedTaskPlan.task.name ? selectedTaskPlan.task.name : ''}
                </TimelineEvent>

                <TimelineEvent title={'Task Description :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}
                               style={{fontSize: '20px'}}>
                    <p className="description"> {selectedReleasePlan && selectedReleasePlan.task && selectedReleasePlan.task.description ? selectedReleasePlan.task.description : ''}</p>
                </TimelineEvent>


                <TimelineEvent style={{fontSize: '20px'}}
                               title={'Project Name :'}
                               icon={<i className="glyphicon glyphicon-tasks calendar_icon"></i>}>

                    {selectedRelease && selectedRelease.project && selectedRelease.project.name ? selectedRelease.project.name : ''}
                </TimelineEvent>


                < TimelineEvent style={{fontSize: '20px'}}
                                title={'Project Description :'}
                                icon={<i
                                    className="glyphicon glyphicon-tasks calendar_icon"></i>}>
                    <p className="description">{selectedReleasePlan && selectedReleasePlan.estimationDescription ? selectedReleasePlan.estimationDescription : ''}</p>
                </TimelineEvent>




            </Timeline>


        )
    }
}

export default withRouter(CalendarTaskDetailPage);
