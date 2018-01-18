import {connect} from 'react-redux'
import PermissionForm from "../../components/forms/PermissionForm"
import {addPermissionOnServer, editPermissionOnServer} from "../../actions"
import {showComponentHideOthers} from "../../actions/appAction";
import {PERMISSION_LIST} from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id)
            return dispatch(addPermissionOnServer(values))
        else
            return dispatch(editPermissionOnServer(values))
    },
    showPermissionList: () => dispatch(showComponentHideOthers(PERMISSION_LIST))
})

const mapStateToProps = (state, ownProps) => ({})

const PermissionFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(PermissionForm)

export default PermissionFormContainer