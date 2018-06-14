import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'
import {CREATE_USER, DELETE_USER, EDIT_USER} from "../../clientconstants"

class HolidayList extends Component {

    constructor(props) {
        super(props);
    }

    editCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-pencil pull-left btn btn-custom" type="button"
                        onClick={() => this.props.editHoliday(row)}>
            </button>
        )
    }

    deleteCellButton(cell, row, enumObject, rowIndex) {
        return (<button className="glyphicon glyphicon-trash pull-left btn btn-custom" type="button"
                        onClick={() => {
                            this.props.deleteHoliday(row)
                        }}>
            </button>
        )
    }


    render() {
        const {allYears, holidays} = this.props
        return (
            <div className="row">
                <div className="col-md-10">
                    <button className="btn btn-default btn-submit addBtn" onClick={() => this.props.showHolidayForm()}>
                        Create Holiday
                    </button>
                    <div className="tab">
                        {allYears.map((y, index) =>
                            <span key={"year" + index} onClick={() => {
                                this.props.getHolidaysOfYear(y)

                            }}>{y}</span>
                        )}
                    </div>


                    <BootstrapTable options={this.options} data={holidays} striped={true}
                                    hoveNr={true}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn width="26%" dataField="dateString">Date</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="holidayName" dataSort={true}>Holiday
                            Name</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="description"
                                           dataSort={true}>Description</TableHeaderColumn>
                        <TableHeaderColumn width="20%" dataField="holidayType" dataSort={true}>Holiday
                            Type</TableHeaderColumn>

                        <TableHeaderColumn width="8%" dataField='button' dataFormat={this.editCellButton.bind(this)}><i
                            className="fa fa-pencil"></i></TableHeaderColumn>

                        <TableHeaderColumn width="5%" dataField='button'
                                           dataFormat={this.deleteCellButton.bind(this)}><i className="fa fa-trash"></i>
                        </TableHeaderColumn>

                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

export default HolidayList