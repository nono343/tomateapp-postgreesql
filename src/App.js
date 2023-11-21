// Importa las dependencias necesarias
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';

// Importa los componentes y hooks necesarios
import Login from './components/Login';
import useToken from './components/useToken';
import Admin from './pages/admin';
import Register from './components/Register';
import Categorias from './pages/categorias';
import Inicio from './pages/inicio';
import DetalleProducto from './pages/productos';
import { Navbar } from './components/Navbar';

// Función principal del componente App
function App() {
  // Obtiene el token y las funciones relacionadas con el token usando el hook useToken
  const { token, removeToken, setToken } = useToken();

  // Decodificar el token para acceder a sus campos
  const decodedToken = token ? jwt_decode(token) : null;

  // Verificar si el usuario es un administrador
  const isAdmin = decodedToken && decodedToken.isAdmin === 'admin';

  // Imprime el token decodificado
  if (decodedToken) {
    // console.log('Decoded Token:', decodedToken);
  }

  const [isSpanish, setIsSpanish] = useState(true);

  const handleLogout = () => {
    removeToken();
  };


  console.log(token)

  // Renderiza el componente Navbar solo si existe un token válido
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
      {/* <ProductSearch token={token} setToken={setToken} /> */}
      {/* Renderiza las rutas condicionalmente dependiendo de la existencia del token */}
      <Routes>
        <Route path='/' element={<Login setToken={setToken} token={token} />} />
      </Routes>

      {(!token || token === '' || token === undefined) ? (
        <Routes>
          <Route path='/register' element={<Register setToken={setToken} />} />
        </Routes>
      ) : (
        <Routes>
          <Route
            path='/inicio'
            element={<Inicio token={token} setToken={setToken} isSpanish={isSpanish} setIsSpanish={setIsSpanish} />}
          />
          <Route path='/categorias/:id' element={<Categorias token={token} setToken={setToken} isSpanish={isSpanish} setIsSpanish={setIsSpanish} />} />
          <Route
            path='/categorias/:categoria_id/productos/:producto_id'
            element={<DetalleProducto token={token} setToken={setToken} />}
          />
          {isAdmin && (
            <Route path='/admin' element={<Admin token={token} setToken={setToken} />} />
          )}
        </Routes>
      )}
    </BrowserRouter>
  );
}

// Exporta el componente App
export default App;
