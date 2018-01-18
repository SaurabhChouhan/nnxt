import {connect} from 'react-redux'
import {AdminRoleList} from "../../components"
import {showComponentHideOthers} from "../../actions"
import {ADMIN_ROLE_FORM} from "../../components/componentConsts";
import {initialize, SubmissionError} from 'redux-form'
import {adminEditingRole} from "../../actions/roleAction";

const mapDispatchToProps = (dispatch, ownProps) => ({
    editPermissionsOfRole: (role) => {
        dispatch(showComponentHideOthers(ADMIN_ROLE_FORM))
        dispatch(adminEditingRole(role))
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

