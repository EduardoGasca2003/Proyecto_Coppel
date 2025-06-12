import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import ModalCrearCiudad from './ModalCrearCiudad';
import axios from 'axios';



function NavBar() {

  const [showGestion, setShowGestion] = useState(false);
  const [showCrear, setShowCrear] = useState(false);
  const [showEliminar, setShowEliminar] = useState(false);
  const [ciudadEliminar, setCiudadEliminar] = useState('');
  const [mensajeEliminar, setMensajeEliminar] = useState('');

  const handleEliminarCiudad = async () => {
    try {
      const response = await axios.delete(`http://localhost:8000/api/ciudades/eliminar/${encodeURIComponent(ciudadEliminar)}`);
      setMensajeEliminar(response.data.message || 'Ciudad eliminada correctamente');
      window.location.reload();
    } catch (error) {
      setMensajeEliminar('Ciudad no encontrada o error al eliminar');
    }
  };
  
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
        <a className="navbar-brand" href="/">
        <img src="/coppel.png" alt="Logo" style={{ width: 'auto', height: '30px', marginRight: '8px' }}/></a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <NavLink to="/rutas" className="nav-link">Rutas</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/choferes" className="nav-link">Choferes</NavLink>
            </li>
          </ul>
        </div>
        <Button variant="outline-light" className="ms-3" onClick={() => setShowGestion(true)}>
          Ciudades
        </Button>
      </nav>

      {/* Modal de opciones */}
    <Modal show={showGestion} onHide={() => setShowGestion(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Gestión de Ciudades</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-flex flex-column gap-2">
        <Button variant="success" onClick={() => { setShowCrear(true); setShowGestion(false); }}>
          Registrar Ciudad
        </Button>
        <Button variant="danger" onClick={() => { setShowEliminar(true); setShowGestion(false); }}>
          Eliminar Ciudad
        </Button>
      </Modal.Body>
    </Modal>

    {/* Modal para crear ciudad */}
    <ModalCrearCiudad show={showCrear} handleClose={() => setShowCrear(false)} />

    {/* Modal para eliminar ciudad */}
    <Modal show={showEliminar} onHide={() => setShowEliminar(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Ciudad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mensajeEliminar && <Alert variant="info">{mensajeEliminar}</Alert>}
        <Form.Group>
          <Form.Label>Nombre de la ciudad a eliminar</Form.Label>
          <Form.Control
            type="text"
            value={ciudadEliminar}
            onChange={(e) => setCiudadEliminar(e.target.value)}
            placeholder="Ej. Guadalajara"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowEliminar(false)}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleEliminarCiudad}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  </>

  );
}

export default NavBar;
