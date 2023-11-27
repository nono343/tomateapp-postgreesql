import React, { useState, useEffect } from "react";
import axios from "axios";


function PruebaPackaging(props) {
    const [selectedFilePackaging, setSelectedFilePackaging] = useState(null);
    const [selectedFilePackaging2, setSelectedFilePackaging2] = useState(null); // Added for the second file
    const [nombreesp, setNombreEsp] = useState('');
    const [nombreeng, setNombreEng] = useState('');
    const [marca, setMarca] = useState('');
    const [presentacion, setPresentacion] = useState('');
    const [calibre, setCalibre] = useState('');
    const [pesoPresentacion, setPesoPresentacion] = useState('');
    const [pesoNeto, setPesoNeto] = useState('');
    const [tamanoCaja, setTamanoCaja] = useState('');
    const [pallet80x120, setPallet80x120] = useState('');
    const [pesoNetoPallet80x120, setPesoNetoPallet80x120] = useState('');
    const [pallet100x120, setPallet100x120] = useState('');
    const [pesoNetoPallet100x120, setPesoNetoPallet100x120] = useState('');
    const [productoId, setProductoId] = useState('');
    const [userIds, setUserIds] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [productIds, setProductIds] = useState(""); // Suponiendo que productIds es una cadena
    const [availableProducts, setAvailableProducts] = useState([]);

    const nombresMappings = {
        'BOLSA SNACK EN FLOWPACK': 'FLOWPACK SNACK BAG',
        'TARRINA DE CARTÓN CON TAPA': 'CARDBOARD WITH LID',
        'TARRINA DE CARTÓN CON FLOWPACK': 'CARDBOARD WITH FLOWPACK',
        'BOLSA EN FLOWPACK': 'FLOWPACK BAG',
        'TARRINA TERMOSELLADA': 'TOP SEAL PUNNET',
        'TARRINA CON FLOWPACK': 'PUNNET WITH FLOWPACK',
        'TARRINA CON BISAGRA TRIANGULAR': 'TRIANGULAR CLAMSHELL',
        'VASO CON TAPA': 'SHAKER WITH LID',
        'VASO APLICABLE CON VISAGRA': 'STOCKABLE CLAMSHELL SHAKER',
        'TARRINA TERMOSELLADA CON ENFAJADO': 'TOP SEAL PUNNET WITH BAND',
        'TARRINA PASTA CELULOSA TERMOSELLADA': 'CELLULOSE PULP TOP SEAL PUNNET',
        'TARRINA CON TAPA': 'PUNNET WITH LID',
        'CUBO CON TAPA': 'BUCKET WITH LID',
        'GRANEL': 'LOOSE',
    };

    const marcasMapping = {
        'PARCELA': 'Nombre de Marca 1',
        'LA PALMA': 'Nombre de Marca 2',
    };

    const handleMarcaChange = (e) => {
        const selectedMarca = e.target.value;
        setMarca(selectedMarca);
    };


    const handleNombreEspChange = (e) => {
        const selectedNombreEsp = e.target.value;
        setNombreEsp(selectedNombreEsp);

        const selectedNombreEng = nombresMappings[selectedNombreEsp] || '';
        setNombreEng(selectedNombreEng);
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersResponse = await axios.get('http://localhost:5000/users');
                setAvailableUsers(usersResponse.data.users || []);

                const productsResponse = await axios.get('http://localhost:5000/productos'); // Cambiado de 'products' a 'productos'
                setAvailableProducts(productsResponse.data.products || []);
            } catch (error) {
                console.error('Error al obtener la lista de usuarios o productos:', error.response.data.error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        console.log('Usuarios actualizados:', availableUsers);
    }, [availableUsers]);

    const handleFileChange1 = (event) => {
        setSelectedFilePackaging(event.target.files[0]);
    };

    const handleFileChange2 = (event) => {
        setSelectedFilePackaging2(event.target.files[0]);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('file', selectedFilePackaging);
            formData.append('file2', selectedFilePackaging2);
            formData.append('nombreesp', nombreesp);
            formData.append('nombreeng', nombreeng);
            formData.append('marca', marca);
            formData.append('presentacion', presentacion);
            formData.append('calibre', calibre);
            formData.append('peso_presentacion_g', pesoPresentacion);
            formData.append('peso_neto_kg', pesoNeto);
            formData.append('tamano_caja', tamanoCaja);
            formData.append('pallet_80x120', pallet80x120);
            formData.append('peso_neto_pallet_80x120_kg', pesoNetoPallet80x120);
            formData.append('pallet_100x120', pallet100x120);
            formData.append('peso_neto_pallet_100x120_kg', pesoNetoPallet100x120);
            formData.append('producto_id', productIds);

            userIds.forEach((userId) => {
                formData.append('user_ids', userId);
            });
            const response = await axios.post('http://localhost:5000/upload_packaging', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // Actualiza el estado de packagings después de la carga exitosa
                fetchData();
                // Cambia el estado para activar el useEffect y recargar los datos
                setUpdatedPackaging(new Date());
                // Cambia el estado para activar la actualización de filteredPackagings
                setActualizacionProductos(true);
            }

            console.log(response.data.message);
            // Realizar acciones adicionales después de la carga exitosa
        } catch (error) {
            console.error('Error en la carga del embalaje:', error.response.data.error);
            // Manejar el error según sea necesario
        }
    };


    const handlePesoNetoCalculo = () => {
        // Verifica que ambos campos tengan valores numéricos antes de calcular
        if (!isNaN(presentacion) && !isNaN(pesoPresentacion)) {
            const pesoNetoCalculado = (presentacion * pesoPresentacion) / 1000;
            setPesoNeto(pesoNetoCalculado.toFixed(2)); // Ajusta la cantidad de decimales según tus necesidades
        }
    };

    const handlePesoNetoPalletCalculo = (unidades, setPesoNetoPallet) => {
        // Verifica que ambos campos tengan valores numéricos antes de calcular
        if (!isNaN(pesoNeto) && !isNaN(unidades)) {
            const pesoNetoPalletCalculado = pesoNeto * unidades;
            setPesoNetoPallet(pesoNetoPalletCalculado.toFixed(2)); // Ajusta la cantidad de decimales según tus necesidades
        }
    };


    const [packagingData, setPackagingData] = useState([]);
    const [updatedPackaging, setUpdatedPackaging] = useState(null);
    const [actualizacionProductos, setActualizacionProductos] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/productos');
                const data = response.data.products;
                setPackagingData(data);
                console.log('Packagings:', data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [updatedPackaging]);


    // UseEffect para recargar datos cuando actualizacionProductos cambia
    useEffect(() => {
        console.log('Efecto de actualización de productos ejecutado');
        console.log('Productos después de la actualización:', packagingData);
        if (actualizacionProductos) {
            // Fetch the updated list of products right after successful upload
            axios.get('http://localhost:5000/productos')
                .then((response) => {
                    setPackagingData(response.data.products);
                })
                .catch((error) => {
                    console.error('Error al obtener los productos después de cargar', error);
                });

            // Reiniciar el estado de actualización después de cargar los productos
            setActualizacionProductos(false);
        }
    }, [actualizacionProductos]);


    const handleDeletePackaging = async (packagingId) => {
        try {
            const response = await axios.delete(`http://localhost:5000/packagings/${packagingId}`);
            if (response.status === 200) {
                // Recargar los datos después de una eliminación exitosa
                fetchData();
            }
        } catch (error) {
            console.error('Error al eliminar el packaging:', error.response.data.error);
            // Manejar el error según sea necesario
        }
    };


    const handlePackagingCheckboxChange = (id, type) => {
        const stringId = String(id);

        if (type === 'user') {
            setUserIds((prevUserIds) =>
                prevUserIds.includes(stringId)
                    ? prevUserIds.filter((userId) => userId !== stringId)
                    : [...prevUserIds, stringId]
            );
        } else if (type === 'product') {
            setProductoId((prevProductId) =>
                prevProductId === stringId ? '' : stringId
            );

            setProductIds((prevProductIds) =>
                prevProductIds.includes(stringId)
                    ? prevProductIds.filter((productId) => productId !== stringId)
                    : [...prevProductIds, stringId]
            );
        }
    };

    const [packagings, setPackagings] = useState([]);
    const [filters, setFilters] = useState({
        nombreesp: '',
        calibre: '',
        marca: '',
        nombreproducto: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/packagings');
            setPackagings(response.data.packagings);
            console.log(response.data.packagings)
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

    const filteredPackagings = packagings.filter((packaging) => {
        return (
            (filters.nombreesp === '' || packaging.nombreesp.toLowerCase().includes(filters.nombreesp.toLowerCase())) &&
            (filters.calibre === '' || packaging.calibre.toLowerCase() === filters.calibre.toLowerCase()) &&
            (filters.marca === '' || packaging.marca.toLowerCase().includes(filters.marca.toLowerCase())) &&
            (filters.nombreproducto === '' || packaging.nombreproducto.toLowerCase().includes(filters.nombreproducto.toLowerCase()))

        );
    });




    const [editingPackaging, setEditingPackaging] = useState(null);
    const [editedUsers, setEditedUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);  // Nuevo estado para todos los usuarios


    useEffect(() => {
        // Realizar la solicitud GET para obtener los packagings
        axios.get('http://localhost:5000/packagings')
            .then(response => {
                setPackagings(response.data.packagings);
            })
            .catch(error => {
                console.error('Error al obtener los packagings:', error);
            });
        axios.get('http://localhost:5000/users')
            .then(response => {
                setAllUsers(response.data.users);
            })
            .catch(error => {
                console.error('Error al obtener todos los usuarios:', error);
            });
    }, []); // Se ejecuta solo una vez al montar el componente


    const handleEditUsers = (packaging) => {
        setEditingPackaging(packaging);
        setEditedUsers([...packaging.users]);
    };

    const handleCancelEdit = () => {
        setEditingPackaging(null);
        setEditedUsers([]);
    };

    const handleSaveUsers = async () => {
        try {
            // Realizar la solicitud PUT para actualizar los usuarios asociados al packaging
            await axios.put(`http://localhost:5000/packagings/${editingPackaging.id}/edit_users`, {
                users: editedUsers.map(user => user.id),
            });

            console.log('Usuarios del packaging actualizados exitosamente');

            // Actualizar la lista de packagings después de la edición
            axios.get('http://localhost:5000/packagings')
                .then(response => {
                    setPackagings(response.data.packagings);
                });

            // Restablecer el estado de edición
            setEditingPackaging(null);
            setEditedUsers([]);
        } catch (error) {
            console.error('Error al guardar los usuarios:', error);
        }
    };

    const handleUserCheckboxChange = (user) => {
        setEditedUsers(prevUsers => {
            if (prevUsers.some(u => u.id === user.id)) {
                // Usuario ya está seleccionado, quitarlo
                return prevUsers.filter(u => u.id !== user.id);
            } else {
                // Usuario no está seleccionado, agregarlo
                return [...prevUsers, user];
            }
        });
    };



    return (

        <div className='animate-flip-down max-w-screen-xl mx-auto px-10'>
            <form className="grid md:grid-cols-3 gap-6 mb-5">
                <div className="form-control w-full max-w-xs">
                    <select
                        id="name_packaging_esp"
                        className="input input-bordered w-full max-w-xs"
                        value={nombreesp}
                        onChange={handleNombreEspChange}
                        required
                    >
                        <option value="" disabled>

                            Seleccione un nombre en español
                        </option>
                        {Object.keys(nombresMappings).map((nombreEspOption) => (
                            <option key={nombreEspOption} value={nombreEspOption}>
                                {nombreEspOption}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-control w-full max-w-xs">
                    <input
                        type="text"
                        id="name_packaging_eng"
                        className="input input-bordered w-full max-w-xs"
                        placeholder="Nombre Packaging Ingles"
                        value={nombreeng}
                        readOnly
                        required
                        disabled
                    />
                </div>
                <div className="form-control w-full max-w-xs">
                    <select
                        id="name_packaging_esp"
                        className="input input-bordered w-full max-w-xs"
                        value={marca}
                        onChange={handleMarcaChange}
                        required
                    >
                        <option value="" disabled>

                            Seleccione un nombre en español
                        </option>
                        {Object.keys(marcasMapping).map((marcasOption) => (
                            <option key={marcasOption} value={marcasOption}>
                                {marcasOption}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-control w-full max-w-xs">
                    <input
                        type="text"
                        id="presentacion"
                        className="input input-bordered w-full max-w-xs"
                        placeholder="Unidades"
                        onChange={(e) => setPresentacion(e.target.value)}
                        required
                    />
                </div>
                <div className="form-control w-full max-w-xs">
                    <input type="text" id="calibre" className="input input-bordered w-full max-w-xs" placeholder="Calibre" onChange={(e) => setCalibre(e.target.value)} required />
                </div>
                <div className="form-control w-full max-w-xs">
                    <input
                        type="text"
                        id="pesopresentacion"
                        className="input input-bordered w-full max-w-xs"
                        placeholder="Peso Neto Confección (g)"
                        onChange={(e) => setPesoPresentacion(e.target.value)}
                        onBlur={handlePesoNetoCalculo}
                        required

                    />
                </div>
                <div className="form-control w-full max-w-xs">
                    <input
                        type="text"
                        id="pesoneto"
                        className="input input-bordered w-full max-w-xs"
                        placeholder="Peso Neto Confección (kg)"
                        value={pesoNeto}
                        readOnly
                        disabled
                    />
                </div>
                <div className="form-control w-full max-w-xs">
                    <input type="text" id="tamanocaja" className="input input-bordered w-full max-w-xs" placeholder="Tamaño Caja (40x30x7)" onChange={(e) => setTamanoCaja(e.target.value)} required />
                </div>
                <div className="form-control w-full max-w-xs">
                    <input
                        type="text"
                        id="pallet80x120"
                        className="input input-bordered w-full max-w-xs"
                        placeholder="Unidades Por Pallet 80x120"
                        onChange={(e) => setPallet80x120(e.target.value)}
                        onBlur={() => handlePesoNetoPalletCalculo(pallet80x120, setPesoNetoPallet80x120)}
                        required
                    />
                </div>
                <div className="form-control w-full max-w-xs">
                    <input
                        type="text"
                        id="pesoNetoPallet80x120"
                        className="input input-bordered w-full max-w-xs"
                        placeholder="Peso Neto Pallet 80x120 (kg)"
                        value={pesoNetoPallet80x120}
                        readOnly
                        disabled
                    />
                </div>

                <div className="form-control w-full max-w-xs">
                    <input
                        type="text"
                        id="pallet100x120"
                        className="input input-bordered w-full max-w-xs"
                        placeholder="Unidades Por Pallet 100x120"
                        onChange={(e) => setPallet100x120(e.target.value)}
                        onBlur={() => handlePesoNetoPalletCalculo(pallet100x120, setPesoNetoPallet100x120)}
                        required
                    />
                </div>
                <div className="form-control w-full max-w-xs">
                    <input
                        type="text"
                        id="pesoNetoPallet100x120"
                        className="input input-bordered w-full max-w-xs"
                        placeholder="Peso Neto Pallet 100x120 (kg)"
                        value={pesoNetoPallet100x120}
                        readOnly
                        disabled
                    />
                </div>

                <div className="form-control w-full max-w-xs">
                    {availableProducts.length > 0 && (
                        <select
                            className="select select-bordered w-full max-w-xs"
                            value={productIds}
                            onChange={(e) => {
                                const selectedProductId = e.target.value;
                                setProductIds(selectedProductId);
                            }}>
                            <option value="" disabled>Selecciona un producto</option>
                            {availableProducts.map((product) => (
                                <option key={product.id} value={String(product.id)}>
                                    {product.nombreesp}
                                </option>
                            ))}
                        </select>
                    )}
                </div>


                {/* Mostrar nombres de usuarios disponibles */}
                {availableUsers.length > 0 && (
                    <div className="form-control">
                        <p>Usuarios disponibles:</p>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {availableUsers.map((user) => (
                                <li key={user.id} style={{ display: 'inline-block', marginRight: '10px' }}>
                                    <label className="cursor-pointer label">
                                        <input
                                            type="checkbox"
                                            value={user.id}
                                            onChange={() => handlePackagingCheckboxChange(user.id, 'user')}
                                            checked={userIds.includes(String(user.id))} // Convertir a cadena para la comparación
                                            className="checkbox checkbox-success"
                                        />
                                        <span className="label-text ml-2">{user.username}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="form-control">
                    <input type="file" className="file-input file-input-bordered max-w-xs" onChange={handleFileChange1} required />
                </div>
                <div className="form-control mt-3">
                    <input type="file" className="file-input file-input-bordered max-w-xs" onChange={handleFileChange2} required />
                </div>
                <div className='mx-auto md:col-start-2 mt-5 '>
                    <button onClick={handleSubmit} type="button" className="btn btn-outline btn-success">Crear Packaging</button>
                </div>
            </form>


            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>
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
                                </select></th>
                            <th>
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
                            </th>
                            <th>
                                <select
                                    value={filters.marca}
                                    onChange={(e) => handleFilterChange('marca', e.target.value)}
                                    className="border border-gray-300 px-2 py-1"
                                >
                                    <option value="">Seleccionar</option>
                                    {getUniqueValues('marca').map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </th>
                            <th>                <select
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
                            </th>
                            <th>Unidades</th>
                            <th>Peso Packaging (g)</th>
                            <th>Peso Neto Confección (kg)</th>
                            <th>Tamaño Caja</th>
                            <th>Unidades Pallet 80x120</th>
                            <th>Peso Neto Pallet 80x120 (kg)</th>
                            <th>Unidades Pallet 100x120</th>
                            <th>Peso Neto Pallet 100x120 (kg)</th>
                            <th>Clientes</th>
                            <th>Editar Usuarios</th>
                            <th>Eliminar Packaging</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
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
                                    {editingPackaging && editingPackaging.id === packaging.id ? (
                                        // Mostrar checkboxes para todos los usuarios disponibles en modo de edición
                                        allUsers.map(user => (
                                            <div key={user.id}>
                                                <input
                                                    type="checkbox"
                                                    checked={editedUsers.some(u => u.id === user.id)}
                                                    onChange={() => handleUserCheckboxChange(user)}
                                                />
                                                {user.username}
                                            </div>
                                        ))
                                    ) : (
                                        // Mostrar solo los usuarios asociados en modo de visualización normal
                                        packaging.users.map(user => (
                                            <div key={user.id}>{user.username}</div>
                                        ))
                                    )}
                                </td>

                                <td className="py-2 px-4 border-b">
                                    {editingPackaging && editingPackaging.id === packaging.id ? (
                                        // Mostrar botones de guardado y cancelación durante la edición
                                        <>
                                            <button onClick={handleSaveUsers}>Guardar</button>
                                            <button onClick={handleCancelEdit}>Cancelar</button>
                                        </>
                                    ) : (
                                        // Mostrar botón de editar en modo de visualización normal
                                        <button onClick={() => handleEditUsers(packaging)}>Editar Usuarios</button>
                                    )}
                                </td>

                                <td className="py-2 px-4 border-b">
                                    <button
                                        onClick={() => handleDeletePackaging(packaging.id)}
                                        className="btn btn-outline btn-danger"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PruebaPackaging