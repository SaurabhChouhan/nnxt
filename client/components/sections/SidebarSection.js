import React from 'react'
import {SidebarSideSection} from "./"
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import * as A from '../../actions'
import * as COC from '../componentConsts'

const SidebarSection = (props) => <section className="sidebar">
    <div className="clearfix">
        <div className="sidebarContent">
            <div className="col-md-12 pad">
                <ul className="list-unstyled">
                    <li><Link to="/app-home/client" onClick={() => {
                        props.dispatch(A.getAllClientsFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.CLIENT_LIST))
                    }}>Client</Link></li>
                    <li><Link to="/app-home/projects" onClick={() => {
                        props.dispatch(A.getAllClientsFromServer())
                        props.dispatch(A.getAllProjectsFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.PROJECT_LIST))
                    }}>Projects</Link></li>
                    <li><Link to="/app-home/technology" onClick={() => {
                        props.dispatch(A.getAllTechnologiesFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.TECHNOLOGIES_LIST))
                    }}>Technology</Link></li>
                    <li><Link to="/app-home/estimation" onClick={() => {
                        props.dispatch(A.getAllEstimationsFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.ESTIMATION_LIST))

                    }}>Estimation</Link></li>
                    <li><Link to="/app-home/raise_leave" onClick={() => {
                        props.dispatch(A.showComponent(COC.LEAVE_REQUEST_FORM_DIALOG))}}
                        >Raise-leave</Link></li>
                    {/*
                    <li className="Expandlist"><a href="">Estimations</a>
                        <ul className="Expandedlist">
                            <li><a href="#">Create New</a> </li>
                            <li><a href="#">History</a> </li>
                            <li><a href="#">Edit</a> </li>
                            <li><a href="#">Delete</a> </li>
                        </ul>
                    </li>
                    <li><a href="">Releases</a></li>
                    <li><a href="">Daily Reporting</a></li>
                    */}
                </ul>
            </div>
        </div>
    </div>
</section>

export default connect()(SidebarSection)