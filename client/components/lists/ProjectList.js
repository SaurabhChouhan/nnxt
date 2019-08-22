import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import {ConfirmationDialog} from "../index";
import * as CM from "../../clientMsg"
import ToggleButton from 'react-toggle-button'
import {Field, reduxForm} from 'redux-form'
import {renderSelect} from "../forms/fields";

class ProjectList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showProjectDeletionDialog: false,
            addRow: null,
            value: true


        }
    }

    onClose() {
        this.setState({showProjectDeletionDialog: false})
    }

    OkConfirmationForDeletingProject() {
        this.setState({showProjectDeletionDialog: false})
        this.props.deleteProject(this.state.addRow)
    }

    viewDeleteButton(cell, row, enumObject, rowIndex) {


        return (<button className=" btn btn-custom " type="button" onClick={() => {
                this.setState({showProjectDeletionDialog: true}),
                    this.setState({addRow: row._id})
            }}>
                <i className="fa fa-trash"></i>
            </button>
        )

    }

    viewEditButton(cell, row, enumObject, rowIndex) {


        return (<button className=" btn btn-custom" type="button" onClick={() => {
                this.props.showProjectEditForm(row)

            }}>
                <i className="fa fa-pencil"></i>
            </button>

        )
    }


    viewToggleButton(cell, row, enumObject, rowIndex) {
        return (
            <span>
            <ToggleButton className=" hoverTooltip"
                          value={row.isActive || false}

                          onToggle={(value) => {
                              console.log("hello", value)
                              this.setState({
                                  value: !value,

                              })
                              console.log("row", row)
                              this.props.toggleIsActive(row._id)
                          }}

            />

</span>

        )
    }


    formatClient(client) {
        if (client)
            return client.name
        return ''
    }

    render() {
        let status = [
            { _id: 1, name: "Active" },
            { _id: 0, name: "Inactive" }
        ]
        return (
            <div>{this.state.showProjectDeletionDialog &&
            <ConfirmationDialog show={true} onConfirm={this.OkConfirmationForDeletingProject.bind(this)}
                                title={CM.DELETE_PROJECT} onClose={this.onClose.bind(this)}
                                body={CM.DELETE_PROJECT_BODY}/>
            }
                <div key="project_list" className="clearfix">


                    <div className="col-md-12">
                        <div className="col-md-12 pad">

                            <div className="col-md-12">
                                <button className="btn customBtn"
                                        onClick={() => this.props.showProjectCreationForm()}>Create Project
                                </button>

                                <div className="release-button-container">
                                    <Field name="isActive" component={renderSelect} label={"Status:"}
                                           options={status}
                                           showNoneOption={false}
                                           onChange={(event, newValue) => {
                                               console.log("get the value of status", newValue)
                                               let status = false
                                               if(newValue==1)
                                                   status = true
                                               this.props.filterProject({isActive: status })
                                           }}
                                    />
                                </div>

                                <div className="estimation">

                                    <BootstrapTable options={this.options} data={this.props.projects}
                                                    striped={true}
                                                    hover={true}>
                                        <TableHeaderColumn columnTitle isKey dataField='_id'
                                                           hidden={true}>ID</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='name'>Project Name</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='code'>Code</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='client'
                                                           dataFormat={this.formatClient.bind(this)}>Client
                                            Name</TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='editButton'
                                                           dataFormat={this.viewEditButton.bind(this)}>Edit project
                                        </TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='deleteButton'
                                                           dataFormat={this.viewDeleteButton.bind(this)}>Delete project
                                        </TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='toggleButton'
                                                           dataFormat={this.viewToggleButton.bind(this)}>Active/Inactive
                                            project
                                        </TableHeaderColumn>

                                    </BootstrapTable>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
ProjectList = reduxForm({
    form: "project-list"
})(ProjectList)
export default withRouter(ProjectList)