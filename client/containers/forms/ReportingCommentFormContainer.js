import {connect} from 'react-redux'
import {ReportingCommentForm} from "../../components"
import * as A from '../../actions'
import {NotificationManager} from 'react-notifications'
import {initialize} from 'redux-form'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (commentValues) => {
        //console.log("commentValues", commentValues)
        return dispatch(A.addCommentToServer(commentValues)).then((json) => {
            if (json.success) {
                //console.log("json.data", json.data)
                dispatch(initialize("reporting-comment", {
                    releaseID: json.data.release._id,
                    releasePlanID: json.data._id
                }))
                NotificationManager.success('Comment Added')
            } else {
                NotificationManager.error('Comment Add Failed')
            }
            return json
        })
    }
})

const mapStateToProps = (state, ownProps) => ({
    initialValues: {
        "releaseID": state.report.selectedProject._id,
        "releasePlanID": state.report.selectedReleasePlan._id
    }
})

const ReportingCommentFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingCommentForm)

export default ReportingCommentFormContainer