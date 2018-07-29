import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {BarChart, XAxis, YAxis, Tooltip, Legend, Bar, LabelList, ResponsiveContainer} from 'recharts'


const addPercentage = (value) => {
    console.log("formatter called with value ", value)
    if(value == 0)
        return ''
    return value + '%'
}

class DashboardSection extends Component {
    constructor(props) {
        super(props);
    }

    onReleaseSelect(releaseID) {
        this.props.setReleaseID(releaseID)
    }


    render() {

        console.log("DashboardSection->render() called", window.innerWidth, window.innerHeight)

        let dashboardWidth = window.innerWidth * 0.8 // as content section has 80% width

        console.log("dashboard width is ", dashboardWidth)
        let barMargin = {top: 20, right: 20, left: 30, bottom: 30}
        let barWidth = (dashboardWidth - barMargin.left * 2 - barMargin.right * 2) / 2
        console.log("bar width calculated as ", barWidth)

        const {selectedReleaseID, allReleases} = this.props
        return <div>
            <div className="col-md-12">
                <div className="col-md-4 ">
                    <div>
                        <select
                            value={selectedReleaseID}
                            className="form-control"
                            title="Select Flag"

                            onChange={(release) =>
                                this.onReleaseSelect(release.target.value)
                            }>
                            {
                                allReleases && allReleases.length ? allReleases.map((release, idx) =>
                                    <option
                                        key={idx}
                                        value={release._id}>
                                        {release.project.name} ({release.name})
                                    </option>) : null
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className={"col-md-6"}>
                <BarChart data={this.props.actualProgress}
                          height={100} width={barWidth} margin={barMargin} layout={"vertical"}>
                    <XAxis type="number" hide={true}/>
                    <YAxis type="category" dataKey={"name"} hide={true}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="progress" stackId="a" fill="#6CE190">
                        <LabelList dataKey="progress" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar dataKey="remaining" stackId="a" fill="#E25858">
                        <LabelList dataKey="remaining" position="inside" formatter={addPercentage}/>
                    </Bar>
                </BarChart>

                <BarChart data={this.props.completedProgress}
                          height={130} width={barWidth} margin={{top: 20, right: 20, left: 30, bottom: 60}} layout={"vertical"}>
                    <XAxis type="number" hide={true}/>
                    <YAxis type="category" dataKey={"name"} hide={true}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="completed" stackId="a" fill="#6CE190">
                        <LabelList dataKey="completed" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar dataKey="pending" stackId="a" fill="#f5f968">
                        <LabelList dataKey="pending" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar dataKey="remaining" stackId="a" fill="#E25858">
                        <LabelList dataKey="remaining" position="inside" formatter={addPercentage}/>
                    </Bar>
                </BarChart>
            </div>
            <div className={"col-md-6"}>
                <BarChart data={this.props.plannedWork}
                          height={100} width={barWidth} margin={barMargin} layout={"vertical"}>
                    <XAxis type="number" hide={true}/>
                    <YAxis type="category" dataKey={"name"} hide={true}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="planned" stackId="a" fill="#6CE190">
                        <LabelList dataKey="planned" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar dataKey="unplanned" stackId="a" fill="#E25858">
                        <LabelList dataKey="unplanned" position="inside" formatter={addPercentage}/>
                    </Bar>
                </BarChart>
            </div>

        </div>
    }
}

export default withRouter(DashboardSection)

