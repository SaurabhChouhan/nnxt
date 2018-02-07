import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {MoveTaskInFeatureFormContainer} from "../../containers"

const MoveTaskInFeatureFormDialog = (props) => {
    return <Modal show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <h3>Move task in feature</h3>
        </ModalHeader>
        <ModalBody>
            <MoveTaskInFeatureFormContainer/>
        </ModalBody>
    </Modal>
}

export default MoveTaskInFeatureFormDialog