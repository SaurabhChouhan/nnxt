import React from 'react'
import {SidebarSection, SidebarSideSection} from "./"
import SidebarSectionContainer from '../../containers/sections/SidebarSectionContainer'

const Sidebar = (props) => <div className="sidebar-wrapper">
    <div className="web_logo">
        <img src="/images/logo.png"/>
    </div>
    <div className="user_name">
        <img src="/images/user.png" height="30" width="30"/> {props.loggedInUser.fullName}
    </div>
    <SidebarSideSection/>
    <SidebarSectionContainer/>
</div>

export default Sidebar