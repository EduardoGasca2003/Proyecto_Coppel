import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Prueba() {
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/api')
      .then(response => {
        setMensaje(response.data.mensaje);
      })
      .catch(error => {
        console.error('Error al obtener el saludo de la api:', error);
      });
  }, []);

  return (
    <div>
      <h2>Mensaje del backend con APPII:</h2>
      <p>{mensaje || 'Cargando...'}</p>
    </div>
  );
}

export default Prueba;
