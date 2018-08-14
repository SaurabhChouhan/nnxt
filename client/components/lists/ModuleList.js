import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import {ConfirmationDialog} from "../index";
import * as CM from "../../clientMsg"

class ModuleList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showModuleDeletionDialog: false,
            addRow: null


        }
    }

    onClose() {
        this.setState({showModuleDeletionDialog: false})
    }

    OkConfirmationForDeletingModule() {
        this.setState({showModuleDeletionDialog: false})
        this.props.deleteModule(this.state.addRow)
    }

    viewDeleteButton(cell, row, enumObject, rowIndex) {


        return (<button className=" btn btn-custom " type="button" onClick={() => {
                this.setState({showModuleDeletionDialog: true}),
                    this.setState({addRow: row._id})
            }}>
                <i className="fa fa-trash"></i>
            </button>
        )

    }

    viewEditButton(cell, row, enumObject, rowIndex) {


        return (<button className=" btn btn-custom" type="button" onClick={() => {
                this.props.showModuleEditForm(row)

            }}>
                <i className="fa fa-pencil"></i>
            </button>

        )
    }

    formatProject(project) {
        if (project)
            return project.name
        return ''
    }

    render() {
        return (
            <div>{this.state.showModuleDeletionDialog &&
            <ConfirmationDialog show={true} onConfirm={this.OkConfirmationForDeletingModule().bind(this)}
                                title={CM.DELETE_MODULE} onClose={this.onClose.bind(this)}
                                body={CM.DELETE_MODULE_BODY}/>
            }
                <div key="project_list" className="clearfix">


                    <div className="col-md-12">
                        <div className="col-md-12 pad">

                            <div className="col-md-12">
                                <button className="btn customBtn"
                                        onClick={() => this.props.showModuleCreationForm()}>Create Module
                                </button>

                                <div className="estimation">

                                    <BootstrapTable options={this.options} data={this.props.modules}
                                                    striped={true}
                                                    hover={true}>
                                        <TableHeaderColumn columnTitle isKey dataField='_id'
                                                           hidden={true}>ID</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='name'>Module Name</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='project'
                                                           dataFormat={this.formatProject.bind(this)}>Project
                                            Name</TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='editButton'
                                                           dataFormat={this.viewEditButton.bind(this)}>Edit Module
                                        </TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='deleteButton'
                                                           dataFormat={this.viewDeleteButton.bind(this)}>Delete Module
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

export default withRouter(ModuleList)