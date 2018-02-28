import {connect} from 'react-redux'
import {ReleaseDeveloperFilterForm} from "../../components"
import * as A from "../../actions"
import * as COC from "../../components/componentConsts";

const mapDispatchToProps = (dispatch, ownProps) => ({
    getDeveloperDetails :(developerId,StartDate,EndDate)=>console.log("developer value",developerId,StartDate,EndDate)
})

const mapStateToProps = (state, ownProps) => ({
    team: state.release.selected && state.release.selected.team ? state.release.selected.team : []
})


const ReleaseDeveloperFilterFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDeveloperFilterForm)

export default ReleaseDeveloperFilterFormContainer