import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {EstimationSuggestFeatureFormContainer} from "../../containers"

const EstimationSuggestTaskDialog = (props) => {
    return <Modal  className="estimationModal suggestDialog" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Suggest Feature Detail For Estimation</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <EstimationSuggestFeatureFormContainer/>
        </ModalBody>
    </Modal>
}

export default EstimationSuggestTaskDialog