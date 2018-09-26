import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'

class PermissionList extends Component {

    constructor(props) {
        super(props);
    }

    editCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-pencil pull-left btn customBtn" type="button"
                        onClick={() => this.props.editPermission(row, rowIndex)}>
            </button>
        )
    }

    deleteCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-trash pull-left btn customBtn" type="button"
                        onClick={() => {
                            this.dialog.show({
                                title: "Delete Permission",
                                body: "Are You Sure want to delete this permission",
                                actions: [
                                    Dialog.DefaultAction('Delete', () => {
                                        this.props.deleteUser(row._id)
                                    }, 'customBtn'),
                                    Dialog.DefaultAction('Close', () => {
                                        this.dialog.hide()
                                    }, 'customBtn')
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


    render() {
        return (
            <div className="clearfix">
                <div className="col-md-6">
                    <Dialog ref={(el) => {
                        this.dialog = el
                    }}/>

                    {(this.props.loggedInUser.isSuperAdmin) ?
                        <button className="btn customBtn btn-submit addBtn" style={{margin:'10px 0px'}}
                                onClick={() => this.props.showPermissionForm()}>
                            Add
                            Permission</button> : <div style={{height: '10px'}}></div>}

                    <BootstrapTable options={this.options} data={this.props.permissions}
                                    striped={true}
                                    hoveNr={true}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn dataField='name'>Name</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField='button' dataFormat={this.editCellButton.bind(this)}><i
                            className="fa fa-pencil"></i></TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField='button'
                                           dataFormat={this.deleteCellButton.bind(this)}><i className="fa fa-trash"></i>
                        </TableHeaderColumn>

                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

export default PermissionList