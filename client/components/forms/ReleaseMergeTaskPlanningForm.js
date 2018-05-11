import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderDateTimeStringShow, renderField} from './fields'
import {required} from "./validation"
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import * as SC from '../../../server/serverconstants'

moment.locale('en')
momentLocalizer()
let ReleaseMergeTaskPlanningForm = (props) => {
    const {change, team, handleSubmit, submitting, pristine, reset, initial} = props
    const today = new Date()
    const todayMoment = moment(today).hour(0).minute(0).second(0).milliseconds(0)
    const devStartDateMoment = moment(initial.devStartDate).hour(0).minute(0).second(0).milliseconds(0)
    const devEndDateMoment = moment(initial.devEndDate).hour(0).minute(0).second(0).milliseconds(0)


    const min = devStartDateMoment.isSameOrAfter(todayMoment) ? devStartDateMoment.toDate() : todayMoment.toDate()
    const max = devEndDateMoment.toDate()
    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-10">

                <Field name="release._id" component="input" type="hidden"/>

                <Field name="task.name"
                       readOnly
                       component={renderField}
                       label={" Task Name : "}
                       validate={[required]}
                />

                <Field name="planningDateString"
                       placeholder={"Date"}
                       component={renderDateTimeStringShow}
                       showTime={false}
                       min={min}
                       max={max}
                       formate={SC.DATE_AND_DAY_SHOW_FORMAT}
                       label={"Planning Date : "}
                       validate={[required]}
                />

                <div className="col-md-8">
                    <Field name="rePlanningDate"
                           placeholder={"Date"}
                           component={renderDateTimePickerString}
                           showTime={false}
                           min={min}
                           max={max}
                           label={"Merge to Date :"}
                           validate={[required]}
                    />
                </div>

                {/*<Field name="planning.plannedHours" placeholder={"Enter Hours"} component={renderText}
                       label={"Estimated Hours:"} validate={[required, number]}/>
                */}
            </div>

            <div className="col-md-12">
                <div className="col-md-4">
                    <button type="submit" className="btn customBtn" disabled={submitting || pristine}>
                        Merge Task
                    </button>
                </div>
                <div className="col-md-4">
                    <button type="button" className="btn customBtn" disabled={submitting || pristine} onClick={reset}>
                        Reset
                    </button>
                </div>
            </div>

        </div>

    </form>
}

ReleaseMergeTaskPlanningForm = reduxForm({
    form: 'merge-task-planning'
})(ReleaseMergeTaskPlanningForm)

export default ReleaseMergeTaskPlanningForm