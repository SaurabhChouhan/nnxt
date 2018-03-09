import {connect} from 'react-redux'
import {EstimationSearchForm} from "../../components"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formValues) => {
        console.log("get the form values", formValues)
    },
    filterEstimationByProject: (projectId) => {
        console.log("filter by project ", projectId)
    }
})

const mapStateToProps = (state, ownProps) => ({
    projects: state.project.all
})

const EstimationSearchFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationSearchForm)

export default EstimationSearchFormContainer