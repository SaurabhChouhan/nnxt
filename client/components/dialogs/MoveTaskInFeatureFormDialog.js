import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {MoveTaskInFeatureFormContainer} from "../../containers"

const MoveTaskInFeatureFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Move task in feature</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <MoveTaskInFeatureFormContainer/>
        </ModalBody>
    </Modal>
}

export default MoveTaskInFeatureFormDialog