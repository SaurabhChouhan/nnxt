import {connect} from 'react-redux'
import {TaskPlanDateNavBar} from "../../components/index"
import * as A from '../../actions/index'
import moment from 'moment'

const mapDispatchToProps = (dispatch, ownProps) => ({

    onSubmit: (values) => {
        console.log("get the values of on submit TaskPlanDateNavBarContainer", values),
            dispatch(A.getSearchTaskPlanResultFromServer(values))
    },

    setStartDate:(startDate)=>{
        console.log("get the values of on submit TaskPlanDateNavBarContainer", startDate),
            dispatch(A.setStartDateForTaskPlan(startDate))
    },
    setEndDate:(endDate)=>{
        console.log("get the values of on submit TaskPlanDateNavBarContainer", endDate),
            dispatch(A.setEndDateForTaskPlan(endDate))
    }
})

const mapStateToProps = (state, ownProps) => ({

    initialValues: {
        "releaseID": state.release.selectedRelease._id,
    },
    startDate:state.release.startDate,
    endDate:state.release.endDate
})

const TaskPlanDateNavBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TaskPlanDateNavBar)

export default TaskPlanDateNavBarContainer