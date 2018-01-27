import {Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter, Button} from 'react-bootstrap'
import React from 'react'

const ConfirmationDialog = (props) => {
    return <Modal show={props.show} onHide={props.onClose}>
        <ModalHeader>
            <ModalTitle>{props.title ? props.title : 'Confirm Operation'}</ModalTitle>
        </ModalHeader>

        <ModalBody>{props.body ? props.body : 'Please confirm or cancel operation'}</ModalBody>

        <ModalFooter>
            <Button onClick={props.onClose}>Cancel</Button>
            <Button onClick={props.onConfirm}>Confirm</Button>
        </ModalFooter>
    </Modal>
}

export default ConfirmationDialog