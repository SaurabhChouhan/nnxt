import {connect} from 'react-redux'
import {ModuleForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from "../../../server/errorcodes";
import {SubmissionError} from "redux-form";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        if (!values._id) {
            return dispatch(A.addModuleOnServer(values)).then(json => {
                if (json.success) {
                    NotificationManager.success('Module Added Successfully')
                    dispatch(A.hideComponent(COC.MODULE_FORM_DIALOG))

                } else {
                    NotificationManager.error('Module Not Added!')
                    if (json.code == EC.ALREADY_EXISTS)
                        throw new SubmissionError({name: "Module Already Exists"})
                }
                return json
            })
        } else {
            return dispatch(A.editModuleOnServer(values)).then(response => {
                if (response.success) {
                    dispatch(A.hideComponent(COC.MODULE_FORM_DIALOG)),
                        NotificationManager.success('Module Updated Successfully')
                } else {
                    NotificationManager.error('Module Updated Failed');
                    if (response.code == EC.ALREADY_EXISTS)
                        throw new SubmissionError({name: "Module Already Exists"})
                }
                return json
            })
        }


    }
})

const mapStateToProps = (state, ownProps) => ({
    clients: state.client.all,
    projects: state.project.all,

})

const ModuleFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ModuleForm)

export default ModuleFormContainer