import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Pagination } from 'react-bootstrap';
import ModalCrearRuta from './ModalCrearRuta';
import ModalEditarRuta from './ModalEditarRuta';
import ModalConfirmarEliminar from './ModalConfirmarEliminar';


const Rutas = () => {
    const [rutas, setRutas] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const rutasPorPagina = 5;

    const [modalEditarVisible, setModalEditarVisible] = useState(false);
    const [rutaSeleccionada, setRutaSeleccionada] = useState(null);

    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);


    const abrirModalEditar = (ruta) => {
        setRutaSeleccionada(ruta);
        setModalEditarVisible(true);
        };

        const cerrarModalEditar = () => {
        setModalEditarVisible(false);
        setRutaSeleccionada(null);
        };

        const abrirModalEliminar = (ruta) => {
        setRutaSeleccionada(ruta);
        setMostrarModalEliminar(true);
        };

        const cerrarModalEliminar = () => {
        setMostrarModalEliminar(false);
        setRutaSeleccionada(null);
        };


        const rutaActualizada = (rutaActualizada) => {
        setRutas(prev =>
            prev.map(r => (r.id === rutaActualizada.id ? { ...r, ...rutaActualizada } : r))
        );
    };


  useEffect(() => {
    obtenerCiudades();
  }, []);

  useEffect(() => {
    if (ciudades.length > 0) {
      obtenerRutas();
    }
  }, [ciudades]);

    const [mostrarModal, setMostrarModal] = useState(false);
    const abrirModal = () => setMostrarModal(true);
    const cerrarModal = () => setMostrarModal(false);

    const rutaCreada = (nuevaRuta) => {
    setRutas([nuevaRuta, ...rutas]);
    };

    const confirmarEliminar = async () => {
        if (!rutaSeleccionada) return;

        try {
            await axios.delete(`http://localhost:8000/api/rutas/${rutaSeleccionada.id}`);
            setRutas(rutas.filter(r => r.id !== rutaSeleccionada.id));
            cerrarModalEliminar();
        } catch (error) {
            console.error('Error al eliminar ruta:', error);
        }
    };

  const obtenerCiudades = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/ciudades');
      console.log('Ciudades recibidas:', res.data);
      setCiudades(res.data);
    } catch (error) {
      console.error('Error al obtener ciudades:', error);
    }
  };

  const obtenerRutas = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/rutas');
      setRutas(res.data);
    } catch (error) {
      console.error('Error al obtener rutas:', error);
    }
  };

  const rutasPaginadas = rutas.slice(
    (paginaActual - 1) * rutasPorPagina,
    paginaActual * rutasPorPagina
  );

  const totalPaginas = Math.ceil(rutas.length / rutasPorPagina);

  const cambiarPagina = (numero) => {
    setPaginaActual(numero);
  };

  if (ciudades.length === 0) {
    return (
      <div className="container mt-4">
        <h4>No hay ciudades registradas. De clic en el boton para crear una nueva ciudad.</h4>
        <Button variant="primary">+ Nueva Ciudad</Button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Listado de Rutas</h3>
        <Button variant="success" onClick={abrirModal}>+ Nueva Ruta</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nombre Ruta</th>
            <th>Ciudad</th>
            <th>Chofer</th>
            <th>Tipo Servicio</th>
            <th>Capacidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rutasPaginadas.map((ruta) => (
            <tr key={ruta.id}>
              <td>{ruta.nombre_ruta}</td>
              <td>{ruta.ciudad?.nombre}</td>
              <td>{ruta.chofer?.nombre} {ruta.chofer?.apellido_paterno}</td>
              <td>{ruta.tipo_servicio === '1' ? 'Personal' : 'Artículos'}</td>
              <td>{ruta.capacidad}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => abrirModalEditar(ruta)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => abrirModalEliminar(ruta)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({ length: totalPaginas }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === paginaActual}
            onClick={() => cambiarPagina(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
      
      <ModalCrearRuta show={mostrarModal} handleClose={cerrarModal} onRutaCreada={rutaCreada} />

        <ModalEditarRuta
            show={modalEditarVisible}
            handleClose={cerrarModalEditar}
            ruta={rutaSeleccionada}
            onRutaActualizada={rutaActualizada}
        />

        <ModalConfirmarEliminar
            show={mostrarModalEliminar}
            handleClose={cerrarModalEliminar}
            handleConfirm={confirmarEliminar}
            nombreRuta={rutaSeleccionada?.nombre_ruta || ''}
        />

    </div>
  );
  
};

export default Rutas;
