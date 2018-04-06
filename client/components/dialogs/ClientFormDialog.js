import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {ClientFormContainer} from "../../containers"

const ClientFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Add Client</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <ClientFormContainer/>
        </ModalBody>
    </Modal>
}

export default ClientFormDialog