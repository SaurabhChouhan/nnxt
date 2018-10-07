import {Field, formValueSelector, reduxForm} from 'redux-form'
import React from 'react'
import {renderDateTimePickerString, renderMultiSelect, renderSelect, renderText} from './fields'
import * as CC from '../../clientconstants'
import {number, required, requiredMulti} from "./validation"
import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'
import {connect} from 'react-redux'
import _ from 'lodash'

moment.locale('en')
momentLocalizer()

let CreateReleaseForm = (props) => {
    const {pristine, submitting, reset, change} = props
    const {team, managers, leaders, devStartDate, devReleaseDate, releaseType, client} = props
    const {clientReleaseDate, manager, leader, project, module, projects, modules, developmentTypes, technologies, clients} = props
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

    let showRemainingForm = false

    if (releaseType && releaseType == CC.RELEASE_TYPE_CLIENT) {
        if (client && client._id) {
            // client is selected after selecting release type as client we will show remaining fields
            showRemainingForm = true
        }
    } else if (releaseType) {
        // Since release type is not client we will just show remaining projects
        showRemainingForm = true
    }

    return <form onSubmit={props.handleSubmit}>
        <div className="row">
            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="releaseType" component={renderSelect} label={"Release Type:"}
                           options={CC.RELEASE_TYPES}
                           validate={[required]}
                           onChange={(event, newValue) => {
                               if (newValue == CC.RELEASE_TYPE_INTERNAL) {
                                   // release type is internal, fetch all the projects of Aripra only
                                   props.fetchProjects(CC.CLIENT_ARIPRA)
                               } else if (newValue == CC.RELEASE_TYPE_CLIENT) {
                                   // In this case we will just show client drop down and on selection of appropriate client we will show its project
                                   change('client._id', null)
                               }
                           }}
                    />
                </div>

                {releaseType && releaseType == CC.RELEASE_TYPE_CLIENT &&
                <div className="col-md-6">
                    <Field name="client._id" component={renderSelect} label={"Client :"} options={clients}
                           validate={[required]}
                           onChange={(event, newValue) => {
                               console.log("new value ", newValue)
                               props.fetchProjects(newValue)
                           }}
                    />
                </div>
                }
            </div>

            {showRemainingForm &&
            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="releaseVersionName" component={renderText} validate={[required]}
                           label={"Name (Release Version):"}/>
                </div>
                <div className="col-md-6">
                    <Field name="developmentType._id" component={renderSelect} label={"Development Type:"}
                           options={developmentTypes}
                           displayField={"name"} validate={[required]}/>
                </div>
            </div>
            }

            {showRemainingForm && (releaseType == CC.RELEASE_TYPE_INTERNAL || releaseType == CC.RELEASE_TYPE_CLIENT) &&
            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="project._id"
                           component={renderSelect}
                           label={"Project:"}
                           options={moduleProjects}
                           validate={[required]}
                    />
                </div>
                <div className="col-md-6">
                    <Field name="module._id"
                           component={renderSelect}
                           label={"Module:"}
                           options={projectModules}
                           displayField={"firstName"}
                    />
                </div>
            </div>
            }

            {showRemainingForm && (releaseType == CC.RELEASE_TYPE_CLIENT || releaseType == CC.RELEASE_TYPE_INTERNAL || releaseType == CC.RELEASE_TYPE_TRAINING) &&
            <div className="col-md-12">
                <div className="col-md-12">
                    <Field name="technologies" component={renderMultiSelect} label="technologies:"
                           data={technologies} validate={[requiredMulti]}/>
                </div>
            </div>
            }

            {showRemainingForm && (releaseType == CC.RELEASE_TYPE_CLIENT || releaseType == CC.RELEASE_TYPE_INTERNAL) &&
            <div className="col-md-12">
                <div className="col-md-4">
                    <Field name="devStartDate" component={renderDateTimePickerString}
                           min={now}
                           max={max}
                           showTime={false}
                           label={"Start Date:"} validate={[required]}/>
                </div>
                <div className="col-md-4">
                    <Field name="devReleaseDate" component={renderDateTimePickerString}
                           min={moment(devStartDate).toDate()}
                           max={maxRelease}
                           showTime={false}
                           label={"End Date:"} validate={[required]}/>
                </div>

                <div className="col-md-4">
                    <Field name="clientReleaseDate" component={renderDateTimePickerString}
                           min={moment(devReleaseDate).toDate()}
                           showTime={false}
                           label={"Release Date:"}
                           validate={required}/>
                </div>
            </div>
            }

            {showRemainingForm && (releaseType == CC.RELEASE_TYPE_TRAINING || releaseType == CC.RELEASE_TYPE_JOBS) &&
            <div className="col-md-12">
                <div className="col-md-6">
                    <Field name="devStartDate" component={renderDateTimePickerString}
                           min={now}
                           max={max}
                           showTime={false}
                           label={"Start Date:"} validate={[required]}/>
                </div>
                <div className="col-md-6">
                    <Field name="devReleaseDate" component={renderDateTimePickerString}
                           min={moment(devStartDate).toDate()}
                           max={maxRelease}
                           showTime={false}
                           label={"End Date:"} validate={[required]}/>
                </div>
            </div>
            }

            {showRemainingForm &&
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
            }

            {showRemainingForm &&
            <div className="col-md-12">
                <div className="col-md-12">
                    <Field name="team"
                           component={renderMultiSelect}
                           label={"Planned Employees For Release:"}
                           data={team}
                           validate={requiredMulti}
                           textField="name"
                           valueField="_id"
                    />
                </div>
            </div>
            }

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

CreateReleaseForm = reduxForm({
    form: 'create-release'
})(CreateReleaseForm)

const selector = formValueSelector('create-release')

CreateReleaseForm = connect(
    state => {
        const {devStartDate, devReleaseDate, clientReleaseDate, releaseType, manager, leader, project, module, _id, client}
            =
            selector(state, 'devStartDate', 'devReleaseDate', 'clientReleaseDate', 'releaseType', 'manager', 'leader', 'project', 'module', '_id', 'client')

        return {
            _id,
            project,
            module,
            devStartDate,
            devReleaseDate,
            clientReleaseDate,
            manager,
            leader,
            releaseType,
            client
        }
    }
)(CreateReleaseForm)

export default CreateReleaseForm