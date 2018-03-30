import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {EstimationSuggestTaskFormContainer} from "../../containers"

const EstimationSuggestTaskDialog = (props) => {
    return <Modal className="estimationModal suggestDialog" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Suggest Task Detail For Estimation</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <EstimationSuggestTaskFormContainer/>
        </ModalBody>
    </Modal>
}

export default EstimationSuggestTaskDialog