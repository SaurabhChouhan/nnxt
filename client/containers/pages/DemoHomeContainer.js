import {connect} from 'react-redux'
import {loginUserOnServer} from "../../actions"
import DemoHome from '../../components/pages/DemoHome'

const mapDispatchToProps = (dispatch, ownProps) => ({
    autoLogin: () => dispatch(loginUserOnServer({
        username: 'schouhan@aripratech.com',
        password: 'password'
    }))
})


const DemoHomeContainer = connect(
    null,
    mapDispatchToProps
)(DemoHome)

export default DemoHomeContainer