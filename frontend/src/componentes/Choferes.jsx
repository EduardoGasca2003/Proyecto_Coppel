import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, Pagination } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import ModalCrearChofer from './ModalCrearChofer';
import ModalEditarChofer from './ModalEditarChofer';
import ModalConfirmarEliminarChofer from './ModalConfirmarEliminarChofer';
import ModalCrearCiudad from './ModalCrearCiudad';

const Choferes = () => {
    
    const [choferes, setChoferes] = useState([]);
    const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroRuta, setFiltroRuta] = useState('');

    // Filtrar choferes según la ciudad, nombre y ruta
    const choferesFiltrados = choferes.filter((c) => {
        const coincideCiudad = ciudadSeleccionada === '' || c.ciudad_id === parseInt(ciudadSeleccionada);
        const coincideNombre = (c.nombre ?? '').toLowerCase().includes(filtroNombre.toLowerCase());
        const coincideRuta = (c.ruta ?? '').toLowerCase().includes(filtroRuta.toLowerCase());
        return coincideCiudad && coincideNombre && coincideRuta;
    });

    const [ciudades, setCiudades] = useState([]);
    const [paginaActual, setPaginaActual] = useState(1);
    const choferesPorPagina = 5;

    const [modalEditarVisible, setModalEditarVisible] = useState(false);
    const [choferSeleccionada, setChoferSeleccionada] = useState(null);

    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

    const [mostrarModalCiudad, setMostrarModalCiudad] = useState(false);
    const abrirModalCiudad = () => setMostrarModalCiudad(true);
    const cerrarModalCiudad = () => setMostrarModalCiudad(false);

    const abrirModalEditar = (chofer) => {
        setChoferSeleccionada(chofer);
        setModalEditarVisible(true);
        };

        const cerrarModalEditar = () => {
        setModalEditarVisible(false);
        setChoferSeleccionada(null);
        };

        const abrirModalEliminar = (chofer) => {
        setChoferSeleccionada(chofer);
        setMostrarModalEliminar(true);
        };

        const cerrarModalEliminar = () => {
        setMostrarModalEliminar(false);
        setChoferSeleccionada(null);
        };


        const choferActualizada = (choferActualizada) => {
        setChoferes(prev =>
            prev.map(r => (r.id === choferActualizada.id ? { ...r, ...choferActualizada } : r))
        );
    };


    useEffect(() => {
      obtenerCiudades();
    }, []);

    

    const [mostrarModal, setMostrarModal] = useState(false);
    const abrirModal = () => setMostrarModal(true);
    const cerrarModal = () => setMostrarModal(false);

    const choferCreada = (nuevaChofer) => {
    setChoferes([nuevaChofer, ...choferes]);
    };

    const confirmarEliminar = async () => {
        if (!choferSeleccionada) return;

        try {
            await axios.delete(`http://localhost:8000/api/choferes/${choferSeleccionada.id}`);
            setChoferes(choferes.filter(r => r.id !== choferSeleccionada.id));
            cerrarModalEliminar();
        } catch (error) {
            console.error('Error al eliminar chofer:', error);
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

    const obtenerChoferes = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/choferes');
        setChoferes(res.data);
      } catch (error) {
        console.error('Error al obtener choferes:', error);
      }
    };

    useEffect(() => {
      const cargarChoferes = async () => {
        try {
          const respuesta = await axios.get('http://localhost:8000/api/choferes');
          const choferesConInfo = await Promise.all(
            respuesta.data.map(async (chofer) => {
              const resInfo = await axios.get(`http://localhost:8000/api/choferes/${chofer.id}/info`);
              return { ...chofer, ciudad: resInfo.data.ciudad, ruta: resInfo.data.ruta };
            })
          );
          setChoferes(choferesConInfo);
        } catch (error) {
          console.error('Error al cargar choferes:', error);
      }
    };

  cargarChoferes();
}, []);

    const eliminarChofer = async (id) => {
          try {
              await axios.delete(`http://tu-api.com/choferes/${id}`);
              obtenerChoferes();
          } catch (error) {
              console.error('Error al eliminar chofer:', error);
          }
    };

    // Configuracion de Paginación
    const choferesPaginadas = choferesFiltrados.slice(
    (paginaActual - 1) * choferesPorPagina,
    paginaActual * choferesPorPagina
    );

    const totalPaginas = Math.ceil(choferesFiltrados.length / choferesPorPagina);
    const cambiarPagina = (numero) => {
        setPaginaActual(numero);
    };
    useEffect(() => {
        setPaginaActual(1);
    }, [ciudadSeleccionada, filtroNombre, filtroRuta]);


    // Condicuión para mostrar mensaje y boton para crear si no hay ciudades
    if (ciudades.length === 0) {
      return (
        <div className="container mt-4">
          <h4>No hay ciudades registradas. De clic en el boton para crear una nueva ciudad.</h4>
          <Button variant="primary" onClick={abrirModalCiudad}>+ Nueva Ciudad</Button>
        </div>
      );
    }
  return (


    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Listado de Choferes</h3>
        <Button variant="success" onClick={abrirModal}>+ Nuevo Chofer</Button>
      </div>
    
        <Form.Select value={ciudadSeleccionada} onChange={e => setCiudadSeleccionada(e.target.value)}>
            <option value="">Todas las ciudades</option>
            {ciudades.map(ciudad => (
                <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
            ))}
        </Form.Select>

        <Form.Control
            type="text"
            placeholder="Buscar por nombre"
            value={filtroNombre}
            onChange={e => setFiltroNombre(e.target.value)}
            className="mt-2"
        />

        <Form.Control
            type="text"
            placeholder="Buscar por ruta"
            value={filtroRuta}
            onChange={e => setFiltroRuta(e.target.value)}
            className="mt-2"
        />


      <Table striped bordered hover>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Ciudad</th>
                <th>Ruta</th>
                <th>Fecha de Nacimiento</th>
                <th>Sueldo</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
          {choferesPaginadas.map((chofer) => (
            <tr key={chofer.id}>
                <td>{chofer.id}</td>
                <td>{chofer.nombre}</td>
                <td>{chofer.apellido_paterno} {chofer.apellido_materno}</td>
                <td>{chofer.ciudad || ''}</td>
                <td>{chofer.ruta || 'Sin ruta'}</td>
                <td>{chofer.fecha_nacimiento}</td>
                <td>${parseFloat(chofer.sueldo).toFixed(2)}</td>
                <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => abrirModalEditar(chofer)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => abrirModalEliminar(chofer)}>Eliminar</Button>
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
      
      <ModalCrearChofer show={mostrarModal} handleClose={cerrarModal} onChoferCreada={choferCreada} />

        <ModalEditarChofer
            show={modalEditarVisible}
            handleClose={cerrarModalEditar}
            chofer={choferSeleccionada}
            onChoferActualizada={choferActualizada}
        />

        <ModalConfirmarEliminarChofer
            show={mostrarModalEliminar}
            handleClose={cerrarModalEliminar}
            handleConfirm={confirmarEliminar}
            nombreChofer={choferSeleccionada?.nombre_chofer || ''}
        />
          

        <ModalCrearCiudad
          show={mostrarModalCiudad}
          handleClose={() => setMostrarModalCiudad(false)}
          onCiudadCreada={() => window.location.reload()} 
        />
        
    </div>
  );
  
};

export default Choferes;
