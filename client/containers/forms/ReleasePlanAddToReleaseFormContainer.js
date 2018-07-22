import {connect} from 'react-redux'
import {ReleasePlanAddToReleaseForm} from "../../components"
import * as logger from '../../clientLogger'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({
    onSubmit: (values) => {
        console.log("hello world !")
    }
})

const mapStateToProps = (state, ownProps) => ({
    release: state.release.selectedRelease,
    releasePlans: state.release.releasePlans
})

const ReleasePlanAddToReleaseFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleasePlanAddToReleaseForm)

export default ReleasePlanAddToReleaseFormContainer