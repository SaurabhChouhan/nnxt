import {connect} from 'react-redux'
import {PermissionList} from "../../components"
import {
    getAllPermissionsFromServer,
    deletePermissionOnServer
} from "../../actions"
import {showComponentHideOthers} from "../../actions/appAction";
import {PERMISSION_FORM} from "../../components/componentConsts";
import {initialize} from 'redux-form'
import * as logger from '../../clientLogger'

const mapDispatchToProps = (dispatch, ownProps) => {
    logger.debug(logger.PERMISSION_LIST_CONNECT, "mapDispatchToProps()")
    return {
    getAllPermissions: () => dispatch(getAllPermissionsFromServer()),
    showPermissionForm: () => dispatch(showComponentHideOthers(PERMISSION_FORM)),
    editPermission: (permission, rowIdx) => {
        dispatch(initialize("permission", permission))
        dispatch(showComponentHideOthers(PERMISSION_FORM))
    },
    deleteUser: (userId) => dispatch(deletePermissionOnServer(userId))
}}

const mapStateToProps = (state, ownProps) => {
    let childProps = {
        loggedInUser: state.user.loggedIn,
        permissions: state.permission.all
    }
    logger.debug(logger.PERMISSION_LIST_CONNECT, "mapStateToProps(): ", childProps)
    return childProps
}

const PermissionListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PermissionList)

export default PermissionListContainer