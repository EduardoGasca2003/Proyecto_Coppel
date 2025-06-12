import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const ModalCrearChofer = ({ show, handleClose, onChoferCreada }) => {
    const [ciudades, setCiudades] = useState([]);
    const [nombre, setNombre] = useState('');
    const [apellidoPaterno, setApellidoPaterno] = useState('');
    const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [ciudadId, setCiudadId] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [sueldo, setSueldo] = useState('');

    const [errores, setErrores] = useState({});

    useEffect(() => {
        if (show) {
            obtenerCiudades();
            limpiarFormulario();
        }
    }, [show]);

    const obtenerCiudades = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/ciudades');
            setCiudades(res.data);
        } catch (error) {
            console.error('Error al obtener ciudades:', error);
        }
    };

    const limpiarFormulario = () => {
        setNombre('');
        setApellidoPaterno('');
        setApellidoMaterno('');
        setCiudadId('');
        setFechaNacimiento('');
        setSueldo('');
        setErrores({});
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!nombre.match(/^[a-zA-Z0-9]{1,15}$/)) {
            nuevosErrores.nombre = 'Máx. 15 caracteres alfanuméricos';
        }
        if (!apellidoPaterno) {
            nuevosErrores.apellidoPaterno = 'Requerido';
        }
        if (!apellidoMaterno) {
            nuevosErrores.apellidoMaterno = 'Requerido';
        }
        if (!fechaNacimiento) {
            nuevosErrores.fechaNacimiento = 'Requerida';
        }
        if (!sueldo || isNaN(sueldo)) {
            nuevosErrores.sueldo = 'Debe ser un número';
        }
        if (!ciudadId) {
            nuevosErrores.ciudadId = 'Seleccione una ciudad';
        }
        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const crearChofer = async () => {
        if (!validarFormulario()) return;

        try {
            const response = await axios.post('http://localhost:8000/api/choferes', {
                nombre,
                apellido_paterno: apellidoPaterno,
                apellido_materno: apellidoMaterno,
                ciudad_id: ciudadId,
                fecha_nacimiento: fechaNacimiento,
                sueldo,
            });
            onChoferCreada(response.data);
            handleClose();
        } catch (error) {
            console.error('Error al crear chofer:', error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Nuevo Chofer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            isInvalid={!!errores.nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.nombre}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Apellido Paterno</Form.Label>
                        <Form.Control
                            type="text"
                            value={apellidoPaterno}
                            onChange={(e) => setApellidoPaterno(e.target.value)}
                            isInvalid={!!errores.apellidoPaterno}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.apellidoPaterno}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Apellido Materno</Form.Label>
                        <Form.Control
                            type="text"
                            value={apellidoMaterno}
                            onChange={(e) => setApellidoMaterno(e.target.value)}
                            isInvalid={!!errores.apellidoMaterno}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.apellidoMaterno}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Select
                            value={ciudadId}
                            onChange={(e) => setCiudadId(e.target.value)}
                            isInvalid={!!errores.ciudadId}
                        >
                            <option value="">Seleccione una ciudad</option>
                            {ciudades.map((ciudad) => (
                                <option key={ciudad.id} value={ciudad.id}>
                                    {ciudad.nombre}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            {errores.ciudadId}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de Nacimiento</Form.Label>
                        <Form.Control
                            type="date"
                            value={fechaNacimiento}
                            onChange={(e) => setFechaNacimiento(e.target.value)}
                            isInvalid={!!errores.fechaNacimiento}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.fechaNacimiento}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Sueldo</Form.Label>
                        <Form.Control
                            type="number"
                            value={sueldo}
                            onChange={(e) => setSueldo(e.target.value)}
                            isInvalid={!!errores.sueldo}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errores.sueldo}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={crearChofer}>
                    Crear Chofer
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalCrearChofer;
