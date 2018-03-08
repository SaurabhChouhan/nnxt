import {Field, reduxForm} from 'redux-form'
import React from 'react'
import {renderText} from './fields'

let EstimationSearchForm = (props) => {
    return <form onSubmit={props.handleSubmit}>

        <Field name="search" className="form-control" component={renderText} placeholder="Search Features/Tasks"/>
        <button type="submit" className="btn searchBtn"><i className="fa fa-search"></i></button>
    </form>
}

EstimationSearchForm = reduxForm({
    form: 'estimation-search'
})(EstimationSearchForm)

export default EstimationSearchForm