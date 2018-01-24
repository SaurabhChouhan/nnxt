import React from 'react'

const ContentSection = (props) => (
    <section>
        {
            React.Children.map(props.children, (child, i) => {
                // Only return that element that is part of visible component
                return child
                /*
                if (props.visibleComponents.findIndex(name => name === child.props.name) != -1)
                    return child
                else
                    return null
                    */
            })
        }
    </section>
)

export default ContentSection