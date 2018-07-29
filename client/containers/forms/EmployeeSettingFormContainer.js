import {connect} from 'react-redux'
import {EmployeeSettingForm} from "../../components"
import {addEmployeeSettingOnServer, updateEmployeeSettingOnServer} from "../../actions"
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id) {
            // converted data into number format
            values.minPlannedHours = Number(values.minPlannedHours)
            values.maxPlannedHours = Number(values.maxPlannedHours)
            values.free = Number(values.free)
            values.relativelyFree = Number(values.relativelyFree)
            values.busy = Number(values.busy)
            values.superBusy = Number(values.superBusy)
            values.someWhatBusy = Number(values.someWhatBusy)
            // Employee Setting is created
            return dispatch(addEmployeeSettingOnServer(values)).then(response => {
                if (response.success) {
                    NotificationManager.success('Employee Setting Added Successfully')
                } else {
                    NotificationManager.error('Employee Setting Added Failed')
                }
            })
        } else {
            // Employee Setting is edited
            // converted data into number format
            values.minPlannedHours = Number(values.minPlannedHours)
            values.maxPlannedHours = Number(values.maxPlannedHours)
            values.free = Number(values.free)
            values.relativelyFree = Number(values.relativelyFree)
            values.busy = Number(values.busy)
            values.someWhatBusy = Number(values.someWhatBusy)
            values.superBusy = Number(values.superBusy)
            return dispatch(updateEmployeeSettingOnServer(values)).then(response => {
                if (response.success) {
                    NotificationManager.success('Employee Setting Updated Successfully')
                } else {
                    NotificationManager.error('Employee Setting Updated Failed')
                }
            })
        }
    }

})

const mapStateToProps = (state, ownProps) => ({})

const EmployeeSettingFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeSettingForm)

export default EmployeeSettingFormContainer