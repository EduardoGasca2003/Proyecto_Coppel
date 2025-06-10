import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <a className="navbar-brand" href="/">Control de Rutas</a>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <NavLink to="/rutas" className="nav-link">Rutas</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/choferes" className="nav-link">Choferes</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
