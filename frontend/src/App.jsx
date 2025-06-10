import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './componentes/NavBar';
import RutasPage from './pages/RutasPage';
import ChoferesPage from './pages/ChoferesPage';


function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/rutas" element={<RutasPage />} />
          <Route path="/choferes" element={<ChoferesPage />} />
          <Route path="*" element={<RutasPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
