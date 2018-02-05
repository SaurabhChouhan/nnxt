import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {EstimationFeatureFormContainer} from "../../containers"

const EstimationFeatureDialog = (props) => {
    return <Modal  className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Add Feature to Estimation</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <EstimationFeatureFormContainer/>
        </ModalBody>
    </Modal>
}

export default EstimationFeatureDialog