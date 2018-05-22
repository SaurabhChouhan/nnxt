import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderDateTimePickerString} from './fields'
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'

moment.locale('en')
momentLocalizer()
let ReleaseDeveloperScheduleForm = (props) => {
    const {handleSubmit} = props

    return <form onSubmit={handleSubmit}>
        <div className="col-md-4">
            <label>From :</label>
            <Field component={renderDateTimePickerString} className="form-control "/>
        </div>
        <div className="col-md-4">
            <label>To :</label>
            <Field component={renderDateTimePickerString} className="form-control "/>
        </div>
        <div className="col-md-4 planchkSchedule">
            <input type="checkbox" value=""
                   className="checkbxInput"/><span>RelativeFree  </span>
        </div>
    </form>
}

ReleaseDeveloperScheduleForm = reduxForm({
    form: 'developer-Schedule'
})(ReleaseDeveloperScheduleForm)

export default ReleaseDeveloperScheduleForm