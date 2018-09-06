import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'
import {CREATE_USER, DELETE_USER, EDIT_EMAIL_TEMPLATE, DELETE_EMAIL_TEMPLATE, EDIT_USER} from "../../clientconstants"

class EmailTemplateList extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-10">
                    <button className="btn btn-default btn-submit addBtn" onClick={() => this.props.showEmailTemplateForm()}>
                        Create Template
                    </button>

                    <BootstrapTable striped={true}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="templateName">Name</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="templateType">Type</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="templateSubject">Subject</TableHeaderColumn>
                        <TableHeaderColumn width="5%" dataField="status"><i className="fa fa-check"></i></TableHeaderColumn>
                        <TableHeaderColumn width="5%" dataField='button'><i className="fa fa-pencil"></i></TableHeaderColumn>
                        <TableHeaderColumn width="5%" dataField='button'><i className="fa fa-trash"></i></TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

export default EmailTemplateList