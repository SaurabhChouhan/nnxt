import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import {ConfirmationDialog} from "../index";


class TechnologyList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showTechnologyDeletionDialog: false,
            addRow:null


        }

    }
    onClose() {
        this.setState({showTechnologyDeletionDialog: false})
        console.log("onClose",this.state.showTechnologyDeletionDialog)
    }
    OkConfimationForDeleteTechnology() {
        this.setState({showTechnologyDeletionDialog: false})
        this.props.deleteTechnology(this.state.addRow)
    }

    viewButton(cell, row, enumObject, rowIndex) {


        return (<button className="fa fa-trash" type="button" onClick={() => {
                 this.setState({showTechnologyDeletionDialog: true}),
                 this.setState({addRow:row._id})
            }}>

            </button>
        )

    }


    render() {
        return (
            <div>{this.state.showTechnologyDeletionDialog &&
            <ConfirmationDialog show={true} onConfirm={this.OkConfimationForDeleteTechnology.bind(this)}
                                title="Delete Technology" onClose={this.onClose.bind(this)}
                                body="You are about to delete Technology. are you sure you want to delete,Please confirm!"/>
            }

            <div key="technology_list" className="clearfix">


                <div className="col-md-12">
                    <div className="col-md-12 pad">

                        <div className="col-md-12">
                            <button className="btn customBtn"
                                    onClick={() => this.props.showTechnologyAdditionForm()}>Add Technology
                            </button>

                        <div className="technology">

                            <BootstrapTable options={this.options} data={this.props.technologies}
                                            striped={true}
                                            hover={true}>
                                <TableHeaderColumn columnTitle isKey dataField='_id'
                                                   hidden={true}>ID</TableHeaderColumn>
                                <TableHeaderColumn columnTitle dataField='name'>Technology Name</TableHeaderColumn>

                                <TableHeaderColumn width="30%" dataField='button' dataFormat={this.viewButton.bind(this)} ><i className="fa fa-trash"></i>
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
