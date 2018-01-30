import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import * as logger from "../../clientLogger";
import {connect} from "react-redux";
import {TechnologyList} from "../../components";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showTechnologyAdditionForm: () => {
        logger.debug(logger.TECHNOLOGY_FORM_CONNECT, "onSubmit:values:")
        dispatch(A.showComponent(COC.TECHNOLOGY_FORM_DIALOG))
    },

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