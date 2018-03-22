import {Modal, ModalHeader, ModalTitle, ModalBody} from 'react-bootstrap'
import React from 'react'
import {ProjectFormContainer} from "../../containers"

const ProjectFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Add Project</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <ProjectFormContainer/>
        </ModalBody>
    </Modal>
}

export default ProjectFormDialog