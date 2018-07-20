import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {ReleasePlanAddToReleaseFormContainer} from "../../containers"

const ReleasePlanAddToReleaseDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Add To ReleasePlan</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <ReleasePlanAddToReleaseFormContainer/>
        </ModalBody>
    </Modal>
}

export default ReleasePlanAddToReleaseDialog