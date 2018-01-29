import {connect} from 'react-redux'
import {ProjectForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from "../../../server/errorcodes";
import {SubmissionError} from "redux-form";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        console.log("You are in project initiate Form container ", values)
        dispatch(A.addProjectOnServer(values)).then(json=>{
            if (json.success) {
                NotificationManager.success('Project Added Successfully')
                dispatch(A.hideComponent(COC.PROJECT_FORM_DIALOG))

            } else {
                NotificationManager.error('Project Not Added!')
                if (json.code == EC.ALREADY_EXISTS)
                    throw new SubmissionError({name: "Project Already Exists"})
            }
            return json
        })

    }
})

const mapStateToProps = (state, ownProps) => ({
    clients: state.client.all,
    projects: state.project.all,

})

const ProjectInitiateFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectForm)

export default ProjectInitiateFormContainer