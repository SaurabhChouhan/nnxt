import {Modal, ModalBody, ModalHeader} from 'react-bootstrap'
import React from 'react'
import {ModuleFormContainer} from "../../containers"

const ModuleFormDialog = (props) => {
    return <Modal className="estimationModal" show={props.show} onHide={props.close}>
        <ModalHeader closeButton>
            <div className="clearfix ModalHeading">
                <div className="col-md-1 ModalSideLabel"></div>
                <h3>Add Module</h3>
            </div>
        </ModalHeader>
        <ModalBody>
            <ModuleFormContainer/>
        </ModalBody>
    </Modal>
}

export default ModuleFormDialog