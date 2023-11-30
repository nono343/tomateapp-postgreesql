import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import logo from '../assets/LaPalma.png';

const DetalleProducto = (props) => {
    const { categoria_id, producto_id } = useParams();
    const [producto, setProducto] = useState(null);
    const [packagings, setPackagings] = useState(null);
    const [users, setUsers] = useState(null);
    const [filters, setFilters] = useState({
        nombreesp: '',
        calibre: '',
        marca: '',
        nombreproducto: ''
    });

    const token = props.token;
    const decodedToken = token ? jwt_decode(token) : null;
    const userId = decodedToken && decodedToken.sub;

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const openImageModal = (imageUrl) => {
        document.getElementById('image_modal').showModal();
        document.getElementById('modal_image').src = imageUrl;
    };

    useEffect(() => {
        const fetchProductoPorId = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/categorias/${categoria_id}/productos/${producto_id}`);
                const data = response.data;

                // Accede a los datos del producto, packagings y usuarios
                const productoData = data.producto;
                const packagingsData = data.producto.packagings;
                const usersData = data.producto.packagings.map(packaging => packaging.users).flat(); // Asume que cada packaging tiene un campo 'users'

                // Verifica las rutas de las imágenes
                console.log('foto_url:', productoData.foto_url);
                console.log('foto2_url:', productoData.foto2_url);

                // Actualiza el estado con los datos
                setProducto(productoData);
                setPackagings(packagingsData);
                setUsers(usersData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchProductoPorId();
    }, [categoria_id, producto_id]);

    if (!producto) {
        return (
            <div>
                <span className="loading loading-ring loading-lg"></span>
            </div>
        );
    }

    const getUniqueValues = (columnName) => {
        const uniqueValues = new Set(packagings.map((packaging) => packaging[columnName]));
        return Array.from(uniqueValues);
    };

    const handleFilterChange = (columnName, value) => {
        setFilters({ ...filters, [columnName]: value });
    };

    const filteredPackagings = packagings ? packagings.filter((packaging) => {
        return (
            (filters.nombreesp === '' || packaging.nombreesp.toLowerCase().includes(filters.nombreesp.toLowerCase())) &&
            (filters.calibre === '' || packaging.calibre.toLowerCase() === filters.calibre.toLowerCase()) &&
            (filters.marca === '' || packaging.marca.toLowerCase().includes(filters.marca.toLowerCase())) &&
            (filters.nombreproducto === '' || packaging.nombreproducto.toLowerCase().includes(filters.nombreproducto.toLowerCase())) &&
            (userId && packaging.users && packaging.users.some(user => user.id === userId))
        );
    }) : [];



    return (
        <div className='max-w-screen-2xl mx-auto'>
            {/* Sección de información del producto */}
            <section className="text-gray-600 body-font">
                <div className="container mx-auto flex px-5 md:flex-row flex-col items-center">
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 animate-fade-right">
                        <div className="carousel w-full">
                            <div id="item1" className="carousel-item w-full">
                                <img
                                    src={producto.foto_url}
                                    alt={producto.nombreesp || ''}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div id="item2" className="carousel-item w-full">
                                <img
                                    src={producto.foto2_url}
                                    alt={producto.nombreesp || ''}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex justify-center w-full py-2 gap-2">
                            {producto.foto_url && (
                                <a href="#item1" className="btn btn-xs">1</a>
                            )}
                            {producto.foto2_url && (
                                <a href="#item2" className="btn btn-xs">2</a>
                            )}
                        </div>
                    </div>
                    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center animate-fade-left">
                        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
                            {props.isSpanish ? producto.nombreesp : producto.nombreeng}
                        </h1>
                        {(props.isSpanish ? producto.descripcionesp : producto.descripcioneng).split(/\n/).map((paragraph, index) => (
                            <p key={index} className="mb-2 leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </section>

            {/* Calendario de producción */}
            <section>
                <div className="border-t mx-auto border-gray-200 bg-white px-10 py-10 sm:px-6 animate-fade-up">
                    <h1 className="sm:text-3xl text-center text-2xl mb-5">
                        {props.isSpanish ? "Calendario de producción" : "Production Calendar"}
                    </h1>
                    <div className="flex justify-center max-w-screen-md mx-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((mes, index) => (
                            <a
                                key={index}
                                className={`relative inline-flex w-1/12 sm:w-1/12 mr-1 h-16 ${producto.meses_produccion.map((m) => m.toString()).includes(mes.toString())
                                    ? 'bg-red-600'
                                    : 'bg-gray-200'
                                    } mb-2 flex items-center justify-center text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 transform hover:scale-110 transition-transform`}
                            >
                                {mes}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            <div className="border-t mx-auto border-gray-200 bg-white py-5 sm:px-6 animate-fade-up"></div>

            {/* Tabla de packagings */}
            <section>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>{props.isSpanish ? "Foto Unidad" : "Unit Photo"}</th>
                                <th>{props.isSpanish ? "Foto Confección" : "Packaging Photo"}</th>
                                <th>
                                    <select
                                        className="border border-gray-300 px-2 py-1"
                                        value={filters.nombreesp}
                                        onChange={(e) => handleFilterChange('nombreesp', e.target.value)}
                                    >
                                        <option value="">{props.isSpanish ? "Seleccionar Confeccón" : "Select Packaging"}</option>
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
                                        <option value="">{props.isSpanish ? "Seleccionar Marca" : "Select Brand"}</option>
                                        {getUniqueValues('marca').map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th>
                                    <select
                                        value={filters.calibre}
                                        onChange={(e) => handleFilterChange('calibre', e.target.value)}
                                        className="border border-gray-300 px-2 py-1"
                                    >
                                        <option value="">{props.isSpanish ? "Seleccionar Calibre" : "Select Caliber"}</option>
                                        {getUniqueValues('calibre').map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </th>
                                <th>{props.isSpanish ? "Unidades" : "Units"}</th>
                                <th>{props.isSpanish ? "Peso Packaging (g)" : "Packaging Weight (g)"}</th>
                                <th>{props.isSpanish ? "Peso Neto Confección (kg)" : "Net Weight Packaging (kg)"}</th>
                                <th>{props.isSpanish ? "Tamaño Caja" : "Box Size"}</th>
                                <th>{props.isSpanish ? "Unidades Pallet 80x120" : "Units Pallet 80x120"}</th>
                                <th>{props.isSpanish ? "Peso Neto Pallet 80x120 (kg)" : "Net Weight Pallet 80x120 (kg)"}</th>
                                <th>{props.isSpanish ? "Unidades Pallet 100x120" : "Units Pallet 100x120"}</th>
                                <th>{props.isSpanish ? "Peso Neto Pallet 100x120 (kg)" : "Net Weight Pallet 100x120 (kg)"}</th>
                                <th>{props.isSpanish ? "Unidades Pallet Avión" : "Units Pallet Airplane"}</th>
                                <th>{props.isSpanish ? "Peso Neto Pallet Avión (kg)" : "Net Weight Pallet Airplane (kg)"}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPackagings.length > 0 ? (
                                filteredPackagings.map((packaging, index) => (
                                    <tr className="bg-white" key={index}>
                                        <td className="py-2 px-4 border-b">
                                            <img
                                                src={packaging.foto_url}
                                                alt="Packaging"
                                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full cursor-pointer"
                                                onClick={() => openImageModal(packaging.foto_url)}
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.foto2_url ? (
                                                <img
                                                    src={packaging.foto2_url}
                                                    alt="Packaging"
                                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full cursor-pointer"
                                                    onClick={() => openImageModal(packaging.foto2_url)}
                                                />
                                            ) : (
                                                <img
                                                    src={logo}
                                                    alt="Otra Imagen"
                                                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full cursor-pointer"
                                                />
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.nombreesp}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.marca}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.calibre}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.presentacion}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.peso_presentacion_g}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.peso_neto_kg}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.tamano_caja}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.pallet_80x120}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.peso_neto_pallet_80x120_kg}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.pallet_100x120}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.peso_neto_pallet_100x120_kg}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.pallet_avion}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {packaging.peso_neto_pallet_avion}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center py-4">No hay datos disponibles.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal */}
            <dialog id="image_modal" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => document.getElementById('image_modal').close()}>✕</button>
                    </form>
                    <img id="modal_image" alt="Modal" className="w-full h-full object-cover" />
                </div>
            </dialog>
        </div>
    );
};

export default DetalleProducto;
