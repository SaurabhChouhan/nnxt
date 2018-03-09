import {connect} from 'react-redux'
import {ReleaseProjectSearchForm} from "../../components"
import * as A from '../../actions'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formValues) => {
        console.log("get the form values", formValues)
    },
    changeReleaseStatus: (status) => {
        if (status)
            console.log("ReleaseStatus", status)
        return dispatch(A.getAllReleaseFromServer(status))
    }
})

const mapStateToProps = (state, ownProps) => ({
    releaseProject: state.release.all,
})

const ReleaseProjectSearchFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseProjectSearchForm)

export default ReleaseProjectSearchFormContainer