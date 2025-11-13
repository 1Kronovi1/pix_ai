// src/components/Navbar.jsx
import { NavLink } from "react-router-dom";

export default function Navbar(){
  return (
    <div className="navbar">
      <div className="brand">PIX AI — Simulador</div>
      <div className="navlinks">
        <NavLink to="/" end className={({isActive})=> isActive ? "active" : ""}>Início</NavLink>
        <NavLink to="/enviar" className={({isActive})=> isActive ? "active" : ""}>Enviar PIX</NavLink>
        <NavLink to="/historico" className={({isActive})=> isActive ? "active" : ""}>Histórico</NavLink>
      </div>
    </div>
  );
}