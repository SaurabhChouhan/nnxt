import React from 'react'
import {SidebarSideSection} from "./"
import {SidebarSection} from './'

const Sidebar = (props) => <div className="sidebar-wrapper">
    <div className="web_logo">
        <img src={'/images/logo.png'}/>
    </div>
    <SidebarSideSection/>
    <SidebarSection/>
</div>

export default Sidebar