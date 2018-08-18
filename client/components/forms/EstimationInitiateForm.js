import {Field, formValueSelector, reduxForm} from 'redux-form'
import React from 'react'
import {required} from './validation'
import {renderMultiSelect, renderSelect, renderTextArea} from './fields'
import * as logger from '../../clientLogger'
import {connect} from 'react-redux'

let EstimationInitiateForm = (props) => {
    logger.debug(logger.ESTIMATION_INITIATE_FORM_RENDER, props)
    const {reset, pristine, submitting, handleSubmit} = props
    const {_id, project, module, projects, modules, estimators, developmentTypes, technologies} = props
    let projectModules = project && project._id ? modules.filter(m => m.project._id.toString() === project._id.toString()) : modules
    let moduleProjects = []
    if (module && module._id && (!project || !project._id)) {
        let selectedModule = modules.find(m => m._id.toString() === module._id.toString())
        moduleProjects = projects.filter(p => p._id.toString() === selectedModule.project._id.toString())
    } else {
        moduleProjects = projects
    }

    return <form onSubmit={handleSubmit}>
        <div className="row">
            <div className="col-md-6">
                <Field name="_id" component="input" className="form-control" type="hidden"></Field>
                <Field name="project._id" component={renderSelect} label={"Project:"} options={moduleProjects}
                       validate={[required]}/>
            </div>
            <div className="col-md-6">
                <Field name="module._id" component={renderSelect} label={"Module:"} options={projectModules}
                       displayField={"firstName"}/>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
                <Field name="estimator._id" component={renderSelect} label={"Estimator:"} options={estimators}
                       displayField={"firstName"} validate={[required]}/>
            </div>
            <div className="col-md-6">
                <Field name="developmentType._id" component={renderSelect} label={"Development Type:"}
                       options={developmentTypes}
                       displayField={"name"} validate={[required]}/>
            </div>

        </div>

        <div className="row">
            <div className="col-md-12">
                <Field name="technologies" component={renderMultiSelect} label="technologies:"
                       data={technologies}/>
            </div>
        </div>

        <div className="row">
            <div className="col-md-12">
                <Field name="description" component={renderTextArea} label="Description:" validate={[required]}
                       rows="10"/>
            </div>
        </div>
        <div className="row initiatEstimation">
            <div className="col-md-6 text-center">
                <button type="submit" disabled={pristine || submitting}
                        className="btn customBtn">
                    {(!_id && "Submit") || (_id && "Update")}
                </button>
            </div>
            <div className="col-md-6 text-center">
                <button type="button" disabled={pristine || submitting} className="btn customBtn" onClick={reset}>
                    Reset
                </button>
            </div>
        </div>
    </form>
}

EstimationInitiateForm = reduxForm({
    form: 'estimation-initiate'
})(EstimationInitiateForm)

const selector = formValueSelector('estimation-initiate')

EstimationInitiateForm = connect(
    state => {
        const _id = selector(state, '_id')
        const project = selector(state, 'project')
        const module = selector(state, 'module')
        return {
            _id,
            project,
            module
        }
    }
)(EstimationInitiateForm)

export default EstimationInitiateForm