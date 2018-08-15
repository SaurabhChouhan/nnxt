import React, {Component} from 'react'
import {Field, reduxForm} from 'redux-form'
import {renderText, renderTextArea} from './fields'
import {required} from "./validation"
import * as logger from '../../clientLogger'

let ReportTaskDescriptionForm = (props) => {
    const {handleSubmit, pristine, reset, submitting} = props;
    logger.debug(logger.CLIENT_FORM_RENDER, props)
    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-6">
                <Field name="taskName"
                       component={renderText}
                       label={"Task Name"} readOnly={true}/>
            </div>
            <div className="col-md-6">
                <Field name="status"
                       component={renderText}
                       label={"Status you are reporting:"} readOnly={true}/>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <Field name="reportDescription"
                       placeholder={"Add details of work done on task '" + props.taskName + "' on date you are reporting for."}
                       component={renderTextArea}
                       label={"Add Details of Work Done"} validate={[required]} rows={10}/>

                <button type="submit" disabled={submitting} className="btn customBtn">Submit</button>
            </div>
        </div>

    </form>
}

ReportTaskDescriptionForm = reduxForm({
    form: 'report-task-description'
})(ReportTaskDescriptionForm)

export default ReportTaskDescriptionForm