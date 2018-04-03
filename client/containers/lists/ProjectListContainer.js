import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import * as logger from "../../clientLogger";
import {connect} from "react-redux";
import ProjectList from "../../components/lists/ProjectList";
import {deleteProjectOnServer} from "../../actions";
import {initialize, SubmissionError} from "redux-form";
import {NotificationManager} from "react-notifications";
import {showComponentHideOthers, showComponent} from "../../actions";
import {PROJECT_FORM_DIALOG} from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showPorjectEditForm: (project) => {
        //dispatch(A.getAllClientsFromServer()),
        dispatch(showComponent(PROJECT_FORM_DIALOG)),
        dispatch(initialize('project', project))},
    showProjectCreationForm: () => {
        //dispatch(A.getAllClientsFromServer()),
        dispatch(A.showComponent(COC.PROJECT_FORM_DIALOG))
    },
    deleteProject:(projectID) => dispatch(deleteProjectOnServer(projectID)).then(json => {
        if (json.success) {
            NotificationManager.success('Project Removed Successfully')
        } else {
            NotificationManager.error('Project Not removed!')
            throw new SubmissionError({projects: "Project Removal Failed"})
        }
    }),

})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        projects: state.project.all
    }
}

const ProjectListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectList)

export default ProjectListContainer