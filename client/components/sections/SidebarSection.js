import React from 'react'
import {SidebarSideSection} from "./"

const SidebarSection = (props) => <section class="sidebar">
    <div class="clearfix">
        <div class="sidebarContent">
            <div class="col-md-12 pad">
                <ul class="list-unstyled">
                    <li><a href="">Repository</a></li>
                    <li class="Expandlist"><a href="">Estimations</a>
                        <ul class="Expandedlist">
                            <li><a href="#">Create New</a> </li>
                            <li><a href="#">History</a> </li>
                            <li><a href="#">Edit</a> </li>
                            <li><a href="#">Delete</a> </li>
                        </ul>
                    </li>
                    <li><a href="">Releases</a></li>
                    <li><a href="">Daily Reporting</a></li>
                </ul>
            </div>
        </div>
    </div>
</section>

export default SidebarSection