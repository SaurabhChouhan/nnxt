import {connect} from 'react-redux'
import {RoleList} from "../../components"
import {getAllPermissionsFromServer, deleteRoleOnServer} from "../../actions"
import {showComponentHideOthers} from "../../actions/appAction";
import {ROLE_FORM} from "../../components/componentConsts";
import {initialize} from 'redux-form'
import {deleteRole} from "../../actions/roleAction";
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showRoleForm: () => dispatch(showComponentHideOthers(ROLE_FORM)),
    editRole: (role) => {
        dispatch(initialize("role", role))
        dispatch(showComponentHideOthers(ROLE_FORM))
    },
    deleteRole:(roleID) => {
        dispatch(deleteRoleOnServer(roleID)).then(json => {
            if (json.success) {
                dispatch(deleteRole(json.data))
                NotificationManager.success('Role Deleted Successfully')
            } else {
                NotificationManager.error('Role Not Deleted!')
            }
            return json
        })
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        roles: state.role.all,
        permissions:state.permission.all
    }
}

const RoleListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RoleList)

export default RoleListContainer