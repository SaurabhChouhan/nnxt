import React, {Component} from 'react'
import {withRouter} from "react-router-dom";
import {
    BarChart,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Bar,
    LabelList,
    PieChart,
    Pie,
    CartesianGrid,
    ReferenceLine,
    Label
} from 'recharts'
import {NotificationManager} from "react-notifications";
import moment from "moment";


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
        <text x={cx} y={cy} fill="#4172c1" fontSize={"20"} fontWeight={"bold"} textAnchor={'middle'}
              dominantBaseline="middle">
            {`${value}`}
        </text>
    );
};

const renderPercentagePieCenter = ({cx, cy, value}) => {
    return (
        <text x={cx} y={cy} fill="#4172c1" fontSize={"20"} fontWeight={"bold"} textAnchor={'middle'}
              dominantBaseline="middle">
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
        this.state = {
            monthMoment: moment()
        }
    }

    componentDidMount() {
        console.log("ReleaseDashboardSection:componentDidMount()")
        this.props.getDashboardData(this.props.release)
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


        let planningsWidth = dashboardWidth - 150
        if (this.props.dailyPlannings && this.props.dailyPlannings.length)
            planningsWidth = 50 * this.props.dailyPlannings.length

        if (this.props.resetDailyPlanningMonth) {
            this.state.monthMoment = moment()
        }

        let releaseStartMonth = moment(this.props.release.devStartDate)
        let releaseEndMonth = moment(this.props.release.devEndDate)

        let beforeOrSameAsStartMonth = false
        let afterOrSameAsLastMonth = false
        if ((this.state.monthMoment.month() <= releaseStartMonth.month() && this.state.monthMoment.year() <= releaseStartMonth.year()) || this.state.monthMoment.year() < releaseStartMonth.year())
            beforeOrSameAsStartMonth = true
        if ((this.state.monthMoment.month() >= releaseEndMonth.month() && this.state.monthMoment.year() == releaseEndMonth.year()) || this.state.monthMoment.year() > releaseEndMonth.year())
            afterOrSameAsLastMonth = true

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
                        <Tooltip/>
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
                             data={[{name: 'Reported Progress', value: this.props.progress.reported}]}
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

            <div className={"col-md-2"}>
                <div className={"chartSection"}>
                    <BarChart data={[this.props.unplannedReport]}
                              height={120} width={(dashboardWidth - 120) / 6} layout={"vertical"} margin={barMargin}>
                        <XAxis type="number" hide={true}/>
                        <YAxis type="category" dataKey={"name"} hide={true}/>
                        <Tooltip/>
                        <Legend/>
                        <Bar barSize={10} dataKey="reportedHours" fill={reportedColor}
                             name={"Unplanned Reported Hours"}>
                            <LabelList dataKey="reportedHours" position="top"/>
                        </Bar>
                    </BarChart>
                </div>
            </div>
            <div className={"col-md-4"}>
                <div className={"chartSection"}>
                    <BarChart data={[this.props.mgmtData]}
                              height={120} width={(dashboardWidth - 120) / 3} layout={"vertical"}
                              margin={{top: 20, right: 40, left: 40, bottom: 20}}>
                        <XAxis type="number" hide={true}/>
                        <YAxis type="category" dataKey={"name"} hide={true}/>
                        <Tooltip/>
                        <Legend/>
                        <Bar barSize={10} dataKey="plannedBefore" fill={"#ffcb9e"}
                             name={"Planned Before"}>
                            <LabelList dataKey="plannedBefore" position="top"/>
                        </Bar>
                        <Bar barSize={10} dataKey="plannedAfter" fill={plannedColor}
                             name={"Planned After"}>
                            <LabelList dataKey="plannedAfter" position="top"/>
                        </Bar>
                        <ReferenceLine x={0} stroke='black' isFront={true}>
                            <Label value="0 Hours" position="top"/>
                        </ReferenceLine>

                    </BarChart>
                </div>
            </div>

            <div className={"col-md-4"}>
                <div className={"chartSection"}>
                    <BarChart data={[this.props.mgmtData]}
                              height={120} width={(dashboardWidth - 120) / 3} layout={"vertical"} margin={barMargin}>
                        <XAxis type="number" hide={true}/>
                        <YAxis type="category" dataKey={"name"} hide={true}/>
                        <Tooltip/>
                        <Legend/>
                        <Bar barSize={10} dataKey="plannedHoursOnLeave" stackId="a" fill={plannedColor} name={"PH (On Leave)"}>
                            <LabelList dataKey="plannedHoursOnLeave" position="top" />
                        </Bar>
                        <Bar barSize={10} dataKey="plannedHoursLastMinuteLeave" stackId="a" fill={unfinishedColor}
                             name={"PH (Last Minute)"}>
                            <LabelList dataKey="plannedHoursLastMinuteLeave" position="top" />
                        </Bar>
                    </BarChart>
                </div>
            </div>


            <div className={"col-md-2"}>
                <div className={"chartSection"}>
                    <BarChart data={[this.props.mgmtData]}
                              height={120} width={(dashboardWidth - 120) / 6} layout={"vertical"}
                              margin={{top: 20, right: 40, left: 40, bottom: 20}}>
                        <XAxis type="number" hide={true}/>
                        <YAxis type="category" dataKey={"name"} hide={true}/>
                        <Tooltip/>
                        <Legend/>
                        <Bar barSize={10} dataKey="reportedAfter" fill={"#d671a5"}
                             name={"Reported After"}>
                            <LabelList dataKey="reportedAfter" position="top"/>
                        </Bar>

                    </BarChart>
                </div>
            </div>



            <div className={"col-md-12"}>
                {!beforeOrSameAsStartMonth && <button className={"btn reportingArrow"}
                                                      style={{position: 'absolute', top: 93, left: 20}}
                                                      onClick={() => {
                                                          let newMonthMoment = this.state.monthMoment.subtract(1, 'month')
                                                          this.props.getReleaseDailyPlannings(this.props.release._id, newMonthMoment.month(), newMonthMoment.year())
                                                      }}
                                                      type="button">
                    <i className="glyphicon glyphicon-arrow-left"></i>
                </button>}

                <div className={"chartSection"}
                     style={{paddingRight: "0px", paddingLeft: "50px"}}>
                    <BarChart data={this.props.dailyPlannings}
                              height={250} width={planningsWidth}
                              margin={{top: 40, right: 0, left: 0, bottom: 20}}
                              barGap={2}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey={"planningDateString"} type={"category"}/>
                        <YAxis type="number"/>
                        <Tooltip/>
                        <Legend/>
                        <Bar barSize={12} dataKey="plannedHours"
                             fill={plannedColor}
                             name={'Planned Hours'}>
                            <LabelList dataKey="plannedHours" position="top"/>
                        </Bar>

                        <Bar barSize={12} dataKey="reportedHours"
                             fill={reportedColor}
                             name={'Reported Hours'}>
                            <LabelList dataKey="reportedHours" position="top"/>
                        </Bar>
                    </BarChart>
                </div>

                {!afterOrSameAsLastMonth && <button className={"btn reportingArrow"}
                                                    style={{position: 'absolute', top: 93, right: 20}}
                                                    onClick={() => {
                                                        let newMonthMoment = this.state.monthMoment.add(1, 'month')
                                                        this.props.getReleaseDailyPlannings(this.props.release._id, newMonthMoment.month(), newMonthMoment.year())
                                                    }}
                                                    type="button">
                    <i className="glyphicon glyphicon-arrow-right"></i>
                </button>}

            </div>
        </div>
    }
}

export default withRouter(DashboardSection)

