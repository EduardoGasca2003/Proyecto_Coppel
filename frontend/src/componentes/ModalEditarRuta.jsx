import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ModalEditarRuta = ({ show, handleClose, ruta, onRutaActualizada }) => {
  const [formData, setFormData] = useState({ ...ruta });
  const [errores, setErrores] = useState({});
  const [choferes, setChoferes] = useState([]);

  useEffect(() => {
    if (ruta) {
      console.log('Datos de ruta recibidos:', ruta);
      setFormData({ ...ruta });
      if (ruta.ciudad_id) {
        obtenerChoferesPorCiudad(ruta.ciudad_id);
      }
    }
  }, [ruta]);

  const obtenerChoferesPorCiudad = async (ciudad_id) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/choferes`);
      const filtrados = res.data.filter(c => c.ciudad_id === ciudad_id);
      setChoferes(filtrados);
    } catch (error) {
      console.error('Error al obtener choferes:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'capacidad') {
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
        tipo_servicio: formData.tipo_servicio,
        capacidad: formData.capacidad,
        chofer_id: formData.chofer_id,
        nombre_ruta: formData.nombre_ruta
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
            <Form.Label>Ciudad</Form.Label>
            <Form.Control
              type="text"
              value={formData.ciudad?.nombre || ''}
              disabled
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Nombre de la ruta</Form.Label>
            <Form.Control
              type="text"
              value={ruta?.nombre_ruta || ''}
              disabled
            />
          </Form.Group>

          <Form.Group className="mt-2">
            <Form.Label>Chofer</Form.Label>
            <Form.Select
              name="chofer_id"
              value={formData.chofer_id || ''}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un chofer</option>
              {choferes.map(chofer => (
                <option key={chofer.id} value={chofer.id}>
                  {chofer.nombre} {chofer.apellido_paterno}
                </option>
              ))}
            </Form.Select>
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
