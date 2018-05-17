import {connect} from 'react-redux'
import {EmployeeSettingForm} from "../../components"
import {addEmployeeSettingOnServer, updateEmployeeSettingOnServer} from "../../actions"
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        // Employee setting is updated/edited
        console.log("Employee Setting")
        /*  return dispatch(updateEmployeeSettingOnServer(values)).then(response => {
              if (response.success) {
                  NotificationManager.success('Employee Setting Updated Successfully')
              } else {
                  NotificationManager.error('Employee Setting Updated Failed');
              }
          })*/
    }

})

const mapStateToProps = (state, ownProps) => ({})

const EmployeeSettingFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EmployeeSettingForm)

export default EmployeeSettingFormContainer