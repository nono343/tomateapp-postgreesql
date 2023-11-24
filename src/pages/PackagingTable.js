import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PackagingTable = () => {
    const [packagings, setPackagings] = useState([]);
    const [filters, setFilters] = useState({
        nombreesp: '',
        calibre: '',
        marca: '',
        users: '',
        nombreproducto: ''
        // Agrega más filtros según sea necesario para otras columnas
    });
    const [newPackaging, setNewPackaging] = useState({
        nombreproducto: '',
        nombreesp: '',
        marca: '',
        calibre: '',
        presentacion: '',
        peso_presentacion_g: '',
        peso_neto_kg: '',
        tamano_caja: '',
        pallet_80x120: '',
        peso_neto_pallet_80x120_kg: '',
        pallet_100x120: '',
        peso_neto_pallet_100x120_kg: '',
        // Agrega más propiedades según sea necesario
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/packagings');
            setPackagings(response.data.packagings);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getUniqueValues = (columnName) => {
        const uniqueValues = new Set(packagings.map((packaging) => packaging[columnName]));
        return Array.from(uniqueValues);
    };

    const handleFilterChange = (columnName, value) => {
        setFilters({ ...filters, [columnName]: value });
    };

    const handleNewPackagingChange = (property, value) => {
        setNewPackaging({ ...newPackaging, [property]: value });
    };

    const handleCreatePackaging = async () => {
        try {
            // Realiza la solicitud POST para crear el nuevo packaging
            await axios.post('http://localhost:5000/packagings', newPackaging);

            // Refresca la lista de packagings después de la creación
            fetchData();

            // Reinicia el formulario de creación
            setNewPackaging({
                nombreproducto: '',
                nombreesp: '',
                marca: '',
                calibre: '',
                presentacion: '',
                peso_presentacion_g: '',
                peso_neto_kg: '',
                tamano_caja: '',
                pallet_80x120: '',
                peso_neto_pallet_80x120_kg: '',
                pallet_100x120: '',
                peso_neto_pallet_100x120_kg: '',
                // Reinicia más propiedades según sea necesario
            });
        } catch (error) {
            console.error('Error creating packaging:', error);
        }
    };

    const filteredPackagings = packagings.filter((packaging) => {
        return (
            (filters.nombreesp === '' || packaging.nombreesp.toLowerCase().includes(filters.nombreesp.toLowerCase())) &&
            (filters.calibre === '' || packaging.calibre.toLowerCase() === filters.calibre.toLowerCase()) &&
            (filters.nombreproducto === '' || packaging.nombreproducto.toLowerCase().includes(filters.nombreproducto.toLowerCase()))
        );
    });


    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold mb-4">Packagings</h1>

            {/* Formulario de creación de packaging */}


            {/* Formulario de creación de packaging */}
            <div className="mb-4">
                <h2 className="text-lg font-bold mb-2">Crear Nuevo Packaging</h2>
                {/* Agrega campos de entrada para cada propiedad del nuevo packaging */}
                <div>
                    <label className="mr-2">Nombre Producto:</label>
                    <input
                        type="text"
                        value={newPackaging.nombreproducto}
                        onChange={(e) => handleNewPackagingChange('nombreproducto', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">Nombre Español:</label>
                    <input
                        type="text"
                        value={newPackaging.nombreesp}
                        onChange={(e) => handleNewPackagingChange('nombreesp', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">nombreproducto:</label>
                    <input
                        type="text"
                        value={newPackaging.nombreproducto}
                        onChange={(e) => handleNewPackagingChange('nombreproducto', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">Calibre:</label>
                    <input
                        type="text"
                        value={newPackaging.calibre}
                        onChange={(e) => handleNewPackagingChange('calibre', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">Presentación:</label>
                    <input
                        type="text"
                        value={newPackaging.presentacion}
                        onChange={(e) => handleNewPackagingChange('presentacion', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">Peso Presentación (g):</label>
                    <input
                        type="text"
                        value={newPackaging.peso_presentacion_g}
                        onChange={(e) => handleNewPackagingChange('peso_presentacion_g', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">Peso Neto Confección (kg):</label>
                    <input
                        type="text"
                        value={newPackaging.peso_neto_kg}
                        onChange={(e) => handleNewPackagingChange('peso_neto_kg', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">Tamaño Caja:</label>
                    <input
                        type="text"
                        value={newPackaging.tamano_caja}
                        onChange={(e) => handleNewPackagingChange('tamano_caja', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">Unidades Pallet 80x120:</label>
                    <input
                        type="text"
                        value={newPackaging.pallet_80x120}
                        onChange={(e) => handleNewPackagingChange('pallet_80x120', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">Peso Neto Pallet 80x120 (kg):</label>
                    <input
                        type="text"
                        value={newPackaging.peso_neto_pallet_80x120_kg}
                        onChange={(e) => handleNewPackagingChange('peso_neto_pallet_80x120_kg', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">Unidades Pallet 100x120:</label>
                    <input
                        type="text"
                        value={newPackaging.pallet_100x120}
                        onChange={(e) => handleNewPackagingChange('pallet_100x120', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">Peso Neto Pallet 100x120 (kg):</label>
                    <input
                        type="text"
                        value={newPackaging.peso_neto_pallet_100x120_kg}
                        onChange={(e) => handleNewPackagingChange('peso_neto_pallet_100x120_kg', e.target.value)}
                    />
                </div>
                <div>
                    <label className="mr-2">Clientes:</label>
                    <input
                        type="text"
                        value={newPackaging.users}
                        onChange={(e) => handleNewPackagingChange('users', e.target.value)}
                    />
                </div>
                {/* Agrega más campos de entrada según sea necesario para otras propiedades */}
                <button onClick={handleCreatePackaging}>Crear Packaging</button>
            </div>



            {/* Filtros existentes */}

            <div className="mb-4">
                <label className="mr-2">Nombre Español:</label>
                <select
                    className="border border-gray-300 px-2 py-1"
                    value={filters.nombreesp}
                    onChange={(e) => handleFilterChange('nombreesp', e.target.value)}
                >
                    <option value="">Seleccionar</option>
                    {getUniqueValues('nombreesp').map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="mr-2">Nombre Inglés:</label>
                <select
                    value={filters.calibre}
                    onChange={(e) => handleFilterChange('calibre', e.target.value)}
                    className="border border-gray-300 px-2 py-1"
                >
                    <option value="">Seleccionar Calibre</option>
                    {getUniqueValues('calibre').map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="mr-2">nombreproducto:</label>
                <select
                    value={filters.nombreproducto}
                    onChange={(e) => handleFilterChange('nombreproducto', e.target.value)}
                    className="border border-gray-300 px-2 py-1"
                >
                    <option value="">Seleccionar</option>
                    {getUniqueValues('nombreproducto').map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            {/* Agrega más campos de filtro según sea necesario para otras columnas */}
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Packaging</th>
                        <th>Marca</th>
                        <th>Calibre</th>
                        <th>Unidades</th>
                        <th>Peso Packaging (g)</th>
                        <th>Peso Neto Confección (kg)</th>
                        <th>Tamaño Caja</th>
                        <th>Unidades Pallet 80x120</th>
                        <th>Peso Neto Pallet 80x120 (kg)</th>
                        <th>Unidades Pallet 100x120</th>
                        <th>Peso Neto Pallet 100x120 (kg)</th>
                        <th>Clientes</th>
                        {/* Agrega más encabezados de columna según sea necesario para otras columnas */}
                    </tr>
                </thead>
                <tbody>
                    {filteredPackagings.map((packaging) => (
                        <tr key={packaging.id}>
                            <td className="py-2 px-4 border-b">{packaging.nombreproducto}</td>
                            <td className="py-2 px-4 border-b">{packaging.nombreesp}</td>
                            <td className="py-2 px-4 border-b">{packaging.marca}</td>
                            <td className="py-2 px-4 border-b">{packaging.calibre}</td>
                            <td className="py-2 px-4 border-b">{packaging.presentacion}</td>
                            <td className="py-2 px-4 border-b">{packaging.peso_presentacion_g}</td>
                            <td className="py-2 px-4 border-b">{packaging.peso_neto_kg}</td>
                            <td className="py-2 px-4 border-b">{packaging.tamano_caja}</td>
                            <td className="py-2 px-4 border-b">{packaging.pallet_80x120}</td>
                            <td className="py-2 px-4 border-b">{packaging.peso_neto_pallet_80x120_kg}</td>
                            <td className="py-2 px-4 border-b">{packaging.pallet_100x120}</td>
                            <td className="py-2 px-4 border-b">{packaging.peso_neto_pallet_100x120_kg}</td>
                            <td className="py-2 px-4 border-b">
                                {packaging.users.map((user) => (
                                    <div key={user.id}>{user.username}</div>
                                ))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PackagingTable;
