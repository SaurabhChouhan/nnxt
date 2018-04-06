import {connect} from 'react-redux'
import {RoleList} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";
import {initialize} from 'redux-form'
import {deleteRole} from "../../actions/roleAction";
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showRoleForm: () => dispatch(A.showComponentHideOthers(COC.ROLE_FORM)),
    editRole: (role) => {
        dispatch(initialize("role", role))
        dispatch(A.showComponentHideOthers(COC.ROLE_FORM))
    },
    deleteRole:(roleID) => {
        dispatch(A.deleteRoleOnServer(roleID)).then(json => {
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