import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderDateTimePickerString, renderDateTimeStringShow, renderField} from './fields'
import {required} from "./validation"
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import * as SC from '../../../server/serverconstants'

moment.locale('en')
momentLocalizer()
let ReleaseMoveTaskPlanForm = (props) => {
    const {handleSubmit, submitting, pristine, reset, selectedIteration} = props
    const devStartDateMoment = moment(selectedIteration.devStartDate).hour(0).minute(0).second(0).milliseconds(0)
    const devEndDateMoment = moment(selectedIteration.devEndDate).hour(0).minute(0).second(0).milliseconds(0)


    const min = devStartDateMoment.toDate()
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
                       component={renderDateTimePickerString}
                       readOnly={true}
                       showTime={false}
                       min={min}
                       max={max}
                       formate={SC.DATE_DISPLAY_FORMAT}
                       label={"Current Date:"}
                       validate={[required]}
                       read
                />


                <Field name="rePlanningDate"
                       placeholder={"Date"}
                       component={renderDateTimePickerString}
                       showTime={false}
                       min={min}
                       max={max}
                       label={"Move to Date :"}
                       validate={[required]}
                />


                {/*<Field name="planning.plannedHours" placeholder={"Enter Hours"} component={renderText}
                       label={"Estimated Hours:"} validate={[required, number]}/>
                */}
            </div>

            <div className="col-md-12">
                <div className="col-md-4">
                    <button type="submit" className="btn customBtn" disabled={submitting || pristine}>
                        Move
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

ReleaseMoveTaskPlanForm = reduxForm({
    form: 'move-task-planning'
})(ReleaseMoveTaskPlanForm)

export default ReleaseMoveTaskPlanForm