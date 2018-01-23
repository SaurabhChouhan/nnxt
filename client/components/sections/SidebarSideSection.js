import React from 'react'

const SidebarSideSection = (props) => <div class="sidebarSideSection">
    <ul class="list-unstyled">
        <li><a href=""><i class="fa fa-th-large"></i></a></li>
        <li><a href=""><i class="fa fa-bell-o"></i></a></li>
        <li><a href=""><i class="fa fa-clock-o"></i></a></li>
    </ul>
    <ul class="dropdown list-unstyled bottom-option">
        <li><a href=""><i class="fa fa-cog"></i></a></li>
        <li class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown"><a href=""><i class="fa fa-user-o"></i></a>
            <ul class="dropdown-menu">
                <li><a href="#">Sub Item 1</a></li>
                <li><a href="#">Sub Item 2</a></li>
            </ul>
        </li>
    </ul>
</div>

export default SidebarSideSection