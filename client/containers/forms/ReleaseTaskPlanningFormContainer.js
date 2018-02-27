import {connect} from 'react-redux'
import {ReleaseTaskPlanningForm} from "../../components"
import * as logger from '../../clientLogger'
import {addClientOnServer, editClientOnServer} from "../../actions"
import {SubmissionError} from "redux-form";
import * as EC from "../../../server/errorcodes";
import {NotificationManager} from "react-notifications";
import * as COC from "../../components/componentConsts";
import * as A from "../../actions";

const mapDispatchToProps = (dispatch, ownProps) => ({})

const mapStateToProps = (state, ownProps) => {
    console.log("state.release.selected.team",state.release.selected.team)
 return{  team: state.release.selected && state.release.selected.team ? state.release.selected.team : []}

}

const ReleaseTaskPlanningFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskPlanningForm)

export default ReleaseTaskPlanningFormContainer