import React, {Component} from 'react'

class ReleaseDevelopersSchedules extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {schedules} = this.props
        return (
            <div>
                {
                    schedules && schedules.length ? schedules.map((schedule, idx) => <div key={'schedule' + idx}
                                                                                          className="col-md-12 releaseSchedule">
                            <div className="repository releaseDevInfo">
                                <div className="releaseDevHeading">
                                    <h5>Developer1</h5><i className="glyphicon glyphicon-resize-full pull-right"></i><span
                                    className="pull-right">26-feb to 29-feb</span>
                                </div>
                                <div className="releaseDayRow">
                                    <div className="releaseDayCell"><h5>Sun</h5></div>
                                    <div className="releaseDayCell"><h5>Mon</h5>
                                        <div className="estimationuser"><span>E</span></div>
                                    </div>
                                    <div className="releaseDayCell"><h5>Tue</h5>
                                        <div className="estimationuser"><span>E</span></div>
                                    </div>
                                    <div className="releaseDayCell"><h5>Wed</h5>
                                        <div className="estimationuser"><span>E</span></div>
                                    </div>
                                    <div className="releaseDayCell"><h5>Thu</h5>
                                        <div className="estimationuser"><span>E</span></div>
                                    </div>
                                    <div className="releaseDayCell"><h5>Fri</h5>
                                        <div className="estimationuser"><span>E</span></div>
                                    </div>
                                    <div className="releaseDayCell"><h5>Sat</h5>
                                        <div className="estimationuser"><span>E</span></div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    ) : <label>Employee is not selected</label>
                }

            </div>
        )
    }
}

export default ReleaseDevelopersSchedules