import {connect} from 'react-redux'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {EstimationList} from "../../components"
import * as logger from '../../clientLogger'

const mapDispatchToProps = (dispatch, ownProps) => ({
    showEstimationInitiateForm: () => {
        dispatch(A.getAllProjectsFromServer())
        dispatch(A.getAllModulesFromServer())
        dispatch(A.getAllUsersFromServer())
        dispatch(A.getAllTechnologiesFromServer())
        dispatch(A.getAllDevelopmentTypesFromServer())
        dispatch(A.showComponent(COC.ESTIMATION_INITIATE_DIALOG))
    },
    estimationSelected: (estimation) => {
        logger.debug(logger.ESTIMATION_LIST_CONNECT, "estimation:", estimation)
        return dispatch(A.getEstimationFromServer(estimation._id)).then(json => {
            dispatch(A.showComponentHideOthers(COC.ESTIMATION_DETAIL_PAGE))
        })
    },
    getAllEstimations: (projectID, status) => {
        dispatch(A.getAllEstimationsFromServer(projectID, status))
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