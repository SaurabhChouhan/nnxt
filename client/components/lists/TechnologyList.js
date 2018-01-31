import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'
import _ from 'lodash'
class TechnologyList extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
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


                            </BootstrapTable>
                        </div>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(TechnologyList)
