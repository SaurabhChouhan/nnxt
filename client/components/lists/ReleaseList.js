import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import momentTZ from 'moment-timezone'
import {withRouter} from 'react-router-dom'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderSelect,} from '../forms/fields'
import {connect} from 'react-redux'


class ReleaseList extends Component {

    constructor(props) {
        super(props);
        this.options = {
            onRowClick: this.onRowClick.bind(this)
        }
        this.state = {
            showAllReleases: false,
            releaseStatus: SC.ALL
        }

        this.handleAllReleasesCheckBox = this.handleAllReleasesCheckBox.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this)
    }

    onRowClick(row) {
        this.props.history.push("/app-home/release-plan")
        this.props.releaseSelected(row)

    }

    formatCreatedDate(row) {
        if (row) {
            return moment(row).format("DD-MM-YYYY")
        }
        return ''
    }

    formatProjectName(project, row, enumObject, rowIndex) {
        let releaseName = ""
        if (project && project.name)
            releaseName = project.name
        if (row && row.name)
            releaseName = releaseName + ' (' + row.name + ')'
        return releaseName
    }

    formatManager(row) {
        if (row) {
            return row.firstName + ' ' + row.lastName
        }
        return ''
    }

    formatLeader(row) {
        if (row) {
            return row.firstName + ' ' + row.lastName
        }
        return ''
    }

    formatEstimatedHours(column, row) {
        if (row.plannedStats) {
            return row.plannedStats.sumEstimatedHours
        }
        return ''
    }

    formatReportedHours(column, row) {
        if (row.plannedStats) {
            return row.plannedStats.sumReportedHours
        }
        return ''
    }

    formatProgress(column, row) {
        if (row.plannedStats) {
            return row.plannedStats.progress + '%'
        }
        return '0%'
    }

    formatStartDate(column, row) {
        if (row.iterations[0]) {
            return momentTZ.utc(row.iterations[0].devStartDate).format("DD-MM-YYYY")
        }
        return ''
    }

    formatEndDate(column, row) {
        if (row.iterations[0]) {
            return momentTZ.utc(row.iterations[0].devEndDate).format("DD-MM-YYYY")
        }
        return ''
    }


    formatReleaseDate(column, row) {
        if (row.iterations[0]) {
            return momentTZ.utc(row.iterations[0].clientReleaseDate).format("DD-MM-YYYY")
        }
        return ''
    }

    handleAllReleasesCheckBox(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({
            showAllReleases: value
        });
        this.props.showAllReleasesChanged(this.state.releaseStatus, value)
        console.log("****************** showAllRelease is ", value)
    }

    handleStatusChange(event) {
        const target = event.target;
        this.setState({
            releaseStatus: target.value
        });

        this.props.changeReleaseStatus(target.value, this.state.showAllReleases)
    }

    render() {
        const {releases,handleSubmit,developers,leader,status,developer,leaders} = this.props

        console.log('releases.......',releases)
        console.log('developer.......',developers)
        console.log('leaders......',leaders)
        return ([
            <form onSubmit={handleSubmit}>
                <div key={"release-search"} className="col-md-12 release-options">
                    <button type="button" className="col-md-2 btn customBtn" onClick={
                        () => {
                            this.props.showCreateReleaseDialog()
                        }}>Create Release
                    </button>

                    <div className="release-button-container">

                        <Field name="status" component={renderSelect} label={"Status"} options={
                            SC.ALL_RELEASE_STATUS.map((status, idx) =>
                                ({
                                    _id: status,
                                    name: status
                                })
                            )
                        } onChange={(event, newValue) => {
                            console.log("get the value of status",newValue)
                            this.props.fetchReleases({

                                status: newValue,
                                leader,
                                developer
                            })
                        }} noneOptionText='All'/>

                        {/*<select className="col-md-4 form-control" title="Select Status"
                                value={this.state.releaseStatus}
                                onChange={this.handleStatusChange}>
                            <option value={SC.ALL}>All Status</option>
                            <option value={SC.STATUS_AWARDED}>{SC.STATUS_AWARDED}</option>
                            <option value={SC.STATUS_DEV_IN_PROGRESS}>{SC.STATUS_DEV_IN_PROGRESS}</option>
                            <option value={SC.STATUS_DEV_COMPLETED}>{SC.STATUS_DEV_COMPLETED}</option>
                            <option value={SC.STATUS_TEST_COMPLETED}>{SC.STATUS_TEST_COMPLETED}</option>
                            <option value={SC.STATUS_DEPLOYED}>{SC.STATUS_DEPLOYED}</option>
                            <option value={SC.STATUS_ISSUE_FIXING}>{SC.STATUS_ISSUE_FIXING}</option>
                            <option value={SC.STATUS_STABLE}>{SC.STATUS_STABLE}</option>
                        </select>*/}
                    </div>
                    <div className="release-button-container">

                        <Field name="leader" component={renderSelect} label={"leaders"} options={leaders} onChange={(event, newValue) => {
                            console.log("get the value of status",newValue)
                            this.props.fetchReleases({
                                status,
                                leader:newValue,
                                developer
                            })
                        }} noneOptionText='All'/>

                        {/*<select className="col-md-4 form-control" title="Select Status"
                                value={this.state.releaseStatus}
                                onChange={this.handleStatusChange}>
                            <option value={SC.ALL}>All Status</option>
                            <option value={SC.STATUS_AWARDED}>{SC.STATUS_AWARDED}</option>
                            <option value={SC.STATUS_DEV_IN_PROGRESS}>{SC.STATUS_DEV_IN_PROGRESS}</option>
                            <option value={SC.STATUS_DEV_COMPLETED}>{SC.STATUS_DEV_COMPLETED}</option>
                            <option value={SC.STATUS_TEST_COMPLETED}>{SC.STATUS_TEST_COMPLETED}</option>
                            <option value={SC.STATUS_DEPLOYED}>{SC.STATUS_DEPLOYED}</option>
                            <option value={SC.STATUS_ISSUE_FIXING}>{SC.STATUS_ISSUE_FIXING}</option>
                            <option value={SC.STATUS_STABLE}>{SC.STATUS_STABLE}</option>
                        </select>*/}
                    </div>
                    <div className="release-button-container">

                        <Field name="developer" component={renderSelect} label={"developers"} options={developers} onChange={(event, newValue) => {
                            console.log("get the value of status",newValue)
                            this.props.fetchReleases({
                                status,
                                leader,
                                developer:newValue,
                            })
                        }} noneOptionText='All'/>

                        {/*<select className="col-md-4 form-control" title="Select Status"
                                value={this.state.releaseStatus}
                                onChange={this.handleStatusChange}>
                            <option value={SC.ALL}>All Status</option>
                            <option value={SC.STATUS_AWARDED}>{SC.STATUS_AWARDED}</option>
                            <option value={SC.STATUS_DEV_IN_PROGRESS}>{SC.STATUS_DEV_IN_PROGRESS}</option>
                            <option value={SC.STATUS_DEV_COMPLETED}>{SC.STATUS_DEV_COMPLETED}</option>
                            <option value={SC.STATUS_TEST_COMPLETED}>{SC.STATUS_TEST_COMPLETED}</option>
                            <option value={SC.STATUS_DEPLOYED}>{SC.STATUS_DEPLOYED}</option>
                            <option value={SC.STATUS_ISSUE_FIXING}>{SC.STATUS_ISSUE_FIXING}</option>
                            <option value={SC.STATUS_STABLE}>{SC.STATUS_STABLE}</option>
                        </select>*/}
                    </div>

                    <div className="search-btn-container">
                        <div className={"input checkbox col-md-4"} style={{width: "100%",marginTop:15}}>
                            <label>
                                <input checked={this.state.showAllReleases} onChange={this.handleAllReleasesCheckBox}
                                       type="checkbox"/>
                                Show All Releases
                            </label>
                        </div>
                    </div>

                </div>
            </form>,
                <div key={"release-table"} className="col-md-12">
                    <div className="estimation release-plan-table">
                        <BootstrapTable options={this.options} data={releases}
                                        multiColumnSearch={true}
                                        search={false}
                                        striped={true}
                                        hover={true}>
                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                            </TableHeaderColumn>
                            <TableHeaderColumn width="12%" dataField='project'
                                               dataFormat={this.formatProjectName.bind(this)} dataAlign={"center"}>
                                Project
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='manager'
                                               dataFormat={this.formatManager.bind(this)} dataAlign={"center"}>
                                Manager
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='leader'
                                               dataFormat={this.formatLeader.bind(this)} dataAlign={"center"}>
                                Leader
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatEstimatedHours.bind(this)} dataAlign={"center"}>
                                Estimated Hours
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatReportedHours.bind(this)} dataAlign={"center"}>
                                Reported Hours
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatProgress.bind(this)} dataAlign={"center"}>
                                Progress
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatStartDate.bind(this)} dataAlign={"center"}>
                                Start Date
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatEndDate.bind(this)} dataAlign={"center"}>
                                End Date
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='iterations[0]'
                                               dataFormat={this.formatReleaseDate.bind(this)} dataAlign={"center"}>
                                Release Date
                            </TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='status' dataAlign={"center"}>
                                Status
                            </TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>]
        )
    }
}
ReleaseList = reduxForm({
    form: 'release-list'
})(ReleaseList)

const
    selector = formValueSelector('release-list')

ReleaseList = connect(
    state => {
        const { status, developer, leader} = selector(state, 'status', 'developer', 'leader')
        return {
            status,
            developer,
            leader
        }
    }
)(ReleaseList)

export default withRouter(ReleaseList)
