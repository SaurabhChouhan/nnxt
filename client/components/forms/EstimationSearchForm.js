import {Field, reduxForm} from 'redux-form'
import React from 'react'
import {renderSelect, renderText} from './fields'

let EstimationSearchForm = (props) => {
    const {projects} = props
    return <form onSubmit={props.handleSubmit} className="estimationForm">
        <div className="col-md-8">
            <Field name="search" className="form-control" component={renderText} placeholder="Search Features/Tasks"/>
            <button type="submit" className="btn estimationSearchBtn"><i className="fa fa-search"></i></button>
        </div>
        <div className="col-md-4">
            <Field
                name="projectID"
                className="form-control"
                component={renderSelect}
                placeholder="Select Project Name"
                options={projects}
                displayField="name"
                valueField="_id"
                noneOptionText = "All Projects"
                noneOptionValue = "All"
                onChange={(event, newValue, oldValue) => {
                    props.filterEstimationByProject(newValue)
                }}
            />
        </div>
    </form>
}

EstimationSearchForm = reduxForm({
    form: 'estimation-search'
})(EstimationSearchForm)

export default EstimationSearchForm