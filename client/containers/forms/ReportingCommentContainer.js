import {connect} from 'react-redux'
import {ReportingCommentForm} from "../../components"
import * as A from '../../actions/index'



const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (commentValues) => {console.log("Comment Section",commentValues)}
})

const mapStateToProps = (state, ownProps) => ({
})

const ReportingCommentFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReportingCommentForm)

export default ReportingCommentFormContainer