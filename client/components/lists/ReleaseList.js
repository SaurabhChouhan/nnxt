import React, { Component } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import momentTZ from 'moment-timezone'
import { withRouter } from 'react-router-dom'
import { Field, formValueSelector, reduxForm } from 'redux-form'
import { renderSelect, } from '../forms/fields'
import { DATE_FORMAT } from "../../../server/serverconstants";

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

    componentDidMount() {
        this.props.search(this.props.releaseFilters)
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
    formatClient(row) {
        console.log('formatClient', row)
        if (row) {
            return row.name
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
    filterType(cell, row) {
        // just return type for filtering or searching.
        console.log(cell, "row", row);
        return cell.firstName + ' ' + cell.lastName;
    }
    filterDate(cell, row) {
        // just return type for filtering or searching.
        console.log(cell, "row", row);
        if (cell.length > 0)
            return momentTZ.utc(cell[0].devEndDate).format("DD-MM-YYYY")
    }
    render() {
        const { projects, releases, handleSubmit, leaders, managers, clients, initialValues, releaseFilters } = this.props
        let progressTimeOptions = [
            { _id: moment().startOf('d').format(DATE_FORMAT), name: 'Today' },
            { _id: moment().add(-7, 'days').startOf('d').format(DATE_FORMAT), name: '1 Week Ago' },
            { _id: moment().add(-15, 'days').startOf('d').format(DATE_FORMAT), name: '15 Days Ago' },
            { _id: moment().add(-1, 'month').startOf('d').format(DATE_FORMAT), name: '1 Month Ago' },
            { _id: moment().add(-3, 'months').startOf('d').format(DATE_FORMAT), name: '3 Months Ago' },
            { _id: moment().add(-6, 'months').startOf('d').format(DATE_FORMAT), name: '6 Months Ago' },
            { _id: '', name: 'Any Time' }
        ];
        console.log(this.props)
        return ([
            <form key={"release-form"} onSubmit={handleSubmit}>
                <div key={"release-search"} className="col-md-12 release-options">
                    <button type="button" className="col-md-2 btn customBtn" onClick={
                        () => {
                            this.props.showCreateReleaseDialog()
                        }}>Create Release
                        </button>

                    {/*<div className="release-button-container">*/}

                    {/*<Field name="status" component={renderSelect} label={"Status"} options={*/}
                    {/*SC.ALL_RELEASE_STATUS.map((status, idx) =>*/}
                    {/*({*/}
                    {/*_id: status,*/}
                    {/*name: status*/}
                    {/*})*/}
                    {/*)*/}
                    {/*} onChange={(event, newValue) => {*/}
                    {/*console.log("get the value of status", newValue)*/}
                    {/*this.props.fetchReleases(*/}
                    {/*Object.assign({}, releaseFilters, {*/}
                    {/*status: newValue*/}
                    {/*})*/}
                    {/*)*/}
                    {/*}} noneOptionText='All' />*/}

                    {/*</div>*/}
                    <div className="release-button-container">
                        <Field name="project" component={renderSelect} label={"Project:"} options={projects}
                            onChange={(event, newValue) => {
                                console.log("get the value of status", newValue)
                                this.props.fetchReleases(Object.assign({}, releaseFilters, {
                                    project: newValue
                                }))
                            }} noneOptionText='All' />

                    </div>

                    <div className="release-button-container">
                        <Field name="leader" component={renderSelect} label={"Leaders:"} options={leaders}
                            onChange={(event, newValue) => {
                                console.log("get the value of status", newValue)
                                this.props.fetchReleases(Object.assign({}, releaseFilters, {
                                    leader: newValue
                                }))
                            }} noneOptionText='All' />

                    </div>

                    <div className="release-button-container">
                        <Field name="manager" component={renderSelect} label={"Managers:"} options={managers}
                            onChange={(event, newValue) => {
                                console.log("get the value of status", newValue)
                                this.props.fetchReleases(Object.assign({}, releaseFilters, {
                                    manager: newValue
                                }))
                            }} noneOptionText='All' />

                    </div>

                    <div className="release-button-container">
                        <Field name="client" component={renderSelect} label={"Clients:"} options={clients}
                            onChange={(event, newValue) => {
                                console.log("get the value of status", newValue)
                                this.props.fetchReleases(Object.assign({}, releaseFilters, {
                                    client: newValue
                                }))
                            }} noneOptionText='All' />

                    </div>

                    <div className="release-button-container">
                        <Field name="referenceDate" component={renderSelect} label={"In Progress:"} options={progressTimeOptions}
                            showNoneOption={false}
                            onChange={(event, newValue) => {
                                console.log("get the value of status", newValue)
                                this.props.fetchReleases(Object.assign({}, releaseFilters, {
                                    referenceDate: newValue
                                }))
                            }} />

                    </div>
                </div>
            </form>,
            <div key={"release-table"} className="col-md-12">
                <div className="estimation release-plan-table">
                    <BootstrapTable options={this.options} data={releases}
                        striped
                        hover
                        search
                        multiColumnSearch>
                        <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>
                        </TableHeaderColumn>
                        <TableHeaderColumn width="12%" dataField='project'
                            dataFormat={this.formatProjectName.bind(this)} dataAlign={"center"}>
                            Project
                            </TableHeaderColumn>
                        <TableHeaderColumn columnTitle dataField='manager'
                            dataFormat={this.formatManager.bind(this)} dataAlign={"center"}
                            filterValue={this.filterType.bind(this)}>
                            Manager
                            </TableHeaderColumn>
                        <TableHeaderColumn columnTitle dataField='leader'
                            dataFormat={this.formatLeader.bind(this)} dataAlign={"center"}
                            filterValue={this.filterType.bind(this)}>
                            Leader
                            </TableHeaderColumn>
                        <TableHeaderColumn columnTitle dataField='client'
                            dataFormat={this.formatClient.bind(this)} dataAlign={"center"}>
                            Client
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
                        <TableHeaderColumn columnTitle dataField='iterations'
                            dataFormat={this.formatEndDate.bind(this)} dataAlign={"center"}
                            filterValue={this.filterDate}>
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

export default withRouter(ReleaseList)
