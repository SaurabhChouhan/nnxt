import {connect} from 'react-redux'
import PermissionForm from "../../components/forms/PermissionForm"
import * as COC from "../../components/componentConsts";
import {NotificationManager} from 'react-notifications'
import {SubmissionError} from 'redux-form'
import * as EC from "../../../server/errorcodes";
import * as A from "../../actions"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id)
            return dispatch(A.addPermissionOnServer(values)).then(json => {
                    if (json.success) {
                        dispatch(A.showComponentHideOthers(COC.PERMISSION_LIST))
                        NotificationManager.success('Permission Added!')
                    } else {
                        NotificationManager.error('Permission Not Added!')
                        if (json.code == EC.ALREADY_EXISTS)
                            throw new SubmissionError({name: "Permission Already Exists"})
                    }
                    return json
                }
            )

        else
            return dispatch(A.editPermissionOnServer(values)).then(json => {
                    if (json.success) {
                        dispatch(A.showComponentHideOthers(COC.PERMISSION_LIST))
                        NotificationManager.success('Permission Edited Successfully')
                    } else {
                        NotificationManager.error('Permission Edit Failed!')
                        if (json.code == EC.ALREADY_EXISTS)
                            throw new SubmissionError({name: "Permission Already Exists"})
                    }
                    return json
                }
            )
    },
    showPermissionList: () => dispatch(A.showComponentHideOthers(COC.PERMISSION_LIST))
})

const mapStateToProps = (state, ownProps) => ({})

const PermissionFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PermissionForm)

export default PermissionFormContainer