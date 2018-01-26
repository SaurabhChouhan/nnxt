import {connect} from 'react-redux'
import {EstimationList} from "../../components"

const mapDispatchToProps = (dispatch, ownProps) => ({

})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        estimations: state.estimation.all
    }
}

const EstimationListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationList)

export default EstimationListContainer