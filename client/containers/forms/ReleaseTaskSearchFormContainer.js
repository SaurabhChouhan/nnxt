import {connect} from 'react-redux'
import {ReleaseTaskSearchForm} from "../../components"
import * as A from '../../actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formValues) => {
        console.log("get the form values", formValues)
    },
    changeReleaseFlag: (release, status, flag) => dispatch(A.getTaskReleaseFromServer(release, status, flag)),

    changeReleaseStatus: (release, status, flag) => dispatch(A.getTaskReleaseFromServer(release, status, flag))

})

const mapStateToProps = (state, ownProps) => ({
    release: state.release.selected,
})

const ReleaseTaskSearchFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskSearchForm)

export default ReleaseTaskSearchFormContainer