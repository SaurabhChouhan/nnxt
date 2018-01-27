import React from 'react'
import {connect} from 'react-redux'

const ContentSection = (props) => (
    <section className="content-section">
        {
            React.Children.map(props.children, (child, i) => {
                if (props.visibleComponents.findIndex(name => name === child.props.name) != -1)
                    return child
                else
                    return null

            })
        }
    </section>
)

export default connect((state) => ({
    visibleComponents: state.app.visibleComponents
}))(ContentSection)