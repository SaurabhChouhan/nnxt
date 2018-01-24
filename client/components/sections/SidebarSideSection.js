import React from 'react'

const SidebarSideSection = (props) => <div className="sidebarSideSection">
    <ul className="list-unstyled">
        <li><a href=""><i className="fa fa-th-large"></i></a></li>
        <li><a href=""><i className="fa fa-bell-o"></i></a></li>
        <li><a href=""><i className="fa fa-clock-o"></i></a></li>
    </ul>
    <ul className="list-unstyled bottom-option">
        <li><a href=""><i className="fa fa-cog"></i></a></li>
        <li className="sub-menu-parent" tab-index="0"><a href=""><i className="fa fa-user-o"></i></a>
            <ul className="sub-menu">
                <i className="down-arrow"></i>
                <li><a href="">Edit Profile</a></li>
                <li><a href="/logout">Logout</a></li>
            </ul>
        </li>
    </ul>
</div>

export default SidebarSideSection