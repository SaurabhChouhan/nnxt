import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'
import Parser from 'html-react-parser'
import moment from "moment";

class NotificationsPage extends Component {
    constructor(props) {
        super(props);
    }

    isExpandableRow() {
        return true;
    }

    expandComponent(row) {
        if (row.message) {
            return <div> {row.message}</div>
        } else {
            return ""
        }
    }

    notificationTextFormated(cell, row, enumObject, rowIndex) {
        if (cell)
            return <div> {Parser(cell)}</div>
        else
            return ""

    }

    dateFormated(cell, row, enumObject, rowIndex) {
        if (cell)
            return moment(cell).format('YYYY-MM-DD HH:mm:ss')
        else
            return ""
    }

    onClickEmailDeleteSelected(cell, row, rowIndex) {
        this.dialog.show({
            title: "Remove Notification",
            body: "Are you sure want to remove this notification",
            actions: [
                Dialog.DefaultAction('Remove', () => {
                    this.props.deleteNotifications(row._id)
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


    render() {

        return (<div className="col-md-12">
            <Dialog ref={(el) => {
                this.dialog = el
            }}/>
            <h4><b>Today's Notifications:</b> <span
                className="validation-error">{this.props.todayAllNotifications}</span></h4>
            <BootstrapTable className={"notificationTable"} data={this.props.allNotifications}
                            expandableRow={this.isExpandableRow}
                            expandComponent={this.expandComponent}
                            expandColumnOptions={{expandColumnVisible: true}}>
                <TableHeaderColumn hidden={true} dataField='_id' isKey={true}>Subject</TableHeaderColumn>
                <TableHeaderColumn width="15%" dataField='type'>Type</TableHeaderColumn>
                <TableHeaderColumn width="70%" height="50px" dataField='message'
                                   dataFormat={this.notificationTextFormated.bind(this)}>Email Text</TableHeaderColumn>
                <TableHeaderColumn width="15%" dataField='activeOn'
                                   dataFormat={this.dateFormated.bind(this)}>Date</TableHeaderColumn>

            </BootstrapTable>
        </div>)

    }
}

export default NotificationsPage