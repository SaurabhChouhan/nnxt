import {connect} from 'react-redux'
import {AdminRoleForm} from "../../components"
import {editRoleOnServer, showComponentHideOthers} from "../../actions"
import {ADMIN_ROLE_LIST} from "../../components/componentConsts";
import {NotificationManager} from 'react-notifications'
import {SubmissionError} from 'redux-form'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (role) => {
        return dispatch(editRoleOnServer(role)).then((json) => {
            if (json.success) {
                dispatch(showComponentHideOthers(ADMIN_ROLE_LIST))
                NotificationManager.success('Role And Permission Updated');
            } else {
                NotificationManager.error('Role And Permission Update Failed');
            }
        })
    },
    showRoleList: () => dispatch(showComponentHideOthers(ADMIN_ROLE_LIST))


})

const mapStateToProps = (state, ownProps) => ({
    initialValues: state.role.selected,
    permissionOptions: state.role.permissionOptions
})

const AdminRoleFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminRoleForm)

export default AdminRoleFormContainer