import {connect} from 'react-redux'
import {ReleaseDevelopersSchedules} from '../../components'
import * as COC from '../../components/componentConsts'
import * as A from '../../actions'

const mapDispatchToProps = (dispatch, ownProps) => ({})


const mapStateToProps = (state) => ({})

const ReleaseDevelopersSchedulesContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReleaseDevelopersSchedules)

export default ReleaseDevelopersSchedulesContainer
