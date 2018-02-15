import {connect} from 'react-redux'
import {RepositorySearch} from '../../components'

const mapDispatchToProps = (dispatch, ownProps) => ({})


const mapStateToProps = (state) => ({})

const RepositorySearchContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RepositorySearch)

export default RepositorySearchContainer
