import {connect} from 'react-redux'
import {ReportingCommentForm} from "../../components"
import * as A from '../../actions'
import {NotificationManager} from 'react-notifications'
import {initialize} from 'redux-form'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (commentValues) => {
        return dispatch(A.addCommentToServer(commentValues)).then((json) => {
            if (json.success) {
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
        "releaseID": state.report.reportTaskDetail.release._id,
        "releasePlanID": state.report.reportTaskDetail.releasePlan._id
    }
})

const ReportingCommentFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingCommentForm)

export default ReportingCommentFormContainer