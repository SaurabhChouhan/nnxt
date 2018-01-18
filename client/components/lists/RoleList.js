import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'
import {ROLE_ADMIN} from "../../clientconstants"
import _ from 'lodash'

class RoleList extends Component {

    constructor(props) {
        super(props);
    }

    editCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-pencil pull-left btn btn-custom" type="button"
                        onClick={() => this.props.editRole(row, rowIndex)}>
            </button>
        )
    }

    onClickCaseTypeDeleteSelected(cell, row, rowIndex) {

    }


    deleteCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-trash pull-left btn btn-custom" type="button"
                        onClick={() => {
                            this.dialog.show({
                                title: "Delete Role",
                                body: "",
                                actions: [
                                    Dialog.DefaultAction('Delete', () => {
                                        this.props.deleteRole(row._id)
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

    formatPermissions(permissions, row, enumObject, rowIndex) {
        if (Array.isArray(permissions) && permissions.length > 0)
            return _.join(permissions.map(p => p.name))
        return ''

    }

    render() {
        return (
            <div className="row">
                <div className="col-md-10">
                    <Dialog ref={(el) => {
                        this.dialog = el
                    }}/>

                    <button className="btn btn-default btn-submit addBtn"
                            onClick={() => this.props.showRoleForm()}>
                        Add
                        Role
                    </button>

                    <BootstrapTable options={this.options} data={this.props.roles}
                                    striped={true}
                                    hoveNr={true}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn width="15%" dataField='name'>Name</TableHeaderColumn>
                        <TableHeaderColumn dataField='permissions'
                                           dataFormat={this.formatPermissions.bind(this)}>Permissions</TableHeaderColumn>
                        <TableHeaderColumn width="8%" dataField='button' dataFormat={this.editCellButton.bind(this)}><i
                            className="fa fa-pencil"></i></TableHeaderColumn>
                        <TableHeaderColumn width="8%" dataField='button'
                                           dataFormat={this.deleteCellButton.bind(this)}><i
                            className="fa fa-trash"></i></TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

export default RoleList