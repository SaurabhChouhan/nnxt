import {connect} from 'react-redux'
import {MoveTaskInFeatureForm} from "../../components"
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'
import * as EC from "../../../server/errorcodes";
import {SubmissionError} from "redux-form";

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formValues) => {
        return dispatch(A.moveTaskIntoFeatureOnServer(formValues._id,formValues.feature_id)).then(json => {
            if (json.success) {
                NotificationManager.success('Task Moved Successfully')
                dispatch(A.hideComponent(COC.MOVE_TASK_TO_FEATURE_FORM_DIALOG))
            } else {
                if(json.code==EC.MOVE_TASK_IN_FEATURE_ERROR){
                    NotificationManager.error('Task cant be moved as feature selected is approved')
                }else{
                    NotificationManager.error('Process Failed')
                }

            }
            return json
        })
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