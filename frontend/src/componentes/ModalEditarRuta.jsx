import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ModalEditarRuta = ({ show, handleClose, ruta, onRutaActualizada }) => {
  const [formData, setFormData] = useState({ ...ruta });
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (ruta) {
      setFormData({ ...ruta });
    }
  }, [ruta]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validaciones inmediatas
    if (name === 'nombre_ruta' && (!/^[a-zA-Z0-9\s]{1,15}$/.test(value))) {
      setErrores(prev => ({ ...prev, nombre_ruta: 'Máximo 15 caracteres alfanuméricos.' }));
    } else if (name === 'capacidad') {
      const max = formData.tipo_servicio === '2' ? 100 : 34;
      if (parseInt(value) > max) {
        setErrores(prev => ({ ...prev, capacidad: `Capacidad máxima para este tipo: ${max}` }));
      } else {
        setErrores(prev => ({ ...prev, capacidad: null }));
      }
    } else {
      setErrores(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datosEditados = {
        nombre_ruta: formData.nombre_ruta,
        tipo_servicio: formData.tipo_servicio,
        capacidad: formData.capacidad,
        chofer_id: formData.chofer_id
      };

      const res = await axios.put(`http://localhost:8000/api/rutas/${formData.id}`, datosEditados);
      onRutaActualizada(res.data);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error('Error al editar ruta:', error);
      console.log('Respuesta del backend:', error.response?.data);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Ruta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Nombre de la ruta</Form.Label>
            <Form.Control
              type="text"
              name="nombre_ruta"
              value={formData.nombre_ruta || ''}
              onChange={handleChange}
              maxLength={15}
              required
              isInvalid={!!errores.nombre_ruta}
            />
            <Form.Control.Feedback type="invalid">{errores.nombre_ruta}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Tipo de servicio</Form.Label>
            <Form.Select name="tipo_servicio" value={formData.tipo_servicio} onChange={handleChange}>
              <option value="1">Personal</option>
              <option value="2">Artículos</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Capacidad</Form.Label>
            <Form.Control
              type="number"
              name="capacidad"
              value={formData.capacidad || ''}
              onChange={handleChange}
              required
              isInvalid={!!errores.capacidad}
            />
            <Form.Control.Feedback type="invalid">{errores.capacidad}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="mt-3" variant="primary" disabled={Object.values(errores).some(Boolean)}>
            Guardar Cambios
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalEditarRuta;
