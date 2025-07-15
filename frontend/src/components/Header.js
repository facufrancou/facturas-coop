
import React from 'react';
import './Header.css';

function Header() {
    return (
        <nav className="navbar-app">
            <div className="navbar-content">
                <img src="/logo1.png" alt="Logo" className="logo" />
                <span className="navbar-title">Gestión de Facturas</span>
            </div>
        </nav>
    );
}

export default Header;