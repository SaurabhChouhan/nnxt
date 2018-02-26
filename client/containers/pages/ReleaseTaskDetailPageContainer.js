import {connect} from 'react-redux'
import {ReleaseTaskDetailPage} from '../../components'
import * as A from '../../actions'
import * as COC from '../../components/componentConsts'
import {NotificationManager} from 'react-notifications'

const mapDispatchToProps = (dispatch, ownProps) => ({})


const mapStateToProps = (state) => ({})

const ReleaseTaskDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseTaskDetailPage)

export default ReleaseTaskDetailPageContainer
