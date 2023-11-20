import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductSearch from '../components/ProductSearch';

export default function Inicio(props) {
    const location = useLocation();
    const [categories, setCategories] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:5000/categorias')
            .then((response) => {
                setCategories(response.data.categories);
                console.log('Rutas de imágenes:', response.data.categories.map(category => `http://localhost:5000/uploads/${category.foto}`));
            })
            .catch((error) => {
                console.error('Error al obtener las categorías', error);
            });
    }, []);

    const handleSearch = () => {
        setIsSearching(true);
    };

    const handleSearchComplete = () => {
        setIsSearching(false);
    };

    useEffect(() => {
        console.log('isSpanish changed:', props.isSpanish);
    }, [props.isSpanish]);


    return (
        <>
            <ProductSearch isSpanish={props.isSpanish} onSearch={handleSearch} onSearchComplete={handleSearchComplete} />
            {!isSearching && (
                <div className="relative py-5 animate-fade-down max-w-screen-xl mx-auto">
                    <div className="container relative m-auto px-6 text-gray-500 md:px-12">
                        <div className="grid gap-6 md:mx-auto md:w-8/12 lg:w-full lg:grid-cols-3">
                            {categories.map((category) => (
                                <Link
                                    key={category.id}
                                    to={`/categorias/${category.id}`}
                                    className="group space-y-1 border border-gray-100 dark:border-gray-700 rounded-3xl bg-white dark:bg-gray-800 px-8 py-12 text-center shadow-2xl shadow-gray-600/10 dark:shadow-none transition-transform transform hover:scale-105 duration-500 ease-in-out hover:shadow-2xl hover:border-green-400"
                                >
                                    <img className="mx-auto w-120" src={`http://localhost:5000/uploads/${category.foto}`} alt={category.nombreesp} loading="lazy" />
                                    <h3 className="text-3xl font-semibold text-gray-800 dark:text-white">
                                    {props.isSpanish ? category.nombreesp : category.nombreeng}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
