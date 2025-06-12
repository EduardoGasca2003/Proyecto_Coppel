import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ModalCrearRuta = ({ show, handleClose, onRutaCreada }) => {
  // Estado del formulario y errores
  const [formData, setFormData] = useState({
    nombre_ruta: '',
    ciudad_id: '',
    chofer_id: '',
    tipo_servicio: '1',
    capacidad: ''
  });

  const [errores, setErrores] = useState({});
  const [ciudades, setCiudades] = useState([]);
  const [choferes, setChoferes] = useState([]);
  const [showConfirmClose, setShowConfirmClose] = useState(false); // Modal de confirmación

  // Carga inicial de ciudades
  useEffect(() => {
    const fetchCiudades = async () => {
      const res = await axios.get('http://localhost:8000/api/ciudades');
      setCiudades(res.data);
    };
    fetchCiudades();
  }, []);

  // Carga de choferes cuando se selecciona una ciudad
  useEffect(() => {
    if (formData.ciudad_id) {
      axios.get(`http://localhost:8000/api/choferes/ciudad/${formData.ciudad_id}`)
        .then(res => setChoferes(res.data))
        .catch(() => setChoferes([]));
    }
  }, [formData.ciudad_id]);

  // Manejo de cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrores({ ...errores, [name]: '' }); // Limpia error cuando se corrige
  };

  // Validaciones del formulario
  const validarFormulario = () => {
    const nuevosErrores = {};
    const alfanumericoRegex = /^[a-zA-Z0-9\s]+$/;

    if (!formData.nombre_ruta.trim()) {
      nuevosErrores.nombre_ruta = 'El nombre es obligatorio.';
    } else {
      if (formData.nombre_ruta.length > 15) {
        nuevosErrores.nombre_ruta = 'Máximo 15 caracteres.';
      } else if (!alfanumericoRegex.test(formData.nombre_ruta)) {
        nuevosErrores.nombre_ruta = 'Solo letras y números permitidos.';
      }
    }

    if (!formData.ciudad_id) {
      nuevosErrores.ciudad_id = 'Debes seleccionar una ciudad.';
    }

    if (!formData.chofer_id) {
      nuevosErrores.chofer_id = 'Debes seleccionar un chofer.';
    }

    const maxCapacidad = formData.tipo_servicio === '2' ? 100 : 34;

    if (!formData.capacidad) {
      nuevosErrores.capacidad = 'La capacidad es obligatoria.';
    } else if (formData.capacidad <= 0 || formData.capacidad > maxCapacidad) {
      nuevosErrores.capacidad = `Capacidad debe ser entre 1 y ${maxCapacidad}.`;
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      const res = await axios.post('http://localhost:8000/api/rutas', formData);
      onRutaCreada(res.data);
      resetFormulario();
      window.location.reload();
      handleClose();
    } catch (error) {
      console.error('Error al crear ruta:', error);
    }
  };

  

  // Limpiar formulario
  const resetFormulario = () => {
    setFormData({
      nombre_ruta: '',
      ciudad_id: '',
      chofer_id: '',
      tipo_servicio: '1',
      capacidad: ''
    });
    setErrores({});
    setChoferes([]);
  };

  // Mostrar modal de confirmación al intentar cerrar
  const handleIntentarCerrar = () => {
    setShowConfirmClose(true);
  };

  // Confirmar que se quiere cerrar
  const confirmarCerrar = () => {
    resetFormulario();
    setShowConfirmClose(false);
    handleClose();
  };

  // Cancelar cierre y mantener campos llenados
  const cancelarCerrar = () => {
    setShowConfirmClose(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleIntentarCerrar} backdrop="static" keyboard={true}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nueva Ruta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* Nombre */}
            <Form.Group>
              <Form.Label>Nombre de la ruta</Form.Label>
              <Form.Control
                type="text"
                name="nombre_ruta"
                value={formData.nombre_ruta}
                onChange={handleChange}
                maxLength={15}
                isInvalid={!!errores.nombre_ruta}
              />
              <Form.Control.Feedback type="invalid">
                {errores.nombre_ruta}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Ciudad */}
            <Form.Group className="mt-2">
              <Form.Label>Ciudad</Form.Label>
              <Form.Select
                name="ciudad_id"
                value={formData.ciudad_id}
                onChange={handleChange}
                isInvalid={!!errores.ciudad_id}
              >
                <option value="">Seleccione una ciudad</option>
                {ciudades.map(ciudad => (
                  <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errores.ciudad_id}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Chofer */}
            <Form.Group className="mt-2">
              <Form.Label>Chofer</Form.Label>
              <Form.Select
                name="chofer_id"
                value={formData.chofer_id}
                onChange={handleChange}
                isInvalid={!!errores.chofer_id}
              >
                <option value="">Seleccione un chofer</option>
                {choferes.map(chofer => (
                  <option key={chofer.id} value={chofer.id}>
                    {chofer.nombre} {chofer.apellido_paterno}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errores.chofer_id}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Tipo de servicio */}
            <Form.Group className="mt-2">
              <Form.Label>Tipo de servicio</Form.Label>
              <Form.Select
                name="tipo_servicio"
                value={formData.tipo_servicio}
                onChange={handleChange}
              >
                <option value="1">Personal</option>
                <option value="2">Artículos</option>
              </Form.Select>
            </Form.Group>

            {/* Capacidad */}
            <Form.Group className="mt-2">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                isInvalid={!!errores.capacidad}
                placeholder={formData.tipo_servicio === '2' ? 'Máximo 100' : 'Máximo 34'}
              />
              <Form.Control.Feedback type="invalid">
                {errores.capacidad}
              </Form.Control.Feedback>
            </Form.Group>
                <Modal.Footer>
                  <Button class="btn btn-primary" variant="secondary" onClick={handleIntentarCerrar}>
                    Salir
                  </Button>
                  <Button class="btn btn-primary" variant="primary" type="submit" className="mt-3" >
                    Crear Chofer
                  </Button>
              </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de confirmación para salir */}
      <Modal show={showConfirmClose} onHide={cancelarCerrar} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Deseas salir?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Se perderán los datos no guardados. ¿Seguro que deseas salir?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelarCerrar}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarCerrar}>
            Salir sin guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalCrearRuta;
