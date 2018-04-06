import {connect} from 'react-redux'
import {PermissionList} from "../../components"
import {initialize} from 'redux-form'
import * as logger from '../../clientLogger'
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => {
    logger.debug(logger.PERMISSION_LIST_CONNECT, "mapDispatchToProps()")
    return {
        getAllPermissions: () => dispatch(A.getAllPermissionsFromServer()),
        showPermissionForm: () => dispatch(A.showComponentHideOthers(COC.PERMISSION_FORM)),
        editPermission: (permission, rowIdx) => {
            dispatch(initialize("permission", permission))
            dispatch(A.showComponentHideOthers(COC.PERMISSION_FORM))
        },
        deleteUser: (userId) => dispatch(A.deletePermissionOnServer(userId))
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