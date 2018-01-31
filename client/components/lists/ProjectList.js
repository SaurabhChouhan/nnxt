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
            <div key="project_list" className="clearfix">


                <div className="col-md-12">
                    <div className="col-md-12 pad">

                        <div className="col-md-12">
                            <button className="btn customBtn"
                                    onClick={() => this.props.showProjectCreationForm()}>Create Project
                            </button>

                            <div className="projects">

                                <BootstrapTable options={this.options} data={this.props.projects}
                                                striped={true}
                                                hover={true}>
                                    <TableHeaderColumn columnTitle isKey dataField='_id'
                                                       hidden={true}>ID</TableHeaderColumn>
                                    <TableHeaderColumn columnTitle dataField='name'>Project Name</TableHeaderColumn>


                                </BootstrapTable>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(ProjectList)