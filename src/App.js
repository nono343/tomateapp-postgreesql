import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';

import Login from './components/Login';
import useToken from './components/useToken';
import Admin from './pages/admin';
import Register from './components/Register';
import Categorias from './pages/categorias';
import Inicio from './pages/inicio';
import DetalleProducto from './pages/productos';

function App() {
  const { token, removeToken, setToken } = useToken();

  // Decodificar el token para acceder a sus campos
  const decodedToken = token ? jwt_decode(token) : null;

  // Verificar si el usuario es un administrador
  const isAdmin = decodedToken && decodedToken.isAdmin === 'admin';
  const userId = decodedToken && decodedToken.sub;

  console.log('Token:', decodedToken);
  console.log('isAdmin:', isAdmin);
  console.log('userId:', parseInt(userId, 10));

  // Imprime el token decodificado
  if (decodedToken) {
    console.log('Decoded Token:', decodedToken);
  }

  return (
    <BrowserRouter>
      <div className='max-w-scren-2xl mx-auto'>
        {!token && token !== '' && token !== undefined ? (
          <Routes>
            <Route path='/login' element={<Login setToken={setToken} />} />
            <Route path='/register' element={<Register setToken={setToken} />} />
          </Routes>
        ) : (
          <Routes>
            <Route path='/inicio' element={<Inicio token={token} setToken={setToken} />} />
            <Route path='/categorias/:id' element={<Categorias token={token} setToken={setToken} />} />
            <Route
              path='/categorias/:categoria_id/productos/:producto_id'
              element={<DetalleProducto token={token} setToken={setToken} />}
            />

            {isAdmin && (
              <Route
                path='/admin'
                element={<Admin token={token} setToken={setToken} />}
              />
            )}
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
