import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import * as logger from "../../clientLogger";
import {connect} from "react-redux";
import ProjectList from "../../components/lists/ProjectList";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showProjectCreationForm: () => {
        console.log("show Project init form caled")
        dispatch(A.getAllProjectsFromServer())
        dispatch(A.showComponent(COC.PROJECT_FORM_DIALOG))
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