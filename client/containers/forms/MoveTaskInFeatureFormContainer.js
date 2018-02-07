import {connect} from 'react-redux'
import {MoveTaskInFeatureForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from "../../../server/errorcodes";
import {SubmissionError} from "redux-form";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        console.log("You are in move tsk to feature Form container ", values)

        /*return dispatch(A.addProjectOnServer(values)).then(json => {
            if (json.success) {
                NotificationManager.success('Project Added Successfully')
                dispatch(A.hideComponent(COC.PROJECT_FORM_DIALOG))

            } else {
                NotificationManager.error('Project Not Added!')
                if (json.code == EC.ALREADY_EXISTS)
                    throw new SubmissionError({name: "Project Already Exists"})
            }
            return json
        })*/
    }
})

const mapStateToProps = (state, ownProps) => ({
    features: state.estimation.features,


})

const MoveTaskInFeatureFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(MoveTaskInFeatureForm)

export default MoveTaskInFeatureFormContainer