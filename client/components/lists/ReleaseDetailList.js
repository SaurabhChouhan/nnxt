import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'
import {withRouter} from 'react-router-dom'



class ReleaseDetailList extends Component {

    constructor(props) {
        super(props);
        this.options = {
            onRowClick: this.onRowClick.bind(this)
        }

    }

    onRowClick(row) {
        this.props.history.push("/app-home/release-project-detail")

    }


    formatStatus(status) {
        return ''
    }





    render() {
        return (
            <div key="estimation_list" className="clearfix">

                    <div className="col-md-12 releaseHeader">
                        <div className=" col-md-1 backarrow">
                            <a href=""><i className="glyphicon glyphicon-arrow-left"></i></a>
                        </div>
                        <div className="col-md-4">
                            <div className="releaseTitle">
                                <span>Project Name</span></div>
                            <div className="releasecontent">
                                <p>Accusation Nation (The Party Game)</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="releaseTitle">
                                <span>Project Description</span></div>
                            <div className="releasecontent">
                                <p>Accusation Nation....(Read More)</p>
                            </div>
                        </div>
                        <div className="col-md-1">
                            <div className="releaseTitle">
                                <span>Start Date</span></div>
                            <div className="releasecontent">
                                <p>01/12/2017</p>
                            </div>
                        </div>
                        <div className="col-md-1">
                            <div className="releaseTitle">
                                <span>End Date</span></div>
                            <div className="releasecontent">
                                <p>15/01/2018</p>
                            </div>
                        </div>
                        <div className=" col-md-2 releasefileoption">
                            <ul className="list-unstyled">
                                <li><a href=""> <i className="fa fa-file-pdf-o"></i></a></li>
                                <li><a href="">  <i className="fa fa-file-word-o"></i></a></li>
                                <li><a href=""> <i className=" fa fa-file-excel-o"></i></a></li>
                            </ul>
                        </div>

                    </div>
                <div className="col-md-12">
                    <div className="col-md-12 releaseOption" >
                        <div  className="col-md-4 pad ">
                            <div className="releaseTeam"><span>Team Members</span></div>

                            <div className="estimationuser"><span>AB</span> </div>
                            <div className="estimationuser"><span>CD</span></div>
                            <div className="estimationuser"><span>EF</span></div>
                            <div className="estimationuser"><span>GH</span></div>
                            <div className="estimationuser"><span>IJ</span></div>

                        </div>

                        <div className="col-md-5 ">
                            <div className="searchRelease">
                                <input type="text" className="form-control" placeholder="Search Features/Tasks"/>
                                    <button type="submit" className="btn searchBtn"><i className="fa fa-search"></i></button>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="releaseSelect">
                                <select className="form-control">
                                    <option value="">Employee Flags</option>
                                    <option value="">project1</option>
                                    <option value="">project2</option>
                                    <option value="">project3</option>
                                </select>
                            </div>
                        </div>


                    </div>
                    <div className="estimation">
                        <BootstrapTable options={this.options} data={this.props.estimations}
                                        striped={true}
                                        hover={true}>
                            <TableHeaderColumn columnTitle isKey dataField='_id' hidden={true}>ID</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='project'>Start Date</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='task'>Task Name</TableHeaderColumn>
                           <TableHeaderColumn columnTitle dataField='employee'>Emp. Name</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='flag'>Emp. Flag</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='estimated-hour'>Est Hours</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='status'>Status</TableHeaderColumn>
                            <TableHeaderColumn columnTitle dataField='requested-hour'>Requested Hours</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </div>
            </div>
        )
    }
}

export default ReleaseDetailList
