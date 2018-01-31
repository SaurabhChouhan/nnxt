import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {TechnologyFormContainer} from "../../containers"

const technologyFormDialog = (props) => {
    return <Modal show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <h3>Add Technology</h3>
        </ModalHeader>
        <ModalBody>
            <TechnologyFormContainer/>
        </ModalBody>
    </Modal>
}

export default technologyFormDialog