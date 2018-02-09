import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {ClientFormContainer} from "../../containers"

const ClientFormDialog = (props) => {
    return <Modal show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <h3>Add Client</h3>
        </ModalHeader>
        <ModalBody>
            <ClientFormContainer/>
        </ModalBody>
    </Modal>
}

export default ClientFormDialog