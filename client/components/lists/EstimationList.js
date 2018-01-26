import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import Dialog from 'react-bootstrap-dialog'
import _ from 'lodash'

class EstimationList extends Component {

    constructor(props) {
        super(props);
        this.options = {
            onRowClick: this.onRowClick
        }
    }

    onRowClick(row) {
        console.log("row clicked ", row)
    }

    formatProject(project) {
        if(project)
            return project.name
        return ''
    }

    formatClient(client) {
        if(client)
            return client.name
        return ''
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-10">
                    <Dialog ref={(el) => {
                        this.dialog = el
                    }}/>

                    <button className="btn btn-default btn-submit addBtn"
                            onClick={() => this.props.showRoleForm()}>Add Estimations</button>

                    <BootstrapTable options={this.options} data={this.props.estimations}
                                    striped={true}
                                    hover={true}>
                        <TableHeaderColumn isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn dataField='project'
                                           dataFormat={this.formatProject.bind(this)}>Project</TableHeaderColumn>
                        <TableHeaderColumn dataField='client'
                                           dataFormat={this.formatClient.bind(this)}>Client</TableHeaderColumn>

                    </BootstrapTable>
                </div>
            </div>
        )
    }
}

export default EstimationList