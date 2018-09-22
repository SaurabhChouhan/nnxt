import React from 'react'
import * as A from "../../actions";
import * as COC from "../componentConsts";
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

const SidebarSideSection = (props) => <div className="sidebarSideSection">
    <ul className="list-unstyled">
        <li><a href=""><i className="fa fa-th-large"></i></a></li>
        <li><Link to="/app-home/notifications-inbox" onClick={() => {
            props.dispatch(A.getAllActiveNotificationsFromServer())
            props.dispatch(A.getTodayNotifications())
            props.dispatch(A.showComponent(COC.NOTIFICATIONS_PAGE))}}>
            <i className="fa fa-bell-o"></i>
            <span>{console.log("props are: ", props.todayAllNotifications)}</span>
        </Link></li>
        <li><a href=""><i className="fa fa-clock-o"></i></a></li>
    </ul>
    <ul className="list-unstyled bottom-option">
        <li><a href=""><i className="fa fa-cog"></i></a></li>
        <li className="sub-menu-parent" tab-index="0"><a href=""><i className="fa fa-user-o"></i></a>
            <ul className="sub-menu">
                <i className="down-arrow"></i>
                <li><Link to="/app-home/edit-profile" onClick={() => {
                    props.dispatch(A.showComponent(COC.USER_PROFILE_FORM))
                }}>Edit Profile</Link></li>
                <li><a href="/logout">Logout</a></li>

            </ul>
        </li>
    </ul>
</div>

export default connect()(SidebarSideSection)