import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {BarChart, XAxis, YAxis, Tooltip, Legend, Bar, LabelList, PieChart, Pie} from 'recharts'


const addPercentage = (value) => {
    console.log("formatter called with value ", value)
    if (value == 0)
        return ''
    return value + '%'
}

const getHoursAngles = (estimatedHours, plannedHours, reportedHours) => {
    let maxHours = Math.max(estimatedHours, plannedHours, reportedHours)
    let estimatedStartAngle = 180, plannedStartAngle = 180, reportedStartAngle = 180
    let estimatedEndAngle = 0, plannedEndAngle = 0, reportedEndAngle = 0;

    if (maxHours == estimatedHours) {
        // estimated hours are maximum
        estimatedEndAngle = -180
        plannedEndAngle = 180 - (plannedHours / maxHours) * 360
        reportedEndAngle = 180 - (reportedHours * 360) / maxHours
    } else if (maxHours == plannedHours) {
        plannedEndAngle = -180
        estimatedEndAngle = 180 - (estimatedHours * 360) / maxHours
        reportedEndAngle = 180 - (reportedHours * 360) / maxHours
    } else {
        reportedEndAngle = -180
        estimatedEndAngle = 180 - (estimatedHours * 360) / maxHours
        plannedEndAngle = 180 - (plannedHours * 360) / maxHours
    }

    return {
        estimatedStartAngle,
        estimatedEndAngle,
        plannedStartAngle,
        plannedEndAngle,
        reportedStartAngle,
        reportedEndAngle
    }
}

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({cx, cy, value}) => {
    return (
        <text x={cx} y={cy} fill="#d35ba1" fontWeight={"bold"} textAnchor={'middle'} dominantBaseline="middle">
            {`${value}`}
        </text>
    );
};


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

        const {estimatedStartAngle, estimatedEndAngle, plannedStartAngle, plannedEndAngle, reportedStartAngle, reportedEndAngle} = getHoursAngles(this.props.hoursData.estimatedHours, this.props.hoursData.plannedHours, this.props.hoursData.reportedHours)
        console.log(estimatedEndAngle, plannedEndAngle, reportedEndAngle)

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
                    <Bar dataKey="progress" stackId="a" fill="#6CE190" name={"Overall Progress"}>
                        <LabelList dataKey="progress" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar dataKey="remaining" stackId="a" fill="#E25858" name={"Unfinished"}>
                        <LabelList dataKey="remaining" position="inside" formatter={addPercentage}/>
                    </Bar>
                </BarChart>

                <BarChart data={this.props.completedProgress}
                          height={100} width={barWidth} margin={{top: 20, right: 20, left: 30, bottom: 30}}
                          layout={"vertical"}>
                    <XAxis type="number" hide={true}/>
                    <YAxis type="category" dataKey={"name"} hide={true}/>
                    <Legend/>
                    <Bar dataKey="completed" stackId="a" fill="#6CE190" name={"Progress (Completed Tasks)"}>
                        <LabelList dataKey="completed" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar dataKey="pending" stackId="a" fill="#f5f968" name={"Progress (Pending Tasks)"}>
                        <LabelList dataKey="pending" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar dataKey="remaining" stackId="a" fill="#E25858" name={"Unfinished"}>
                        <LabelList dataKey="remaining" position="inside" formatter={addPercentage}/>
                    </Bar>
                </BarChart>
                <PieChart width={barWidth} height={200}>

                    <Pie isAnimationActive={false}
                         data={[{name: 'Estimated Hours', value: this.props.hoursData.estimatedHours}]}
                         cx={barWidth / 2}
                         cy={80} outerRadius={60} innerRadius={40} startAngle={estimatedStartAngle}
                         endAngle={estimatedEndAngle} fill="#d35ba1"
                         label={renderCustomizedLabel}
                         labelLine={false}
                    />

                    <Pie isAnimationActive={false}
                         data={[{name: 'Planned Hours', value: this.props.hoursData.plannedHours}]} cx={barWidth / 2}
                         cy={80} outerRadius={70} innerRadius={62} startAngle={plannedStartAngle}
                         endAngle={plannedEndAngle} fill="#f2e974"
                         label/>

                    <Pie isAnimationActive={false}
                         data={[{name: 'Reported Hours', value: this.props.hoursData.reportedHours}]} cx={barWidth / 2}
                         cy={80} outerRadius={80} innerRadius={72} startAngle={reportedStartAngle}
                         endAngle={reportedEndAngle} fill="#5cd1d1"
                         label/>

                    <Legend/>

                    <Tooltip/>
                </PieChart>
            </div>
            <div className={"col-md-6"}>
                <BarChart data={this.props.plannedWork}
                          height={100} width={barWidth} margin={barMargin} layout={"vertical"}>
                    <XAxis type="number" hide={true}/>
                    <YAxis type="category" dataKey={"name"} hide={true}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="planned" stackId="a" fill="#6CE190" name={"Planned Work"}>
                        <LabelList dataKey="planned" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar dataKey="unplanned" stackId="a" fill="#E25858" name={"Unplanned Work"}>
                        <LabelList dataKey="unplanned" position="inside" formatter={addPercentage}/>
                    </Bar>
                </BarChart>

            </div>
        </div>
    }
}

export default withRouter(DashboardSection)

