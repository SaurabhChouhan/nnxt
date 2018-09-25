import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'
import {CREATE_USER, DELETE_USER, EDIT_EMAIL_TEMPLATE, DELETE_EMAIL_TEMPLATE, EDIT_USER} from "../../clientconstants"
import {renderSelectForEmailTemplateType} from '../forms/fields'
import {Field,reduxForm} from 'redux-form'

class EmailTemplateList extends Component {

    constructor(props) {
        super(props);
    }

    editCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-pencil pull-left btn customBtn" type="button"
                        onClick={() =>this.props.editEmailTemplate(row)}>
            </button>
        )
    }



    statusCellButton(cell, row, enumObject, rowIndex) {
        return (<button className={row.status=="Approved"?"fa fa-lock pull-left btn customBtn":"fa fa-unlock pull-left btn customBtn"}
                        title={row.status=="Approved"?"Click To Block/Pending Template" : "Click To Unblock/Approve Template"}
                        type="button"
                        onClick={() => this.onClickEmailTemplateApproveSelected(cell, row, rowIndex)}>
            </button>
        )
    }

    onClickEmailTemplateApproveSelected(cell, row, rowIndex) {
        if(row.status=="Approved"){
            this.dialog.show({
                title: "Block Email Template",
                body: "Are you sure to block/pending this email template",
                actions: [
                    Dialog.DefaultAction('Block/Pending', () => {
                        this.props.emailTemplateApproveFLag(row);
                    },'customBtn'),

                    Dialog.DefaultAction('Close', () => {
                        this.dialog.hide()
                    }, 'customBtn')
                ],
                bsSize: 'small',
                onHide: (dialog) => {
                    this.dialog.hide()
                }
            })}else if(row.status=="Pending"){
            this.dialog.show({
                title: "Approve Email Template",
                body: "Are you sure to Unblock/Approve this email template",
                actions: [
                    Dialog.DefaultAction('Unblock/Approve', () => {
                        this.props.emailTemplateApproveFLag(row);
                    },'customBtn'),

                    Dialog.DefaultAction('Close', () => {
                        this.dialog.hide()
                    }, 'customBtn')
                ],
                bsSize: 'small',
                onHide: (dialog) => {
                    this.dialog.hide()
                }
            })
        }
    }

    deleteCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-trash pull-left btn customBtn" type="button"
                        onClick={() => {
                            this.dialog.show({
                                title: "Delete Template",
                                body: "Are you sure want to delete email template",
                                actions: [
                                    Dialog.DefaultAction('Delete', () => {
                                        this.props.deleteEmailTemplate(row._id)
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

    changeTemplateType(event) {
        let type = event.target.value
        this.props.getTemplateOnChange(type)
    }


    render() {
        return (
            <div className="clearfix">
                <div className="col-md-10">
                    <Dialog ref={(el) => {
                        this.dialog = el
                    }}/>
                    <button className="btn btn-default customBtn addBtn" style={{margin:'10px 0px'}} onClick={() => this.props.showEmailTemplateForm()}>
                        Create Template
                    </button>
                    <form style={{float:'left', width:'100%'}}>
                    <div className="col-md-4 col-md-offset-4 templateTypes">
                        <Field name="name" onChange={this.changeTemplateType.bind(this)} component={renderSelectForEmailTemplateType} label={"Template Type:"}
                               options={this.props.allEmailTemplatesTypes}
                               displayField={"name"} />
                    </div>
                    </form>
                    <BootstrapTable striped={true} hoveNR={true} options={this.options} data={this.props.emailTemplates}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="templateName">Name</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="templateType">Type</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="templateSubject">Subject</TableHeaderColumn>
                        <TableHeaderColumn width="8%" dataField="status">Status</TableHeaderColumn>
                        <TableHeaderColumn width="5%" dataField="status" dataFormat={this.statusCellButton.bind(this)}><i className="fa fa-check"></i></TableHeaderColumn>
                        <TableHeaderColumn width="5%" dataField='button' dataFormat={this.editCellButton.bind(this)}><i className="fa fa-pencil"></i></TableHeaderColumn>
                        <TableHeaderColumn width="5%" dataField='button' dataFormat={this.deleteCellButton.bind(this)}><i className="fa fa-trash"></i></TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

EmailTemplateList = reduxForm({
    form: 'emailTemplateList'
})(EmailTemplateList)

export default EmailTemplateList