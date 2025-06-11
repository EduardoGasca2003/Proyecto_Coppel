import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ModalConfirmarEliminar = ({ show, handleClose, handleConfirm, nombreRuta }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ¿Estás seguro de que deseas eliminar la ruta <strong>{nombreRuta}</strong>? Esta acción no se puede deshacer.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="danger" onClick={handleConfirm}>Eliminar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalConfirmarEliminar;
