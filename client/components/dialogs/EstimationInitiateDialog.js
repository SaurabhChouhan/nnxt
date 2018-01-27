import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {EstimationInitiateFormContainer} from "../../containers"

const EstimationInitiateDialog = (props) => {
    return <Modal show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <h3>Initiate Estimation</h3>
        </ModalHeader>
        <ModalBody>
            <p>
                <EstimationInitiateFormContainer/>
            </p>
        </ModalBody>
    </Modal>
}

export default EstimationInitiateDialog