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

const getProgressAngles = (actualProgress, plannedProgress, reportedProgress) => {

    let maxProgress = Math.max(actualProgress, plannedProgress, reportedProgress)
    if (maxProgress < 100)
        maxProgress = 100

    let actualProgressStartAngle = 180, plannedProgressStartAngle = 180, reportedProgressStartAngle = 180
    let actualProgressEndAngle = 0, plannedProgressEndAngle = 0, reportedProgressEndAngle = 0;

    if (maxProgress == actualProgress) {
        // estimated hours are maximum
        actualProgressEndAngle = -180
        plannedProgressEndAngle = 180 - (plannedProgress / maxProgress) * 360
        reportedProgressEndAngle = 180 - (plannedProgress * 360) / maxProgress
    } else if (maxProgress == plannedProgress) {
        plannedProgressEndAngle = -180
        actualProgressEndAngle = 180 - (actualProgress * 360) / maxProgress
        reportedProgressEndAngle = 180 - (reportedProgress * 360) / maxProgress
    } else if (maxProgress == reportedProgress) {
        reportedProgressEndAngle = -180
        actualProgressEndAngle = 180 - (actualProgress * 360) / maxProgress
        plannedProgressEndAngle = 180 - (plannedProgress * 360) / maxProgress
    } else {
        actualProgressEndAngle = 180 - (actualProgress * 360) / maxProgress
        reportedProgressEndAngle = 180 - (reportedProgress * 360) / maxProgress
        plannedProgressEndAngle = 180 - (plannedProgress * 360) / maxProgress
    }

    return {
        actualProgressStartAngle,
        actualProgressEndAngle,
        plannedProgressStartAngle,
        plannedProgressEndAngle,
        reportedProgressStartAngle,
        reportedProgressEndAngle
    }
}

const renderPieCenter = ({cx, cy, value}) => {
    return (
        <text x={cx} y={cy} fill="#4172c1" fontSize={"20"} fontWeight={"bold"} textAnchor={'middle'} dominantBaseline="middle">
            {`${value}`}
        </text>
    );
};

const renderPercentagePieCenter = ({cx, cy, value}) => {
    return (
        <text x={cx} y={cy} fill="#4172c1" fontSize={"20"} fontWeight={"bold"} textAnchor={'middle'} dominantBaseline="middle">
            {`${value}%`}
        </text>
    );
};

const renderPercentage = ({cx, cy, value}) => {
    return value + '%'
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
        const {actualProgressStartAngle, actualProgressEndAngle, plannedProgressStartAngle, plannedProgressEndAngle, reportedProgressStartAngle, reportedProgressEndAngle} = getProgressAngles(this.props.progress.actual, this.props.progress.planned, this.props.progress.reported)
        let baseHour = this.props.plannedVsReported.baseHour
        let plannedColor = '#ffa75b', reportedColor = '#e52d8c', actualColor = '#4172c1', completedColor = '#6CE190',
            pendingColor = '#f5f968', unfinishedColor = '#E25858'


        return <div>
            <div className={"col-md-6"} style={{marginRight: "0px"}}>
                <div className={"chartSection"}>
                    <BarChart data={[this.props.overallProgress]}
                              height={80} width={barWidth} layout={"vertical"} margin={barMargin}>
                        <XAxis type="number" hide={true}/>
                        <YAxis type="category" dataKey={"name"} hide={true}/>
                        <Tooltip/>
                        <Legend/>
                        <Bar barSize={10} dataKey="progress" stackId="a" fill={completedColor}
                             name={"Overall Progress"}>
                            <LabelList dataKey="progress" position="top" formatter={addPercentage}/>
                        </Bar>
                        <Bar barSize={10} dataKey="remaining" stackId="a" fill={unfinishedColor} name={"Unfinished"}>
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
                        <Bar barSize={10} dataKey="completed" stackId="a" fill={completedColor}
                             name={"Progress (Completed Tasks)"}>
                            <LabelList dataKey="completed" position="top" formatter={addPercentage}/>
                        </Bar>
                        <Bar barSize={10} dataKey="pending" stackId="a" fill={pendingColor}
                             name={"Progress (Pending Tasks)"}>
                            <LabelList dataKey="pending" position="top" formatter={addPercentage}/>
                        </Bar>
                        <Bar barSize={10} dataKey="remaining" stackId="a" fill={unfinishedColor} name={"Unfinished"}>
                            <LabelList dataKey="remaining" position="top" formatter={addPercentage}/>
                        </Bar>
                    </BarChart>
                </div>

                <div className={"chartSection"}>
                    <PieChart width={barWidth} height={240} margin={{top: 40, right: 0, left: 0, bottom: 20}}>
                        <Pie isAnimationActive={false}
                             dataKey={"value"}
                             data={[{name: 'Actual Progress', value: this.props.progress.actual}]}
                             cx={barWidth / 2}
                             cy={80} outerRadius={60} innerRadius={52} startAngle={actualProgressStartAngle}
                             endAngle={actualProgressEndAngle} fill={actualColor}
                             label={renderPercentagePieCenter}
                             labelLine={false}/>
                        <Pie isAnimationActive={false}
                             dataKey={"value"}
                             data={[{name: 'Planned Progress', value: this.props.progress.planned}]}
                             cx={barWidth / 2}
                             cy={80} outerRadius={70} innerRadius={62} startAngle={plannedProgressStartAngle}
                             endAngle={plannedProgressEndAngle} fill={plannedColor}
                             label={renderPercentage}/>
                        <Pie isAnimationActive={false}
                             dataKey={"value"}
                             data={[{name: 'Reported Hours', value: this.props.progress.reported}]}
                             cx={barWidth / 2}
                             cy={80} outerRadius={80} innerRadius={72} startAngle={reportedProgressStartAngle}
                             endAngle={reportedProgressEndAngle} fill={reportedColor}
                             label={renderPercentage}/>/>
                        <Legend/>
                        <Tooltip/>
                    </PieChart>
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
                        <Bar barSize={10} dataKey="planned" stackId="a" fill={completedColor} name={"Planned Work"}>
                            <LabelList dataKey="planned" position="top" formatter={addPercentage}/>
                        </Bar>
                        <Bar barSize={10} dataKey="unplanned" stackId="a" fill={unfinishedColor}
                             name={"Unplanned Work"}>
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
                             fill={baseHour === 'planned' ? plannedColor : reportedColor}
                             name={baseHour === 'planned' ? 'Planned Hours' : 'Reported Hours'}>
                            <LabelList dataKey="base" position="top"/>
                        </Bar>
                        <Bar barSize={10} dataKey="extra" stackId="a"
                             fill={baseHour === 'planned' ? reportedColor : plannedColor}
                             name={baseHour === 'planned' ? 'Extra Reported Hours' : 'Extra Planned Hours'}>
                            <LabelList dataKey="extra" position="top"/>
                        </Bar>
                    </BarChart>
                </div>
                <div className={"chartSection"}>
                    <PieChart width={barWidth} height={240} margin={{top: 40, right: 0, left: 0, bottom: 20}}>
                        <Pie isAnimationActive={false}
                             dataKey={"value"}
                             data={[{name: 'Estimated Hours', value: this.props.hoursData.estimatedHours}]}
                             cx={barWidth / 2}
                             cy={80} outerRadius={60} innerRadius={52} startAngle={estimatedStartAngle}
                             endAngle={estimatedEndAngle} fill={actualColor}
                             label={renderPieCenter}
                             labelLine={false}/>
                        <Pie isAnimationActive={false}
                             dataKey={"value"}
                             data={[{name: 'Planned Hours', value: this.props.hoursData.plannedHours}]}
                             cx={barWidth / 2}
                             cy={80} outerRadius={70} innerRadius={62} startAngle={plannedStartAngle}
                             endAngle={plannedEndAngle} fill={plannedColor}
                             label/>
                        <Pie isAnimationActive={false}
                             dataKey={"value"}
                             data={[{name: 'Reported Hours', value: this.props.hoursData.reportedHours}]}
                             cx={barWidth / 2}
                             cy={80} outerRadius={80} innerRadius={72} startAngle={reportedStartAngle}
                             endAngle={reportedEndAngle} fill={reportedColor}
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

