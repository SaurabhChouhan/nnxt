import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {EstimationTaskFormContainer} from "../../containers"

const EstimationTaskDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Add Task to Estimation</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <EstimationTaskFormContainer/>
        </ModalBody>
    </Modal>
}

export default EstimationTaskDialog