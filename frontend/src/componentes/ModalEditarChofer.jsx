import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ModalEditarChofer = ({ show, handleClose, chofer, onChoferActualizada }) => {
  const [formData, setFormData] = useState({ ...chofer });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (chofer) {
      setFormData({ ...chofer });
    }
  }, [chofer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validaciones inmediatas
    if (name === 'fecha_nacimiento' && !value) {
      setErrores(prev => ({ ...prev, fecha_nacimiento: 'Fecha requerida' }));
    } else if (name === 'sueldo') {
      if (!/^\d+(\.\d{1,2})?$/.test(value)) {
        setErrores(prev => ({ ...prev, sueldo: 'Solo números válidos' }));
      } else {
        setErrores(prev => ({ ...prev, sueldo: null }));
      }
    } else {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};

    try {
      const datosEditados = {
      fecha_nacimiento: formData.fecha_nacimiento,
      sueldo: formData.sueldo
    };

      const res = await axios.put(`http://localhost:8000/api/choferes/${formData.id}`, datosEditados);
      onChoferActualizada(res.data);
      console.log('Chofer editado exitosamente:', res.data);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error('Error al editar chofer:', error);
      console.log('Respuesta del backend:', error.response?.data);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Chofer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={formData.nombre || ''}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Apellido Paterno</Form.Label>
            <Form.Control
              type="text"
              value={formData.apellido_paterno || ''}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Apellido Materno</Form.Label>
            <Form.Control
              type="text"
              value={formData.apellido_materno || ''}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              value={formData.ciudad || ''}
              disabled
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Ruta</Form.Label>
            <Form.Control
              type="text"
              value={formData.ruta || ''}
              disabled
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Fecha de nacimiento</Form.Label>
            <Form.Control
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento || ''}
              onChange={handleChange}
              required
              isInvalid={!!errores.fecha_nacimiento}
            />
            <Form.Control.Feedback type="invalid">{errores.fecha_nacimiento}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Sueldo</Form.Label>
            <Form.Control
              type="number"
              name="sueldo"
              value={formData.sueldo || ''}
              onChange={handleChange}
              required
              isInvalid={!!errores.sueldo}
            />
            <Form.Control.Feedback type="invalid">{errores.sueldo}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="mt-3" variant="primary" disabled={Object.values(errores).some(Boolean)}>
            Guardar Cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEditarChofer;
