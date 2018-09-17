import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'
import Parser from 'html-react-parser'

/*const products = [
    {
        id: 1,
        name: 'Item name 1',
        price: 210
    },
    {
        id: 2,
        name: 'Item name 2',
        price: 2100
    }
]*/

/*const selectRowProp = {
    mode: 'checkbox',
    clickToSelect: false,
    onSelect: onRowSelect,
    onSelectAll: onSelectAll
};

function onRowSelect(row, isSelected, e) {
    let rowStr = '';
    for (const prop in row) {
        rowStr += prop + ': "' + row[prop] + '"';
    }
    console.log(e);
    console.log(`is selected: ${isSelected}, ${rowStr}`);
}

function onSelectAll(isSelected, rows) {
    console.log(`is select all: ${isSelected}`);
    if (isSelected) {
        console.log('Current display and selected data: ');
    } else {
        console.log('unselect rows: ');
    }
    for (let i = 0; i < rows.length; i++) {
        console.log(rows[i].id);
    }
}*/

class NotificationsPage extends Component {
    constructor(props) {
        super(props);
    }

    isExpandableRow() {
        return true;
    }

    expandComponent(row) {
        return (
            <div> {Parser(row.notificationBodyText)}</div>
        );
    }

    /*notificationBody(cell, row, enumObject, rowIndex){
        return(
            <div> {Parser(row.notificationBodyText)}</div>
        )
    }*/

    deleteCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-trash pull-left btn btn-custom" type="button"
                        onClick={() => this.onClickEmailDeleteSelected(cell, row, rowIndex)}>
            </button>
        )
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
            <BootstrapTable className={"notificationTable"} data={this.props.allNotifications}
                            expandableRow={ this.isExpandableRow }
                            expandComponent={ this.expandComponent }
                            expandColumnOptions={ { expandColumnVisible: true } }>
                <TableHeaderColumn dataField='_id' isKey={ true }>ID</TableHeaderColumn>
                {/*<TableHeaderColumn dataField='notificationBodyText'dataFormat={this.notificationBody.bind(this)}>Body</TableHeaderColumn>*/}
                <TableHeaderColumn dataField='created'>Date</TableHeaderColumn>
                <TableHeaderColumn width="8%" dataField='button'
                                   dataFormat={this.deleteCellButton.bind(this)}><i className="fa fa-trash"></i></TableHeaderColumn>
            </BootstrapTable>
        </div>)

    }
}

export default NotificationsPage