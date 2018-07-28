import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {BarChart, XAxis, YAxis, Tooltip, Legend, Bar, LabelList, ResponsiveContainer} from 'recharts'


const addPercentage = (value) => {
    console.log("formatter called with value ", value)
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

        console.log("DashboardSection->render() called")

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


            <div className={"col-md-12"}>
                <BarChart width={500} height={100} data={this.props.plannedWork}
                          margin={{top: 20, right: 30, left: 20, bottom: 5}} layout={"vertical"}>
                    <XAxis type="number" hide={true}/>
                    <YAxis type="category" dataKey={"name"} hide={true}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="planned" stackId="a" fill="#8884d8">
                        <LabelList dataKey="planned" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar dataKey="unplanned" stackId="a" fill="#82ca9d">
                        <LabelList dataKey="unplanned" position="inside" formatter={addPercentage}/>
                    </Bar>
                </BarChart>
            </div>
        </div>

    }
}

export default withRouter(DashboardSection)

