import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'

class ClientList extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div key="client_list" className="clearfix">


                <div className="col-md-12">
                    <div className="col-md-12 pad">

                        <div className="col-md-12">
                            <button className="btn customBtn"
                                    onClick={() => this.props.showClientCreationForm()}>Create Client
                            </button>

                            <div className="client">

                                <BootstrapTable options={this.options} data={this.props.clients}
                                                striped={true}
                                                hover={true}>
                                    <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                                    <TableHeaderColumn dataField='name'>Client Name</TableHeaderColumn>


                                </BootstrapTable>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

        )
    }
}

export default withRouter(ClientList)