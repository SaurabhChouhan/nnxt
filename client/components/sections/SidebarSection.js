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
                        props.dispatch(A.showComponentHideOthers(COC.CLIENT_FORM))
                    }}>Client</Link></li>
                    <li><Link to="/app-home/estimation" onClick={() => {
                        props.dispatch(A.getAllEstimationsFromServer())
                        props.dispatch(A.showComponentHideOthers(COC.ESTIMATION_LIST))

                    }}>Estimation</Link></li>
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