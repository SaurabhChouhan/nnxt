import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {EstimationAddToReleaseFormContainer} from "../../containers"

const EstimationAddToReleaseDialog = (props) => {
    return <Modal className="add-to-release-dialog" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Add To Release</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <EstimationAddToReleaseFormContainer/>
        </ModalBody>
    </Modal>
}

export default EstimationAddToReleaseDialog