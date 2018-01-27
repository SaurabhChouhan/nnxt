import {connect} from 'react-redux'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {EstimationList} from "../../components"
import * as logger from '../../clientLogger'

const mapDispatchToProps = (dispatch, ownProps) => ({
    showEstimationInitiateForm: () => {
        console.log("show estimation init form caled")
        dispatch(A.getAllProjectsFromServer())
        dispatch(A.getAllUsersFromServer())
        dispatch(A.showComponent(COC.ESTIMATION_INITIATE_DIALOG))
    },
    estimationSelected: (estimation) => {
        logger.debug(logger.ESTIMATION_LIST_CONNECT, "estimation:", estimation)
        dispatch(A.showComponentHideOthers(COC.ESTIMATION_DETAIL_PAGE))
        dispatch(A.selectEstimation(estimation))
    }
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