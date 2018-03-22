import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import {ConfirmationDialog} from "../index";
import * as SC from '../../../server/serverconstants'
import * as CM from "../../clientMsg"

class ClientList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showClientDeletionDialog: false,
            addRow:null
        }

    }
    onClose() {
        this.setState({showClientDeletionDialog: false})
        console.log("onClose",this.state.showClientDeletionDialog)
    }
    OkConfimationForDeletingClient() {
        this.setState({showClientDeletionDialog: false})
        console.log("ok confirmation id,",this.state.addRow)
        this.props.deleteClient(this.state.addRow)
    }

    viewDeleteButton(cell, row, enumObject, rowIndex) {


        return (<button className="fa fa-trash btn btn-custom " type="button" onClick={() => {
                this.setState({showClientDeletionDialog: true}),
                    this.setState({addRow:row._id})
            }}>

            </button>
        )

    }
    viewEditButton(cell, row, enumObject, rowIndex) {


        return (<button className="fa fa-pencil btn btn-custom" type="button" onClick={() => {
                this.props.showClientEditForm(row)

            }}>

            </button>

        )
    }

    render() {
        return (
            <div>{this.state.showClientDeletionDialog &&
            <ConfirmationDialog show={true} onConfirm={this.OkConfimationForDeletingClient.bind(this)}
                                title={CM.DELETE_CLIENT} onClose={this.onClose.bind(this)}
                                body={CM.DELETE_CLIENT_BODY}/>
            }
            <div key="client_list" className="clearfix">


                <div className="col-md-12">
                    <div className="col-md-12 pad">

                        <div className="col-md-12">
                            <button className="btn customBtn"
                                    onClick={() => this.props.showClientCreationForm()}>Create Client
                            </button>

                            <div className="client">

                                <BootstrapTable options={this.options} data={this.props.clients}
                                                striped={true}
                                                hover={true}>
                                    <TableHeaderColumn  columnTitle isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                                    <TableHeaderColumn  columnTitle dataField='name'>Client Name</TableHeaderColumn>
                                    <TableHeaderColumn width="15%" dataField='editButton' dataFormat={this.viewEditButton.bind(this)} >Edit Client
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width="15%" dataField='deleteButton' dataFormat={this.viewDeleteButton.bind(this)} >Delete Client
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

export default withRouter(ClientList)