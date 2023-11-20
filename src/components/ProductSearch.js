import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductSearch = ({ onSearch, onSearchComplete, isSpanish }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [categoriaId, setCategoriaId] = useState(1); // Initialize with a default value

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/categorias/${categoriaId}/productos?nombre=${searchTerm}`);
                setSearchResults(response.data.productos);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                onSearchComplete(); // Call the onSearchComplete function regardless of success or error
            }
        };

        // Fetch data only if searchTerm is not empty
        if (searchTerm.trim() !== '') {
            onSearch(); // Call the onSearch function before fetching data
            fetchData();
        } else {
            setSearchResults([]); // Clear results if searchTerm is empty
            onSearchComplete(); // Call onSearchComplete if searchTerm is empty
        }
    }, [searchTerm, categoriaId, onSearch, onSearchComplete]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    return (
        <div className='relative py-5 px-10 animate-fade-down'>
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
                                    to={`/categorias/${categoriaId}/productos/${product.id}`}
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
