import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {EstimationTaskFormContainer} from "../../containers"

const EstimationTaskDialog = (props) => {
    return <Modal show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <h3>Add Task to Estimation</h3>
        </ModalHeader>
        <ModalBody>
            <EstimationTaskFormContainer/>
        </ModalBody>
    </Modal>
}

export default EstimationTaskDialog