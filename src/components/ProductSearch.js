import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductSearch = ({ isSpanish, setIsSearching }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    try {
        const response = await fetch(`http://localhost:5000/productos?nombre=${term}`);
        const data = await response.json();
        setSearchResults(data.products);
        setIsSearching(!!term.trim()); // true if there is a search term, false otherwise
      } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
      }
    };
  
  
  return (
    <div className='py-5 px-10'>
      <div className="form-control w-full max-w-sm mx-auto">
        <input
          type="text"
          placeholder={isSpanish ? "Buscar productos por nombre..." : "Search products by name..."}
          value={searchTerm}
          onChange={handleInputChange}
          className="input input-bordered input-success w-full max-w-xs"
        />
      </div>
      {searchResults.length > 0 && searchTerm.trim() !== '' && (
        <div className="relative py-5">
          <div className="container relative m-auto px-6 text-gray-500 md:px-12">
            <div className="grid gap-6 md:mx-auto md:w-8/12 lg:w-full lg:grid-cols-3 animate-fade">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  to={`/categorias/${product.categoria_id}/productos/${product.id}`}
                  onClick={() => console.log(product.id)}
                  className="group space-y-1 border border-gray-100 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800 px-8 py-12 text-center shadow-2xl shadow-gray-600/10 dark:shadow-none transition-transform transform hover:scale-105 duration-500 ease-in-out hover:shadow-2xl hover:border-red-400"
                >
                  <img
                    className="mx-auto w-120"
                    src={`http://localhost:5000/uploads/${product.foto}`}
                    alt={isSpanish ? product.nombreesp : product.nombreeng}
                    loading="lazy"
                  />
                  <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
                    {isSpanish ? product.nombreesp : product.nombreeng}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
