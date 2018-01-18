import React, {Component} from 'react'


const TabSection = (props) => (
    <section className="clearfix tab-parent">
        {
            React.Children.map(props.children, (child, i) => {
                // Only return that element that is part of visible component
                if (props.visibleComponents.findIndex(name => name === child.props.name) != -1)
                    return child
                else
                    return null
            })
        }
    </section>
)

export default TabSection