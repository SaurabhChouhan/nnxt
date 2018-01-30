import * as A from "../../actions";
import * as COC from "../../components/componentConsts";
import * as logger from "../../clientLogger";
import {connect} from "react-redux";
import TechnologyList from "../../components/lists/TechnologyList";

const mapDispatchToProps = (dispatch, ownProps) => ({
    showTechnologyAdditionForm: () => {
        console.log("show technology init form caled")
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