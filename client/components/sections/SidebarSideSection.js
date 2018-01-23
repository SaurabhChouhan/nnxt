import React from 'react'

const SidebarSideSection = (props) => <div class="sidebarSideSection">
    <ul class="list-unstyled">
        <li><a href=""><i class="fa fa-th-large"></i></a></li>
        <li><a href=""><i class="fa fa-bell-o"></i></a></li>
        <li><a href=""><i class="fa fa-clock-o"></i></a></li>
    </ul>
    <ul class="list-unstyled bottom-option">
        <li><a href=""><i class="fa fa-cog"></i></a></li>
        <li class="sub-menu-parent" tab-index="0"><a href=""><i class="fa fa-user-o"></i></a>
            <ul class="sub-menu">
                <i class="down-arrow"></i>
                <li><a href="">Edit Profile</a></li>
                <li><a href="/logout">Logout</a></li>
            </ul>
        </li>
    </ul>
</div>

export default SidebarSideSection