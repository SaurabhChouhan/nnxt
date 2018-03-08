import {connect} from 'react-redux'
import {EstimationSearchForm} from "../../components"

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (formValues) => {
        console.log("get the form values", formValues)
    }
})

const mapStateToProps = (state, ownProps) => ({})

const EstimationSearchFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationSearchForm)

export default EstimationSearchFormContainer