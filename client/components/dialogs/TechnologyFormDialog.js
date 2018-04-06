import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {TechnologyFormContainer} from "../../containers"

const technologyFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Add Technology</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <TechnologyFormContainer/>
        </ModalBody>
    </Modal>
}

export default technologyFormDialog