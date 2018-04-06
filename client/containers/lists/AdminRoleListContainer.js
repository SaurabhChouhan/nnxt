import {connect} from 'react-redux'
import {AdminRoleList} from "../../components"
import * as COC from "../../components/componentConsts";
import * as A from "../../actions";

const mapDispatchToProps = (dispatch, ownProps) => ({
    editPermissionsOfRole: (role) => {
        dispatch(A.showComponentHideOthers(COC.ADMIN_ROLE_FORM))
        dispatch(A.adminEditingRole(role))
    },
})

const mapStateToProps = (state, ownProps) => {
    return {
        roles: state.role.all
    }
}

const AdminRoleListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AdminRoleList)

export default AdminRoleListContainer

