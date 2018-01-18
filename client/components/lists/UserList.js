import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'
import {NotificationManager} from 'react-notifications'
import {ROLE_ADMIN, CREATE_USER, EDIT_USER, DELETE_USER} from "../../clientconstants"

class UserList extends Component {

    constructor(props) {
        super(props);
    }

    editCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-pencil pull-left btn btn-custom" type="button"
                        onClick={() => this.props.editUser(row)}>
            </button>
        )
    }

    deleteCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-trash pull-left btn btn-custom" type="button"
                        onClick={() => {
                            this.dialog.show({
                                title: "Delete User",
                                body: "",
                                actions: [
                                    Dialog.DefaultAction('Delete', () => {
                                        this.props.deleteUser(row._id)
                                    }, 'btn-custom'),
                                    Dialog.DefaultAction('Close', () => {
                                        this.dialog.hide()
                                    }, 'btn-custom')
                                ],
                                bsSize: 'small',
                                onHide: (dialog) => {
                                    this.dialog.hide()
                                }
                            })
                        }}>
            </button>
        )
    }


    formatRole(roles, row) {
        if (roles && roles.length > 0)
            return roles.map(role => role.name).join(", ")
        else
            return ''
    }


    render() {
        return (
            <div className="row">
                <div className="col-md-10">
                    <Dialog ref={(el) => {
                        this.dialog = el
                    }}/>

                    {this.props.loggedInUser.permissions.includes(CREATE_USER) &&
                    <button className="btn btn-default btn-submit addBtn" onClick={() => this.props.showUserForm()}>
                        Create
                        User
                    </button>
                    }

                    <BootstrapTable options={this.options} data={this.props.users} striped={true}
                                    hoveNr={true}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="firstName" dataSort={true}>First
                            Name</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="lastName">Last Name</TableHeaderColumn>
                        <TableHeaderColumn width="26%" dataField="roles"
                                           dataFormat={this.formatRole}>Roles</TableHeaderColumn>
                        <TableHeaderColumn width="22%" dataField="email">Email</TableHeaderColumn>
                        {this.props.loggedInUser.permissions.includes(EDIT_USER) &&
                        <TableHeaderColumn width="8%" dataField='button' dataFormat={this.editCellButton.bind(this)}><i
                            className="fa fa-pencil"></i></TableHeaderColumn>}
                        {this.props.loggedInUser.permissions.includes(DELETE_USER) &&
                        <TableHeaderColumn width="5%" dataField='button'
                                           dataFormat={this.deleteCellButton.bind(this)}><i className="fa fa-trash"></i>
                        </TableHeaderColumn>}

                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

export default UserList