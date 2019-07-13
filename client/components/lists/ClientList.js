import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import {ConfirmationDialog} from "../index";
import * as CM from "../../clientMsg"
import ToggleButton from "react-toggle-button";
import {reduxForm, Field} from 'redux-form'
import {renderSelect} from "../forms/fields";

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
        )
    }


    render() {
        let status = [
            { _id: 1, name: "Active" },
            { _id: 2, name: "Inactive" }
        ]
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
                                <div className="release-button-container">
                                    <Field name="isActive" component={renderSelect} label={"Status:"}
                                           options={status}
                                           showNoneOption={false}
                                           onChange={(event, newValue) => {
                                               console.log("get the value of status", newValue)
                                               this.props.filterClient(Object.assign({}, this.props.client, {
                                                   status: newValue
                                               }))
                                           }}  />

                                </div>

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
ClientList = reduxForm({
    form: "client-list"
})(ClientList)
export default withRouter(ClientList)