import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {EstimationFilterFormContainer} from "../../containers"

const EstimationFilterDialog = (props) => {
    return <Modal show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <h3>Filters</h3>
        </ModalHeader>
        <ModalBody>
            <EstimationFilterFormContainer/>
        </ModalBody>
    </Modal>
}

export default EstimationFilterDialog