import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {ReleasePlanningUpdateFormContainer} from "../../containers"

const ReleasePlanningUpdateFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Update Planning Date</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <ReleasePlanningUpdateFormContainer/>
        </ModalBody>
    </Modal>
}

export default ReleasePlanningUpdateFormDialog