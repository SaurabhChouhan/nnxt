import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'
import * as SC from '../../../server/serverconstants'

class ProjectList extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <div key="project_list" className="row">
                <div className="col-md-10">
                    <button className="btn btn-default btn-submit addBtn"
                            onClick={() => this.props.showProjectCreationForm()}>Create Project
                    </button>

                    <BootstrapTable options={this.options} data={this.props.projects}
                                    striped={true}
                                    hover={true}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn dataField='name'>Project Name</TableHeaderColumn>


                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

export default withRouter(ProjectList)