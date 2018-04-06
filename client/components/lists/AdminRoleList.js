import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'

class AdminRoleList extends Component {
    constructor(props) {
        super(props);
    }

    editCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-pencil pull-left btn btn-custom" type="button"
                        onClick={() => this.props.editPermissionsOfRole(row)}>
            </button>
        )
    }

    formatPermission(permissions, row) {
        if (permissions && permissions.length > 0) {
            // Only permissions that are enabled would be visible here
            return permissions.filter(p => p.enabled && p.configurable).map(p => p.name).join(", ")
        }
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
                    <BootstrapTable options={this.options} data={this.props.roles} striped={true}
                                    hoveNr={true}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>

                        <TableHeaderColumn width="26%" dataField="name"
                        >Roles</TableHeaderColumn>
                        <TableHeaderColumn width="46%" dataField="permissions" dataSort={true}
                                           dataFormat={this.formatPermission}>Permissions</TableHeaderColumn>

                        <TableHeaderColumn width="8%" dataField='button' dataFormat={this.editCellButton.bind(this)}><i
                            className="fa fa-pencil"></i></TableHeaderColumn>

                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

export default AdminRoleList