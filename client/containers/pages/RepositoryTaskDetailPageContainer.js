import {connect} from 'react-redux'
import {RepositoryTaskDetailPage} from '../../components'
import * as EC from '../../../server/errorcodes'
import * as COC from '../../components/componentConsts'
import * as A from '../../actions'


const mapDispatchToProps = (dispatch, ownProps) => ({ })


const mapStateToProps = (state) => ({
    task: state.repository.task
})

const RepositoryTaskDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)( RepositoryTaskDetailPage)

export default RepositoryTaskDetailPageContainer
