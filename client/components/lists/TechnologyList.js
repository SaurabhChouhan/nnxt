import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import {ConfirmationDialog} from "../index";
import * as CM from "../../clientMsg"

class TechnologyList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showTechnologyDeletionDialog: false,
            addRow: null
        }

    }

    onClose() {
        this.setState({showTechnologyDeletionDialog: false})
    }

    OkConfimationForDeleteTechnology() {
        this.setState({showTechnologyDeletionDialog: false})
        this.props.deleteTechnology(this.state.addRow)
    }

    viewDeleteButton(cell, row, enumObject, rowIndex) {


        return (<button className=" btn btn-custom" type="button" onClick={() => {
                this.setState({showTechnologyDeletionDialog: true}),
                    this.setState({addRow: row._id})
            }}>
                <i className="fa fa-trash"></i>
            </button>
        )

    }


    render() {
        return (
            <div>{this.state.showTechnologyDeletionDialog &&
            <ConfirmationDialog show={true} onConfirm={this.OkConfimationForDeleteTechnology.bind(this)}
                                title={CM.DELETE_TECHNOLOGY} onClose={this.onClose.bind(this)}
                                body={CM.DELETE_TECHNOLOGY_BODY}/>
            }

                <div key="technology_list" className="clearfix">


                    <div className="col-md-12">
                        <div className="col-md-12 pad">

                            <div className="col-md-12">
                                <button className="btn customBtn"
                                        onClick={() => this.props.showTechnologyAdditionForm()}>Add Technology
                                </button>

                                <div className="estimation">

                                    <BootstrapTable options={this.options} data={this.props.technologies}
                                                    striped={true}
                                                    hover={true}>
                                        <TableHeaderColumn columnTitle isKey dataField='_id'
                                                           hidden={true}>ID</TableHeaderColumn>
                                        <TableHeaderColumn columnTitle dataField='name'>Technology
                                            Name</TableHeaderColumn>

                                        <TableHeaderColumn width="30%" dataField='button'
                                                           dataFormat={this.viewDeleteButton.bind(this)}>Delete
                                        </TableHeaderColumn>

                                    </BootstrapTable>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(TechnologyList)
