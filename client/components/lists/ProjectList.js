import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import {ConfirmationDialog} from "../index";
import * as SC from '../../../server/serverconstants'
import {showComponentHideOthers} from "../../actions";
import {PROJECT_FORM_DIALOG} from "../componentConsts";

class ProjectList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showProjectDeletionDialog: false,
            addRow:null


        }

    }
    onClose() {
        this.setState({showProjectDeletionDialog: false})
        console.log("onClose",this.state.showProjectDeletionDialog)
    }
    OkConfimationForDeletingProject() {
        this.setState({showProjectDeletionDialog: false})
        console.log("ok confirmation id,",this.state.addRow)
        this.props.deleteProject(this.state.addRow)
    }

    viewDeleteButton(cell, row, enumObject, rowIndex) {


        return (<button className="fa fa-trash btn btn-custom " type="button" onClick={() => {
                this.setState({showProjectDeletionDialog: true}),
                    this.setState({addRow:row._id})
            }}>

            </button>
        )

    }
    viewEditButton(cell, row, enumObject, rowIndex) {


        return (<button className="fa fa-pencil btn btn-custom" type="button" onClick={() => {
                this.props.showPorjectEditForm(row)

            }}>

            </button>

        )
    }
    formatClient(client) {
        if (client)
            return client.name
        return ''
    }

    render() {
        return (
            <div>{this.state.showProjectDeletionDialog &&
            <ConfirmationDialog show={true} onConfirm={this.OkConfimationForDeletingProject.bind(this)}
                                title="Delete Project" onClose={this.onClose.bind(this)}
                                body="You are about to delete Project. are you sure you want to delete this Project,Please confirm!"/>
            }
            <div key="project_list" className="clearfix">


                <div className="col-md-12">
                    <div className="col-md-12 pad">

                        <div className="col-md-12">
                            <button className="btn customBtn"
                                    onClick={() => this.props.showProjectCreationForm()}>Create Project
                            </button>

                            <div className="projects">

                                <BootstrapTable options={this.options} data={this.props.projects}
                                                striped={true}
                                                hover={true}>
                                    <TableHeaderColumn columnTitle isKey dataField='_id'
                                                       hidden={true}>ID</TableHeaderColumn>
                                    <TableHeaderColumn columnTitle dataField='name'>Project Name</TableHeaderColumn>
                                    <TableHeaderColumn columnTitle dataField='client' dataFormat={this.formatClient.bind(this)}>Client Name</TableHeaderColumn>
                                    <TableHeaderColumn width="15%" dataField='editButton' dataFormat={this.viewEditButton.bind(this)} >Edit project
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width="15%" dataField='deleteButton' dataFormat={this.viewDeleteButton.bind(this)} >Delete project
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

export default withRouter(ProjectList)