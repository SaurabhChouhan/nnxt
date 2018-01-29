import {connect} from 'react-redux'
import {ProjectForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import {addProject, addProjectOnServer} from "../../actions"
import {hideComponent} from "../../actions";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        console.log("You are in project initiate Form container ", values)
        dispatch(addProject(values))
        dispatch(hideComponent(COC.PROJECT_FORM_DIALOG))
    }
})

const mapStateToProps = (state, ownProps) => ({
    clients: state.user.all,
    projects: state.project.all,

})

const ProjectInitiateFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectForm)

export default ProjectInitiateFormContainer