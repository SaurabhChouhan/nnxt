import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'
import {CREATE_USER, DELETE_USER, EDIT_EMAIL_TEMPLATE, DELETE_EMAIL_TEMPLATE, EDIT_USER} from "../../clientconstants"

class EmailTemplateList extends Component {

    constructor(props) {
        super(props);
    }

    editCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-pencil pull-left btn btn-custom" type="button"
                        onClick={() =>this.props.editEmailTemplate(row)}>
            </button>
        )
    }

    statusCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-lock pull-left btn btn-custom" type="button">
            </button>
        )
    }

    deleteCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-trash pull-left btn btn-custom" type="button"
                        onClick={() => {
                            this.dialog.show({
                                title: "Delete Template",
                                body: "Are you sure want to delete email template",
                                actions: [
                                    Dialog.DefaultAction('Delete', () => {
                                        this.props.deleteEmailTemplate(row._id)
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

    render() {
        return (
            <div className="row">
                <div className="col-md-10">
                    <Dialog ref={(el) => {
                        this.dialog = el
                    }}/>
                    <button className="btn btn-default btn-submit addBtn" onClick={() => this.props.showEmailTemplateForm()}>
                        Create Template
                    </button>

                    <BootstrapTable striped={true} hoveNR={true} options={this.options} data={this.props.emailTemplates}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="templateName">Name</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="templateType">Type</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="templateSubject">Subject</TableHeaderColumn>
                        <TableHeaderColumn width="5%" dataField="status">Status</TableHeaderColumn>
                        <TableHeaderColumn width="5%" dataField="status" dataFormat={this.statusCellButton.bind(this)}><i className="fa fa-check"></i></TableHeaderColumn>
                        <TableHeaderColumn width="5%" dataField='button' dataFormat={this.editCellButton.bind(this)}><i className="fa fa-pencil"></i></TableHeaderColumn>
                        <TableHeaderColumn width="5%" dataField='button' dataFormat={this.deleteCellButton.bind(this)}><i className="fa fa-trash"></i></TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

export default EmailTemplateList