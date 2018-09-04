import React, {Component} from 'react'
import {Field, formValueSelector, reduxForm} from 'redux-form'
import {
    renderDateTimePickerString,
    renderMultiSelect,
    renderSelect,
    renderText
} from './fields'
import {required} from "./validation"
import moment from 'moment'
import momentTZ from 'moment-timezone'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'
import _ from "lodash";

moment.locale('en')
momentLocalizer()
let UpdateReleaseForm = (props) => {
    const {pristine, submitting, reset, change} = props
    const {team, managers, leaders, devStartDate, devReleaseDate, clientReleaseDate, manager, leader, project, module, projects, modules, developmentTypes, technologies} = props
    let max = !_.isEmpty(devReleaseDate) ? moment(devReleaseDate).toDate() : !_.isEmpty(clientReleaseDate) ? moment(clientReleaseDate).toDate() : undefined
    let maxRelease = !_.isEmpty(clientReleaseDate) ? moment(clientReleaseDate).toDate() : undefined
    let projectModules = project && project._id ? modules.filter(m => m.project._id.toString() === project._id.toString()) : modules
    let moduleProjects = []

    if (module && module._id && (!project || !project._id)) {
        let selectedModule = modules.find(m => m._id.toString() === module._id.toString())
        moduleProjects = projects.filter(p => p._id.toString() === selectedModule.project._id.toString())
    } else {
        moduleProjects = projects
    }

    /*
        While creating/adding release to an estimation, an user which is chosen as a Manager cannot be chosen as Leader and vice versa.
        A manager/leader can be chose as Developer if they have that role as well.
    */

    let updatedManagerList = leader && leader._id ? managers.filter(m => m._id.toString() !== leader._id.toString()) : managers
    let updatedLeaderList = manager && manager._id ? leaders.filter(l => l._id.toString() !== manager._id.toString()) : leaders
    let now = new Date()

    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="developmentType._id" component={renderSelect} label={"Development Type:"}
                           options={developmentTypes}
                           displayField={"name"} validate={[required]}/>
                </div>
            </div>

            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="manager._id"
                           component={renderSelect}
                           label={"Manager Of Release:"}
                           options={updatedManagerList}
                           validate={required}
                           valueField="_id"
                           displayField="Name"
                    />
                </div>
                <div className="col-md-6">
                    <Field name="leader._id"
                           component={renderSelect}
                           label={"Leader Of Release:"}
                           options={updatedLeaderList}
                           validate={required}
                           valueField="_id"
                           displayField="Name"
                    />
                </div>
            </div>

            <div className="col-md-12">
                <div className="col-md-12">
                    <Field name="team"
                           component={renderMultiSelect}
                           label={"Planned Employees For Release:"}
                           data={team}
                           validate={required}
                           textField="name"
                           valueField="_id"
                    />
                </div>
            </div>

        </div>
        <div className="row initiatEstimation">
            <div className="col-md-6 text-center">
                <button type="submit" disabled={pristine || submitting} className="btn customBtn">Submit</button>
            </div>
            <div className="col-md-6 text-center">
                <button type="button" disabled={pristine || submitting} onClick={reset} className="btn customBtn">
                    Reset
                </button>
            </div>
        </div>
    </form>
}

UpdateReleaseForm = reduxForm({
    form: 'update-release'
})(UpdateReleaseForm)

const selector = formValueSelector('create-release')

UpdateReleaseForm = connect(
    state => {
        const {devStartDate, devReleaseDate, clientReleaseDate} = selector(state, 'devStartDate', 'devReleaseDate', 'clientReleaseDate')
        const manager = selector(state, 'manager')
        const leader = selector(state, 'leader')
        const _id = selector(state, '_id')
        const project = selector(state, 'project')
        const module = selector(state, 'module')
        return {
            _id,
            project,
            module,
            devStartDate,
            devReleaseDate,
            clientReleaseDate,
            manager,
            leader
        }
    }
)(UpdateReleaseForm)

export default UpdateReleaseForm