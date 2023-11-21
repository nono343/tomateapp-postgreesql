import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';

import Login from './components/Login';
import useToken from './components/useToken';
import Admin from './pages/admin';
import Register from './components/Register';
import Categorias from './pages/categorias';
import Inicio from './pages/inicio';
import DetalleProducto from './pages/productos';
import { Navbar } from './components/Navbar';

function App() {
  const { token, removeToken, setToken } = useToken();
  const decodedToken = token ? jwt_decode(token) : null;
  const isAdmin = decodedToken && decodedToken.isAdmin === 'admin';
  const [isSpanish, setIsSpanish] = useState(true);

  const handleLogout = () => {
    removeToken();
  };

  console.log(token);

  return (
    <BrowserRouter>
      {token && (
        <Navbar
          token={token}
          setToken={setToken}
          isSpanish={isSpanish}
          setIsSpanish={setIsSpanish}
          onLogout={handleLogout}
        />
      )}

      {(!token || token === '' || token === undefined) ? (
        <Routes>
          <Route path='/' element={<Login setToken={setToken} token={token} />} />
          {/* Redirige a la página de inicio si el token no existe o es nulo */}
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <Routes>
          <Route path='/inicio' element={<Inicio token={token} setToken={setToken} isSpanish={isSpanish} setIsSpanish={setIsSpanish} />} />
          <Route path='/categorias/:id' element={<Categorias token={token} setToken={setToken} isSpanish={isSpanish} setIsSpanish={setIsSpanish} />} />
          <Route path='/categorias/:categoria_id/productos/:producto_id' element={<DetalleProducto token={token} setToken={setToken} />} />
          {isAdmin && (
            <Route path='/admin' element={<Admin token={token} setToken={setToken} />} />
          )}
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
