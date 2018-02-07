import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import * as logger from "../../clientLogger";
import {connect} from "react-redux";
import {TechnologyList} from "../../components";
import {NotificationManager} from "react-notifications";
import {SubmissionError} from "redux-form";
import {deleteTechnologyOnServer} from "../../actions";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showTechnologyAdditionForm: () => {
        logger.debug(logger.TECHNOLOGY_FORM_CONNECT, "onSubmit:values:")
        dispatch(A.showComponent(COC.TECHNOLOGY_FORM_DIALOG))
    },
    deleteTechnology:(TechnologyID) => dispatch(deleteTechnologyOnServer(TechnologyID)).then(json => {
        if (json.success) {
            NotificationManager.success('Technology Removed Successfully')
        } else {
            NotificationManager.error('Technology Not removed!')
            throw new SubmissionError({Technologies: "Technology Removal Failed"})
        }
    }),

})

const mapStateToProps = (state, ownProps) => {
    return {
        loggedInUser: state.user.loggedIn,
        technologies: state.technology.all
    }
}

const TechnologyListContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(TechnologyList)

export default TechnologyListContainer