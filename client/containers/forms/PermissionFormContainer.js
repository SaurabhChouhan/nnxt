import {connect} from 'react-redux'
import PermissionForm from "../../components/forms/PermissionForm"
import {PERMISSION_LIST} from "../../components/componentConsts";
import {NotificationManager} from 'react-notifications'
import {SubmissionError} from 'redux-form'
import {ALREADY_EXISTS} from "../../../server/errorcodes";
import {
    addPermissionOnServer,
    editPermissionOnServer,
    showComponentHideOthers
} from "../../actions"
import {editPermission} from "../../actions/permissionAction";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id)
            return dispatch(addPermissionOnServer(values)).then(json => {
                    if (json.success) {
                        dispatch(showComponentHideOthers(PERMISSION_LIST))
                        NotificationManager.success('Permission Added!')
                    } else {
                        NotificationManager.error('Permission Not Added!')
                        if (json.code == ALREADY_EXISTS)
                            throw new SubmissionError({name: "Permission Already Exists"})
                    }
                    return json
                }
            )

        else
            return dispatch(editPermissionOnServer(values)).then(json => {
                    if (json.success) {
                        dispatch(showComponentHideOthers(PERMISSION_LIST))
                        NotificationManager.success('Permission Edited Successfully')
                    } else {
                        NotificationManager.error('Permission Edit Failed!')
                        if (json.code == ALREADY_EXISTS)
                            throw new SubmissionError({name: "Permission Already Exists"})
                    }
                    return json
                }
            )
    },
    showPermissionList: () => dispatch(showComponentHideOthers(PERMISSION_LIST))
})

const mapStateToProps = (state, ownProps) => ({})

const PermissionFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PermissionForm)

export default PermissionFormContainer