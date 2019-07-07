import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {BillingTaskDescriptionFormContainer} from "../../containers"

const BillingTaskDescriptionFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Billing Description</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <BillingTaskDescriptionFormContainer/>
        </ModalBody>
    </Modal>
}

export default BillingTaskDescriptionFormDialog