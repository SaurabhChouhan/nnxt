import {connect} from 'react-redux'
import {RepositoryFeatureDetailPage} from '../../components'
import * as EC from '../../../server/errorcodes'
import * as COC from '../../components/componentConsts'
import * as A from '../../actions'


const mapDispatchToProps = (dispatch, ownProps) => ({ })


const mapStateToProps = (state) => ({
    feature: state.repository.feature
})

const RepositoryFeatureDetailPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)( RepositoryFeatureDetailPage)

export default RepositoryFeatureDetailPageContainer
