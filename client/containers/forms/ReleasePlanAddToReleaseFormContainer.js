import {connect} from 'react-redux'
import {ReleasePlanAddToReleaseForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as SC from '../../../server/serverconstants'
import moment from 'moment'

const mapDispatchToProps = (dispatch, ownProps) => ({
    submitForm: (values, filteredData) => {
        console.log("values",values)

        let task={
            description: values.description,
            employee: values.employee,
            planning: values.planning,
            planningDate: values.planningDate,
            release: values.release,
            releasePlan: {_id:""},
            task: {},
            workCalendarEmployeeIDs: []
        }
        console.log("task", task)
        if (values.iteration_type === SC.ITERATION_TYPE_PLANNED) {
            values.estimatedHours = Number(values.estimatedHours)
            values.estimatedBilledHours = parseInt(values.estimatedBilledHours)
            dispatch(A.releasePlanPlannedAddToReleaseOnServer(values)).then(json => {
                if (json.success) {
                    console.log(json.data)
                    // dispatch(A.getReleasePlansFromServer(values.release._id, SC.ALL, SC.ALL))
                    dispatch(A.getReleaseFromServer(values.release._id, true))
                    var monthMoment = moment();
                    task.task= json.data.task;
                    task.releasePlan._id = json.data._id;
                    console.log("task", task)
                    if(values.addDayTask) {
                        values.planning.plannedHours = Number(values.planning.plannedHours)
                        dispatch(A.getEmployeeWorkCalendarFromServer(SC.ALL, [{_id: SC.RELEASE_TYPE_CLIENT}], monthMoment.month(), monthMoment.year(), values.release._id)).then(newjson => {
                            if (newjson.success) {
                                console.log(newjson)
                                newjson.data.employees.map((data) => {
                                    task.workCalendarEmployeeIDs.push(data._id)
                                    console.log("newjson", data, task.workCalendarEmployeeIDs)
                                    return data
                                })
                                dispatch(A.addTaskPlanningOnServer(task)).then(data=>{
                                    console.log("addTaskPlanningOnServer", data)
                                    dispatch(A.searchReleasePlansOnServer(filteredData))
                                })
                            }
                        })
                    }
                    else{
                        console.log("addDayTask = ", values.addDayTask)
                        dispatch(A.searchReleasePlansOnServer(filteredData))
                    }
                    console.log("task", task)
                    NotificationManager.success("Release Plan Added")
                    dispatch(A.hideComponent(COC.RELEASE_PLAN_ADD_TO_RELEASE_FORM_DIALOG))
                }

            })
        }
        else {
            dispatch(A.releasePlanUnplannedAddToReleaseOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success("Added Unplanned To Release")
                    // hide dialog
                    dispatch(A.searchReleasePlansOnServer(filteredData))
                    dispatch(A.hideComponent(COC.RELEASE_PLAN_ADD_TO_RELEASE_FORM_DIALOG))
                }
                // dispatch(A.getReleasePlansFromServer(values.release._id, SC.ALL, SC.ALL))
            })
        }

    }
})

const mapStateToProps = (state, ownProps) => ({
    release: state.release.selectedRelease,
    releasePlans: state.release.releasePlans,
    iterations: SC.ITERATION_TYPE_LIST_WITH_NAME,
    filteredData: state.release.releasePlanFilters
})

const ReleasePlanAddToReleaseFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleasePlanAddToReleaseForm)

export default ReleasePlanAddToReleaseFormContainer