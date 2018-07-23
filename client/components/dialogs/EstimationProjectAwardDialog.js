import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {EstimationProjectAwardFormContainer} from "../../containers"

const EstimationProjectAwardDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Create Release</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <EstimationProjectAwardFormContainer/>
        </ModalBody>
    </Modal>
}

export default EstimationProjectAwardDialog