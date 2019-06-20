import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'
import momentTZ from 'moment-timezone'
import {withRouter} from 'react-router-dom'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {renderSelect,} from '../forms/fields'

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

    render() {
        const {releases, handleSubmit, leaders, managers, clients, initialValues, releaseFilters} = this.props
        let duration = [{_id: moment().add(-15, 'days').startOf('d'), name: 'last 15 days'},
                    {_id: moment().add(-1, 'month').startOf('d'), name: 'last 1 month'},
                    {_id: moment().add(-6, 'month').startOf('d'), name:'last 6 months'}];
        return ([
                <form key={"release-form"} onSubmit={handleSubmit}>
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
                                console.log("get the value of status", newValue)
                                this.props.fetchReleases(
                                    Object.assign({}, releaseFilters, {
                                        status: newValue
                                    })
                                )
                            }} noneOptionText='All'/>

                        </div>

                        <div className="release-button-container">
                            <Field name="leader" component={renderSelect} label={"Leaders:"} options={leaders}
                                   onChange={(event, newValue) => {
                                       console.log("get the value of status", newValue)
                                       this.props.fetchReleases(Object.assign({}, releaseFilters, {
                                           leader: newValue
                                       }))
                                   }} noneOptionText='All'/>

                        </div>

                        <div className="release-button-container">
                            <Field name="manager" component={renderSelect} label={"Managers:"} options={managers}
                                   onChange={(event, newValue) => {
                                       console.log("get the value of status", newValue)
                                       this.props.fetchReleases(Object.assign({}, releaseFilters, {
                                           manager: newValue
                                       }))
                                   }} noneOptionText='All'/>

                        </div>

                        <div className="release-button-container">
                            <Field name="client" component={renderSelect} label={"Clients:"} options={clients}
                                   onChange={(event, newValue) => {
                                       console.log("get the value of status", newValue)
                                       this.props.fetchReleases(Object.assign({}, releaseFilters, {
                                           client: newValue
                                       }))
                                   }} noneOptionText='All'/>

                        </div>

                        <div className="release-button-container">
                            <Field name="duration" component={renderSelect} label={"Duration:"} options={duration}
                                   onChange={(event, newValue) => {
                                       console.log("get the value of status", newValue)
                                       this.props.fetchReleases(Object.assign({}, releaseFilters, {
                                           duration: newValue
                                       }))
                                   }} noneOptionText='All'/>

                        </div>

                        <div className="search-btn-container">
                            <div className={"input checkbox col-md-4"} style={{width: "100%", marginTop: 15}}>
                                <label>
                                    <Field name={"showActive"} component={"input"}
                                           onChange={(event, newValue) => {
                                               this.props.fetchReleases(Object.assign({}, releaseFilters, {
                                                   showActive: newValue
                                               }))
                                           }
                                           }
                                           type="checkbox"/>
                                    Show In Progress
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

export default withRouter(ReleaseList)
