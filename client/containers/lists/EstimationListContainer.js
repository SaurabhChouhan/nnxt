import {connect} from 'react-redux'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {EstimationList} from "../../components"
import * as logger from '../../clientLogger'

const mapDispatchToProps = (dispatch, ownProps) => ({
    showEstimationInitiateForm: () => {
        dispatch(A.getAllProjectsFromServer())
        dispatch(A.getAllUsersFromServer())
        dispatch(A.getAllTechnologiesFromServer())
        dispatch(A.showComponent(COC.ESTIMATION_INITIATE_DIALOG))
    },
    estimationSelected: (estimation) => {
        logger.debug(logger.ESTIMATION_LIST_CONNECT, "estimation:", estimation)
        dispatch(A.getEstimationFromServer(estimation._id)).then(json => {
            dispatch(A.showComponentHideOthers(COC.ESTIMATION_DETAIL_PAGE))
        }),
            dispatch(A.getRepositoryFromServer(estimation.technologies, 'all'))
    },
    filterEstimationStatus: (status) => {
        console.log("filterEstimationStatus", status)
    }
})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        estimations: state.estimation.all,
        projects: state.project.all
    }
}

const EstimationListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(EstimationList)

export default EstimationListContainer