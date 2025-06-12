import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const ModalCrearCiudad = ({ show, handleClose, onCiudadCreada }) => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('El nombre de la ciudad es obligatorio');
      return;
    }

    try {
      setEnviando(true);
      const response = await axios.post('http://localhost:8000/api/ciudades', { nombre });
      setEnviando(false);
      setNombre('');
      setError('');
      handleClose();
      window.location.reload();
      if (onCiudadCreada) onCiudadCreada(response.data); // opcional para recargar ciudades
    } catch (err) {
      setEnviando(false);
      setError('Ocurrió un error al guardar la ciudad');
      console.error(err);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Nueva Ciudad</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group controlId="formNombreCiudad">
            <Form.Label>Nombre de la ciudad</Form.Label>
            <Form.Control
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={50}
              placeholder="Ej. Culiacán"
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={enviando}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ModalCrearCiudad;
