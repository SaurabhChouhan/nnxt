import {connect} from 'react-redux'
import {BillingSection} from "../../components"
import {withRouter} from 'react-router-dom'
import {BILLING_TASK_TAB} from '../../clientconstants'

const mapDispatchToProps = (dispatch, ownProps) => ({
        
    }
)
const mapStateToProps = (state) => ({
    selectedTab:BILLING_TASK_TAB
})

const BillingSectionContainer = withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(BillingSection))

export default BillingSectionContainer