import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import {connect} from "react-redux";
import ModuleList from "../../components/lists/ModuleList";
import {initialize, SubmissionError} from "redux-form";
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showModuleEditForm: (module) => {
        dispatch(A.showComponent(COC.MODULE_FORM_DIALOG)),
            dispatch(initialize('module', module))
    },
    showModuleCreationForm: () => {
        dispatch(A.showComponent(COC.MODULE_FORM_DIALOG))
    },
    deleteModule: (moduleID) => dispatch(A.deleteModuleOnServer(moduleID)).then(json => {
        if (json.success) {
            NotificationManager.success('Module Removed Successfully')
        } else {
            NotificationManager.error('Module Not removed!')
            throw new SubmissionError({modules: "Module Removal Failed"})
        }
    }),

})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        modules: state.module.all
    }
}

const ProjectListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ModuleList)

export default ProjectListContainer