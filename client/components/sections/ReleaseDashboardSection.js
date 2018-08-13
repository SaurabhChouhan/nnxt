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

        let baseHour = this.props.plannedVsReported.baseHour

        const {selectedReleaseID, allReleases} = this.props
        return <div>
            <div className={"col-md-6"}>
                <BarChart data={[this.props.overallProgress]}
                          height={100} width={barWidth} margin={barMargin} layout={"vertical"}>
                    <XAxis type="number" hide={true}/>
                    <YAxis type="category" dataKey={"name"} hide={true}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar barSize={30} dataKey="progress" stackId="a" fill="#6CE190" name={"Overall Progress"}>
                        <LabelList dataKey="progress" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar barSize={30} dataKey="remaining" stackId="a" fill="#E25858" name={"Unfinished"}>
                        <LabelList dataKey="remaining" position="inside" formatter={addPercentage}/>
                    </Bar>
                </BarChart>

                <BarChart data={[this.props.completedPendingProgress]}
                          height={100} width={barWidth} margin={{top: 20, right: 20, left: 30, bottom: 30}}
                          layout={"vertical"}>
                    <XAxis type="number" hide={true}/>
                    <YAxis type="category" dataKey={"name"} hide={true}/>
                    <Legend/>
                    <Bar barSize={30} dataKey="completed" stackId="a" fill="#6CE190" name={"Progress (Completed Tasks)"}>
                        <LabelList dataKey="completed" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar barSize={30} dataKey="pending" stackId="a" fill="#f5f968" name={"Progress (Pending Tasks)"}>
                        <LabelList dataKey="pending" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar barSize={30} dataKey="remaining" stackId="a" fill="#E25858" name={"Unfinished"}>
                        <LabelList dataKey="remaining" position="inside" formatter={addPercentage}/>
                    </Bar>
                </BarChart>

                <BarChart data={[this.props.estimatedProgress]}
                          height={240} width={barWidth} margin={{top: 20, right: 20, left: 30, bottom: 30}}
                          layout={"vertical"} barGap={30}>
                    <XAxis type="number" hide={true}/>
                    <YAxis type="category" dataKey={"name"} hide={true}/>
                    <Legend/>
                    <Bar barSize={30} dataKey="reported" fill="#5cd1d1" stackId="reported" name={"Estimated Progress (Per Reporting)"}>
                        <LabelList dataKey="reported"  position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar barSize={30} dataKey="remainingReported" stackId="reported" fill="#E25858" name={"Remaining (Report)"}>
                        <LabelList dataKey="remainingReported" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar barSize={30} dataKey="planned" fill="#f2e974" stackId="planned" name={"Estimated Progress (Per Planned)"}>
                        <LabelList dataKey="planned" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar barSize={30} dataKey="remainingPlanned" stackId="planned" fill="#E25858" name={"Remaining (Planned)"}>
                        <LabelList dataKey="remainingPlanned" position="inside" formatter={addPercentage}/>
                    </Bar>

                </BarChart>

            </div>
            <div className={"col-md-6"}>
                <BarChart data={[this.props.plannedVsUnplannedWork]}
                          height={100} width={barWidth} margin={barMargin} layout={"vertical"}>
                    <XAxis type="number" hide={true}/>
                    <YAxis type="category" dataKey={"name"} hide={true}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar barSize={30} dataKey="planned" stackId="a" fill="#6CE190" name={"Planned Work"}>
                        <LabelList dataKey="planned" position="inside" formatter={addPercentage}/>
                    </Bar>
                    <Bar barSize={30} dataKey="unplanned" stackId="a" fill="#E25858" name={"Unplanned Work"}>
                        <LabelList dataKey="unplanned" position="inside" formatter={addPercentage}/>
                    </Bar>
                </BarChart>
                <BarChart data={[this.props.plannedVsReported]}
                          height={100} width={barWidth} margin={barMargin} layout={"vertical"}>
                    <XAxis type="number" hide={true}
                           domain={[0, this.props.plannedVsReported.base + this.props.plannedVsReported.extra]}/>
                    <YAxis type="category" dataKey={"name"} hide={true}/>
                    <Tooltip/>
                    <Legend/>
                    <Bar barSize={30} dataKey="base" stackId="a" fill={baseHour === 'planned' ? '#f2e974' : '#5cd1d1'}
                         name={baseHour === 'planned' ? 'Planned Hours' : 'Reported Hours'}>
                        <LabelList dataKey="base" position="inside"/>
                    </Bar>
                    <Bar barSize={30} dataKey="extra" stackId="a" fill="#E25858"
                         name={baseHour === 'planned' ? 'Extra Reported Hours' : 'Extra Planned Hours'}>
                        <LabelList dataKey="extra" position="inside"/>
                    </Bar>
                </BarChart>
                <PieChart width={barWidth} height={240} margin={{top: 20, right: 20, left: 30, bottom: 30}}>
                    <Pie isAnimationActive={false}
                         dataKey={"value"}
                         data={[{name: 'Estimated Hours', value: this.props.hoursData.estimatedHours}]}
                         cx={barWidth / 2}
                         cy={80} outerRadius={60} innerRadius={40} startAngle={estimatedStartAngle}
                         endAngle={estimatedEndAngle} fill="#d35ba1"
                         label={renderCustomizedLabel}
                         labelLine={false}/>
                    <Pie isAnimationActive={false}
                         dataKey={"value"}
                         data={[{name: 'Planned Hours', value: this.props.hoursData.plannedHours}]} cx={barWidth / 2}
                         cy={80} outerRadius={70} innerRadius={62} startAngle={plannedStartAngle}
                         endAngle={plannedEndAngle} fill="#f2e974"
                         label/>
                    <Pie isAnimationActive={false}
                         dataKey={"value"}
                         data={[{name: 'Reported Hours', value: this.props.hoursData.reportedHours}]} cx={barWidth / 2}
                         cy={80} outerRadius={80} innerRadius={72} startAngle={reportedStartAngle}
                         endAngle={reportedEndAngle} fill="#5cd1d1"
                         label/>
                    <Legend/>
                    <Tooltip/>
                </PieChart>

            </div>
        </div>
    }
}

export default withRouter(DashboardSection)

