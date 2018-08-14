import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {BarChart, XAxis, YAxis, Tooltip, Legend, Bar, LabelList, PieChart, Pie} from 'recharts'


const addPercentage = (value) => {
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

        let dashboardWidth = window.innerWidth * 0.8 // as content section has 80% width
        let barMargin = {top: 20, right: 40, left: 40, bottom: 20}
        let barWidth = (dashboardWidth - 90) / 2
        const {estimatedStartAngle, estimatedEndAngle, plannedStartAngle, plannedEndAngle, reportedStartAngle, reportedEndAngle} = getHoursAngles(this.props.hoursData.estimatedHours, this.props.hoursData.plannedHours, this.props.hoursData.reportedHours)
        let baseHour = this.props.plannedVsReported.baseHour
        return <div>
            <div className={"col-md-6"} style={{marginRight:"0px"}}>
                <div className={"chartSection"}>
                    <BarChart data={[this.props.overallProgress]}
                              height={80} width={barWidth} layout={"vertical"} margin={barMargin}>
                        <XAxis type="number" hide={true}/>
                        <YAxis type="category" dataKey={"name"} hide={true}/>
                        <Tooltip/>
                        <Legend/>
                        <Bar barSize={10} dataKey="progress" stackId="a" fill="#6CE190" name={"Overall Progress"}>
                            <LabelList dataKey="progress" position="top" formatter={addPercentage}/>
                        </Bar>
                        <Bar barSize={10} dataKey="remaining" stackId="a" fill="#E25858" name={"Unfinished"}>
                            <LabelList dataKey="remaining" position="top" formatter={addPercentage}/>
                        </Bar>
                    </BarChart>
                </div>

                <div className={"chartSection"}>
                    <BarChart data={[this.props.completedPendingProgress]}
                              height={80} width={barWidth} margin={barMargin}
                              layout={"vertical"}>
                        <XAxis type="number" hide={true}/>
                        <YAxis type="category" dataKey={"name"} hide={true}/>
                        <Legend/>
                        <Bar barSize={10} dataKey="completed" stackId="a" fill="#6CE190"
                             name={"Progress (Completed Tasks)"}>
                            <LabelList dataKey="completed" position="top" formatter={addPercentage}/>
                        </Bar>
                        <Bar barSize={10} dataKey="pending" stackId="a" fill="#f5f968"
                             name={"Progress (Pending Tasks)"}>
                            <LabelList dataKey="pending" position="top" formatter={addPercentage}/>
                        </Bar>
                        <Bar barSize={10} dataKey="remaining" stackId="a" fill="#E25858" name={"Unfinished"}>
                            <LabelList dataKey="remaining" position="top" formatter={addPercentage}/>
                        </Bar>
                    </BarChart>
                </div>

                <div className={"chartSection"}>

                    <BarChart data={[this.props.estimatedProgress]}
                              height={80} width={barWidth} margin={barMargin}
                              layout={"vertical"} barGap={30}>
                        <XAxis type="number" hide={true}/>
                        <YAxis type="category" dataKey={"name"} hide={true}/>
                        <Legend/>
                        <Bar barSize={10} dataKey="planned" fill="#f2e974" stackId="planned"
                             name={"Estimated Progress (Per Planned)"}>
                            <LabelList dataKey="planned" position="top" formatter={addPercentage}/>
                        </Bar>
                        <Bar barSize={10} dataKey="remainingPlanned" stackId="planned" fill="#E25858"
                             name={"Remaining (Planned)"}>
                            <LabelList dataKey="remainingPlanned" position="top" formatter={addPercentage}/>
                        </Bar>
                    </BarChart>
                </div>

                <div className={"chartSection"}>

                    <BarChart data={[this.props.estimatedProgress]}
                              height={80} width={barWidth} margin={barMargin}
                              layout={"vertical"} barGap={30}>
                        <XAxis type="number" hide={true}/>
                        <YAxis type="category" dataKey={"name"} hide={true}/>
                        <Legend/>
                        <Bar barSize={10} dataKey="reported" fill="#5cd1d1" stackId="reported"
                             name={"Estimated Progress (Per Reporting)"}>
                            <LabelList dataKey="reported" position="top" formatter={addPercentage}/>
                        </Bar>
                        <Bar barSize={10} dataKey="remainingReported" stackId="reported" fill="#E25858"
                             name={"Remaining (Report)"}>
                            <LabelList dataKey="remainingReported" position="top" formatter={addPercentage}/>
                        </Bar>

                    </BarChart>
                </div>

            </div>
            <div className={"col-md-6"}>
                <div className={"chartSection"}>
                    <BarChart data={[this.props.plannedVsUnplannedWork]}
                              height={80} width={barWidth} layout={"vertical"} margin={barMargin}>
                        <XAxis type="number" hide={true}/>
                        <YAxis type="category" dataKey={"name"} hide={true}/>
                        <Tooltip/>
                        <Legend/>
                        <Bar barSize={10} dataKey="planned" stackId="a" fill="#6CE190" name={"Planned Work"}>
                            <LabelList dataKey="planned" position="top" formatter={addPercentage}/>
                        </Bar>
                        <Bar barSize={10} dataKey="unplanned" stackId="a" fill="#E25858" name={"Unplanned Work"}>
                            <LabelList dataKey="unplanned" position="top" formatter={addPercentage}/>
                        </Bar>
                    </BarChart>
                </div>
                <div className={"chartSection"}>
                    <BarChart data={[this.props.plannedVsReported]}
                              height={80} width={barWidth} layout={"vertical"} margin={barMargin}>
                        <XAxis type="number" hide={true}
                               domain={[0, this.props.plannedVsReported.base + this.props.plannedVsReported.extra]}/>
                        <YAxis type="category" dataKey={"name"} hide={true}/>
                        <Tooltip/>
                        <Legend/>
                        <Bar barSize={10} dataKey="base" stackId="a"
                             fill={baseHour === 'planned' ? '#f2e974' : '#5cd1d1'}
                             name={baseHour === 'planned' ? 'Planned Hours' : 'Reported Hours'}>
                            <LabelList dataKey="base" position="top"/>
                        </Bar>
                        <Bar barSize={10} dataKey="extra" stackId="a" fill="#E25858"
                             name={baseHour === 'planned' ? 'Extra Reported Hours' : 'Extra Planned Hours'}>
                            <LabelList dataKey="extra" position="top"/>
                        </Bar>
                    </BarChart>
                </div>
                <div className={"chartSection"}>
                    <PieChart width={barWidth} height={240} margin={barMargin}>
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
                             data={[{name: 'Planned Hours', value: this.props.hoursData.plannedHours}]}
                             cx={barWidth / 2}
                             cy={80} outerRadius={70} innerRadius={62} startAngle={plannedStartAngle}
                             endAngle={plannedEndAngle} fill="#f2e974"
                             label/>
                        <Pie isAnimationActive={false}
                             dataKey={"value"}
                             data={[{name: 'Reported Hours', value: this.props.hoursData.reportedHours}]}
                             cx={barWidth / 2}
                             cy={80} outerRadius={80} innerRadius={72} startAngle={reportedStartAngle}
                             endAngle={reportedEndAngle} fill="#5cd1d1"
                             label/>
                        <Legend/>
                        <Tooltip/>
                    </PieChart>
                </div>

            </div>
        </div>
    }
}

export default withRouter(DashboardSection)

