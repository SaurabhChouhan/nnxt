import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'

const EstimationInitiateDialog = (props) => {
    return <Modal show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <h3 className="">Initiate Estimation</h3>
        </ModalHeader>
        <ModalBody>
            <p>This is modal body</p>
        </ModalBody>
    </Modal>
}

export default EstimationInitiateDialog