import {connect} from 'react-redux'
import {ProjectForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from "../../../server/errorcodes";
import {SubmissionError} from "redux-form";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id) {
            return dispatch(A.addProjectOnServer(values)).then(json => {
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
        } else {
            return dispatch(A.editProjectOnServer(values)).then(response => {
                if (response.success) {
                    dispatch(A.hideComponent(COC.PROJECT_FORM_DIALOG)),
                        NotificationManager.success('Project Updated Successfully')
                } else {
                    NotificationManager.error('Project Updated Failed');
                    if (response.code == EC.ALREADY_EXISTS)
                        throw new SubmissionError({name: "Project Already Exists"})
                }
                return json
            })
        }


    }
})

const mapStateToProps = (state, ownProps) => ({
    clients: state.client.all && Array.isArray(state.client.all) && state.client.all.length ? state.client.all.filter(client =>
        client.isActive === true
    ) : [],
    projects: state.project.all,

})

const ProjectInitiateFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectForm)

export default ProjectInitiateFormContainer