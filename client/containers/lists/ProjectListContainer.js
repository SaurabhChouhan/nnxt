import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import {connect} from "react-redux";
import ProjectList from "../../components/lists/ProjectList";
import {initialize, SubmissionError} from "redux-form";
import {NotificationManager} from "react-notifications";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showProjectEditForm: (project) => {
        dispatch(A.showComponent(COC.PROJECT_FORM_DIALOG)),
            dispatch(initialize('project', project))
    },
    showProjectCreationForm: () => {
        dispatch(A.showComponent(COC.PROJECT_FORM_DIALOG))
    },
    deleteProject: (projectID) => dispatch(A.deleteProjectOnServer(projectID)).then(json => {
        if (json.success) {
            NotificationManager.success('Project Removed Successfully')
        } else {
            NotificationManager.error(json.message)
            throw new SubmissionError({projects: "Project Removal Failed"})
        }
    }),
    showIsActive: (projectID,value) => {
console.log("projectID",projectID)
        dispatch(A.showIsActive(projectID,value))
    },
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