import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {EstimationFilterFormContainer} from "../../containers"

const EstimationFilterDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Filters</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <EstimationFilterFormContainer/>
        </ModalBody>
    </Modal>
}

export default EstimationFilterDialog