import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import {ConfirmationDialog} from "../index";
import * as CM from "../../clientMsg"
import ToggleButton from "react-toggle-button";

class ClientList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showClientDeletionDialog: false,
            addRow: null,
            value: true
        }

    }

    onClose() {
        this.setState({showClientDeletionDialog: false})
    }

    OkConfirmationForDeletingClient() {
        this.setState({showClientDeletionDialog: false})
        this.props.deleteClient(this.state.addRow)
    }

    viewDeleteButton(cell, row, enumObject, rowIndex) {


        return (<button className=" btn btn-custom " type="button" onClick={() => {
                this.setState({showClientDeletionDialog: true}),
                    this.setState({addRow: row._id})
            }}>
                <i className="fa fa-trash"></i>
            </button>
        )

    }

    viewEditButton(cell, row, enumObject, rowIndex) {


        return (<button className=" btn btn-custom" type="button" onClick={() => {
                this.props.showClientEditForm(row)

            }}>
                <i className="fa fa-pencil"></i>
            </button>

        )
    }


    viewToggleButton(cell, row, enumObject, rowIndex) {
        return (
            <span>
            <ToggleButton className=" hoverTooltip"
                          value={this.state.value || false}

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


    render() {
        return (
            <div>{this.state.showClientDeletionDialog &&
            <ConfirmationDialog show={true} onConfirm={this.OkConfirmationForDeletingClient.bind(this)}
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

                                <div className="estimation">

                                    <BootstrapTable options={this.options} data={this.props.clients}
                                                    striped={true}
                                                    hover={true}>
                                        <TableHeaderColumn columnTitle isKey dataField='_id'
                                                           hidden={true}>ID</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='name'>Client Name</TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='editButton'
                                                           dataFormat={this.viewEditButton.bind(this)}>Edit Client
                                        </TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='deleteButton'
                                                           dataFormat={this.viewDeleteButton.bind(this)}>Delete Client
                                        </TableHeaderColumn>
                                        <TableHeaderColumn width="15%" dataField='toggleButton'
                                                           dataFormat={this.viewToggleButton.bind(this)}>Active/Inactive
                                            Client
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