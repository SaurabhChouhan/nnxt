import {connect} from 'react-redux'
import {LeaveSettingForm} from "../../components"
import {addLeaveSettingOnServer, updateLeaveSettingOnServer} from "../../actions"
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id) {
            // converted data into number format
            values.casualLeaves = Number(values.casualLeaves)
            values.paidLeaves = Number(values.paidLeaves)
            values.maternityLeaves = Number(values.maternityLeaves)
            values.paternityLeaves = Number(values.paternityLeaves)
            values.specialLeaves = Number(values.specialLeaves)

            // Leave Setting is created
            return dispatch(addLeaveSettingOnServer(values)).then(response => {
                if (response.success) {
                    NotificationManager.success('Leave Setting Added Successfully')
                } else {
                    NotificationManager.error('Leave Setting Added Failed')
                }
            })
        } else {

            // converted data into number format
            values.casualLeaves = Number(values.casualLeaves)
            values.paidLeaves = Number(values.paidLeaves)
            values.maternityLeaves = Number(values.maternityLeaves)
            values.paternityLeaves = Number(values.paternityLeaves)
            values.specialLeaves = Number(values.specialLeaves)

            // Leave Setting is edited
            return dispatch(updateLeaveSettingOnServer(values)).then(response => {
                if (response.success) {
                    NotificationManager.success('Leave Setting Updated Successfully')
                } else {
                    NotificationManager.error('Leave Setting Updated Failed')
                }
            })
        }
    }
})

const mapStateToProps = (state, ownProps) => ({})

const LeaveSettingFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LeaveSettingForm)

export default LeaveSettingFormContainer