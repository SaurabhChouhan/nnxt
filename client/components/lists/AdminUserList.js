import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'
import {NotificationManager} from 'react-notifications'
import {ROLE_ADMIN} from "../../clientconstants"

class AdminUserList extends Component {

    constructor(props) {
        super(props);
    }

    editCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-pencil pull-left btn btn-custom" type="button"
                        onClick={() => this.onClickUserEditSelected(cell, row, rowIndex)}>
            </button>
        )
    }

    onClickUserEditSelected(cell, row, rowIndex) {
        this.props.showAdminUserEditForm(row);
    }

    deleteCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-trash pull-left btn btn-custom" type="button"
                        onClick={() => this.onClickCaseTypeDeleteSelected(cell, row, rowIndex)}>
            </button>
        )
    }

    onClickCaseTypeDeleteSelected(cell, row, rowIndex) {
        this.dialog.show({
            title: "Remove Permission",
            body: "Remove Permission",
            actions: [
                Dialog.DefaultAction('Remove', () => {
                    this.props.deleteAdminUser(row._id)
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
    }

    formatRole(roles, row) {
        if (roles && roles.length > 0)
            return roles.map(role => role.role).join(", ")
        else
            return ''
    }


    render() {
        return (

            <div className="col-md-10">
                <Dialog ref={(el) => {
                    this.dialog = el
                }}/>

                {//(this.props.loggedInUser.isSuperAdmin) ?
                    <button className="btn btn-default btn-submit" onClick={() => this.props.showAdminUserForm()}>Create
                        User</button>
                    //: <div style={{height: '10px'}}></div>
                }


                <BootstrapTable options={this.options} data={this.props.AdminUsers} striped={true}
                                hoveNr={true}>
                    <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                    <TableHeaderColumn width="20%" dataField="firstName" dataSort={true}>First Name</TableHeaderColumn>
                    <TableHeaderColumn width="20%" dataField="lastName">Last Name</TableHeaderColumn>
                    <TableHeaderColumn width="26%" dataField="roles"
                                       dataFormat={this.formatRole}>Roles</TableHeaderColumn>
                    <TableHeaderColumn width="22%" dataField="email">Email</TableHeaderColumn>
                    <TableHeaderColumn width="8%" dataField='button' dataFormat={this.editCellButton.bind(this)}><i
                        className="fa fa-pencil"></i></TableHeaderColumn>
                    <TableHeaderColumn width="8%" dataField='button'
                                       dataFormat={this.deleteCellButton.bind(this)}><i className="fa fa-trash"></i>
                    </TableHeaderColumn>

                </BootstrapTable>
            </div>
        )
    }
}

export default AdminUserList

