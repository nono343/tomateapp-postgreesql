import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditPackagingUsers from './PackagingTable';

function Admin(props) {
    const [profileData, setProfileData] = useState(null)

    useEffect(() => {
        getUsers();
    }, []);

    const username = localStorage.getItem('username');

    function getUsers() {
        axios({
            method: "GET",
            url: `http://localhost:5000/profile/${username}`,
            headers: {
                Authorization: 'Bearer ' + props.token
            }
        })
            .then((response) => {
                console.log(response)
                const res = response.data
                res.access_token && props.setToken(res.access_token)
                setProfileData(({
                    profile_username: res.username,
                    isAdmin: res.isAdmin
                }))
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                    console.log(error.response.headers)
                }
            })
    }

    //subir categorias
    const [selectedFileCategory, setSelectedFileCategory] = useState(null);
    const [nombreEspCategory, setNombreEspCategory] = useState('');
    const [nombreEngCategory, setNombreEngCategory] = useState('');
    const [uploadedFileNameCategory, setUploadedFileNameCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/categorias", {
        })
            .then((response) => {
                setCategories(response.data.categories);
                console.log('Respuesta del servidor:', response);
            })
            .catch((error) => {
                console.error('Error al obtener las categorías', error);
            });
    }, []);

    const handleFileChangeCategory = (event) => {
        setSelectedFileCategory(event.target.files[0]);
    };

    const handleNombreEspChangeCategory = (event) => {
        setNombreEspCategory(event.target.value);
    };

    const handleNombreEngChangeCategory = (event) => {
        setNombreEngCategory(event.target.value);
    };

    const handleUploadCategory = async () => {
        if (selectedFileCategory && nombreEspCategory && nombreEngCategory) {
            const formData = new FormData();
            formData.append('file', selectedFileCategory);
            formData.append('nombreesp', nombreEspCategory);
            formData.append('nombreeng', nombreEngCategory);

            try {
                const response = await axios.post('http://localhost:5000/upload_category', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.status === 200) {
                    setUploadedFileNameCategory(response.data.message);
                    axios.get('http://localhost:5000/categorias')
                        .then((response) => {
                            setCategories(response.data.categories);
                        })
                        .catch((error) => {
                            console.error('Error al obtener las categorías después de cargar', error);
                        });
                } else {
                    console.error('Error al cargar la categoría con foto');
                }
            } catch (error) {
                console.error('Error al cargar la categoría con foto', error);
            }
        }
    };


    const handleDeleteCategory = async (id) => {
        try {
            // Realiza la solicitud DELETE al backend para eliminar la categoría
            await axios.delete(`http://localhost:5000/categorias/${id}`);

            // Actualiza la lista de categorías después de eliminar
            const updatedCategories = categories.filter(category => category.id !== id);
            setCategories(updatedCategories);
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    };

    const [mostrarFormularioCategorias, setMostrarFormularioCategorias] = useState(false);
    const toggleFormularioCategorias = () => {
        setMostrarFormularioCategorias(!mostrarFormularioCategorias);
        setMostrarFormularioProductos(false);
        setMostrarFormularioPackaging(false);
    };


    //subir productos

    const [selectedFileProduct, setSelectedFileProduct] = useState(null);
    const [uploadedFileNameProduct, setUploadedFileNameProduct] = useState('');
    const [nombreEspProduct, setNombreEspProduct] = useState('');
    const [nombreEngProduct, setNombreEngProduct] = useState('');
    const [descripcionEsp, setDescripcionEsp] = useState('');
    const [descripcionEng, setDescripcionEng] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products when component mounts
        axios.get('http://localhost:5000/productos')
            .then(response => setProducts(response.data.products))
            .catch(error => console.error('Error al obtener la lista de productos:', error));
    }, []);

    const handleFileChangeProduct = (event) => {
        setSelectedFileProduct(event.target.files[0]);
    };

    const handleNombreEspChangeProduct = (event) => {
        setNombreEspProduct(event.target.value);
    };

    const handleNombreEngChangeProduct = (event) => {
        setNombreEngProduct(event.target.value);
    };

    const handleDescripcionEspChange = (event) => {
        setDescripcionEsp(event.target.value);
    };

    const handleDescripcionEngChange = (event) => {
        setDescripcionEng(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setCategoryId(event.target.value);
    };

    const handleUploadProduct = async () => {
        if (selectedFileProduct && nombreEspProduct && nombreEngProduct && categoryId) {
            const formData = new FormData();
            formData.append('file', selectedFileProduct);
            formData.append('nombreesp', nombreEspProduct);
            formData.append('nombreeng', nombreEngProduct);
            formData.append('descripcionesp', descripcionEsp);
            formData.append('descripcioneng', descripcionEng);
            formData.append('categoria', categoryId);

            try {
                const response = await axios.post('http://localhost:5000/upload_product', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                if (response.status === 200) {
                    setUploadedFileNameProduct(response.data.message);

                    // Fetch the updated list of products right after successful upload
                    axios.get('http://localhost:5000/productos')
                        .then((response) => {
                            setProducts(response.data.products);
                        })
                        .catch((error) => {
                            console.error('Error al obtener los productos después de cargar', error);
                        });
                    const updatedProductsResponse = await axios.get('http://localhost:5000/productos');
                    setAvailableProducts(updatedProductsResponse.data.products || []);
                    setActualizacionProductos(true);
                } else {
                    console.error('Error al cargar el producto con foto');
                }
            } catch (error) {
                console.error('Error al cargar el producto con foto', error);
                console.log(error.response.data);
            }
        }
    };

    const [mostrarFormularioProductos, setMostrarFormularioProductos] = useState(false);

    const toggleFormularioProductos = () => {
        setMostrarFormularioProductos(!mostrarFormularioProductos);

        // Cerrar siempre mostrarFormularioCategorias al abrir mostrarFormularioProductos
        setMostrarFormularioCategorias(false);
        setMostrarFormularioPackaging(false);

    };

    //subir meses 

    const [selectedMonths, setSelectedMonths] = useState([]);
    const [productId, setProductId] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/productos')
            .then(response => setProducts(response.data.products))
            .catch(error => console.error('Error al obtener la lista de productos:', error));
    }, []);

    const handleProductChange = (event) => {
        setProductId(event.target.value);
    };

    const handleCheckboxChange = (month) => {
        // Clona el array de selectedMonths para no mutar el estado directamente
        const updatedMonths = [...selectedMonths];

        // Verifica si el mes ya está en la lista
        const index = updatedMonths.indexOf(month);

        // Si el mes está en la lista, lo quita; de lo contrario, lo agrega
        if (index !== -1) {
            updatedMonths.splice(index, 1);
        } else {
            updatedMonths.push(month);
        }

        // Actualiza el estado con el nuevo array
        setSelectedMonths(updatedMonths);
    };


    const handleAgregarMeses = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/productos/${productId}/meses/agregar`, { meses: selectedMonths });

            console.log('Respuesta del servidor:', response.data);
            console.log('Meses de producción agregados con éxito', response.data);

            // Actualizar la lista de productos después de agregar meses
            axios.get('http://localhost:5000/productos')
                .then(response => setProducts(response.data.products))
                .catch(error => console.error('Error al obtener la lista de productos después de agregar meses:', error));
        } catch (error) {
            // ... (rest of your error handling code)
        }
    };

    //subir packaging

    const [mostrarFormularioPackaging, setMostrarFormularioPackaging] = useState(false);

    const toggleFormularioPackaging = () => {
        setMostrarFormularioPackaging(!mostrarFormularioPackaging);
        setMostrarFormularioCategorias(false);
        setMostrarFormularioProductos(false);

    };


    const [file, setFile] = useState(null);
    const [nombreesp, setNombreEsp] = useState('');
    const [nombreeng, setNombreEng] = useState('');
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

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handlePackagingCheckboxChange = (id, type) => {
        const stringId = String(id); // Convertir el ID a cadena

        if (type === 'user') {
            setUserIds((prevUserIds) =>
                prevUserIds.includes(stringId)
                    ? prevUserIds.filter((userId) => userId !== stringId)
                    : [...prevUserIds, stringId]
            );
        } else if (type === 'product') {
            // Actualizar el estado de productoId
            setProductoId((prevProductId) =>
                prevProductId === stringId ? '' : stringId
            );

            // Actualizar el estado de productIds si es necesario
            setProductIds((prevProductIds) =>
                prevProductIds.includes(stringId)
                    ? prevProductIds.filter((productId) => productId !== stringId)
                    : [...prevProductIds, stringId]
            );
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('nombreesp', nombreesp);
            formData.append('nombreeng', nombreeng);
            formData.append('presentacion', presentacion);
            formData.append('calibre', calibre);
            formData.append('peso_presentacion_g', pesoPresentacion);
            formData.append('peso_neto_kg', pesoNeto);
            formData.append('tamano_caja', tamanoCaja);
            formData.append('pallet_80x120', pallet80x120);
            formData.append('peso_neto_pallet_80x120_kg', pesoNetoPallet80x120);
            formData.append('pallet_100x120', pallet100x120);
            formData.append('peso_neto_pallet_100x120_kg', pesoNetoPallet100x120);

            // Agrega el ID del producto al formData
            formData.append('producto_id', productIds);

            // Agrega cada user_id al formData
            userIds.forEach((userId) => {
                formData.append('user_ids', userId);
            });

            console.log('Datos del formulario:', formData);

            const response = await axios.post('http://localhost:5000/upload_packaging', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                // Update the list of packagingData after successful submission
                setUpdatedPackaging(new Date()); // Change the state to trigger the useEffect
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
    const [selectedPackaging, setSelectedPackaging] = useState(null);
    const [updatedPackaging, setUpdatedPackaging] = useState(null);
    const [actualizacionProductos, setActualizacionProductos] = useState(false);
    const [filtroProducto, setFiltroProducto] = useState('');
    const [filtroUsuario, setFiltroUsuario] = useState('');
    const [editedPackaging, setEditedPackaging] = useState(null);

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

    const handleEditUsers = (packaging) => {
        setSelectedPackaging(packaging);
        setEditedPackaging(packaging);
    };

    // En el useEffect que maneja la actualización de empaques
    useEffect(() => {
        if (editedPackaging) {
            // Actualiza el empaque directamente en el estado
            setPackagingData((prevData) => {
                const newData = [...prevData];
                // Encuentra y actualiza el empaque editado
                // ...

                return newData;
            });

            // Restablece la referencia al empaque editado
            setEditedPackaging(null);
        }
    }, [editedPackaging]);

    const handleDeletePackaging = async (packagingId) => {
        try {
            // Realiza una solicitud al servidor para eliminar el packaging
            const response = await fetch(`http://localhost:5000/productos/packagings/${packagingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Actualiza la lista de packagingData después de la eliminación exitosa
                setUpdatedPackaging(new Date()); // Cambia el estado para activar el useEffect
            } else {
                // Manejo de errores en caso de que la eliminación no sea exitosa
                console.error('Error al eliminar el packaging');
            }
        } catch (error) {
            console.error('Error en la solicitud de eliminación:', error);
        }
    };

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

    // Obtener una lista única de nombres de productos para el filtro de selección
    const nombresProductos = [...new Set(packagingData.map(data => data.nombreesp))];

    // Obtener una lista única de usuarios para el filtro de selección
    const usuariosDisponibles = [...new Set(packagingData.flatMap(data => (data.packagings.flatMap(packaging => packaging.users || []))))];

    // Datos de empaquetado filtrados por el nombre del producto y usuario
    const datosEmpaquetadoFiltrados = packagingData.filter(data =>
        (filtroProducto === '' || data.nombreesp.toLowerCase() === filtroProducto.toLowerCase()) &&
        (filtroUsuario === '' || data.packagings.some(packaging => (packaging.users || []).includes(filtroUsuario)))
    );

    // Resto de tu código...



    return (

        <div className='animate-fade-down'>
            <ul className="menu menu-horizontal flex justify-center rounded-box mb-5">
                <li>
                    <a onClick={toggleFormularioCategorias}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" />
                        </svg>
                        Categorías
                    </a>
                </li>
                <li>
                    <a onClick={toggleFormularioProductos}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        Productos
                    </a>
                </li>
                <li>
                    <a onClick={toggleFormularioPackaging}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                        </svg>

                        Packaging
                    </a>
                </li>
            </ul>

            {mostrarFormularioCategorias && (

                <div className='animate-flip-down max-w-screen-xl mx-auto px-10 gap-6'>
                    <form className="grid md:grid-cols-3 gap-6 mb-5">
                        <div className="form-control w-full max-w-xs">
                            <input type="text" id="name_esp" className="input input-bordered w-full max-w-xs" placeholder="Nombre Categoría Español" onChange={handleNombreEspChangeCategory} required />
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <input type="text" id="name_eng" className="input input-bordered w-full max-w-xs" placeholder="Nombre Categoría Inglés" onChange={handleNombreEngChangeCategory} required />
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChangeCategory} required />
                        </div>

                        <div className='mx-auto md:col-start-2 mt-5 '>
                            <button onClick={handleUploadCategory} type="button" className="btn btn-outline btn-success">Crear Categoría</button>
                        </div>
                    </form>

                    <div className="overflow-x-auto mt-5">
                        <table className="table overflow-x-auto">
                            <thead>
                                <tr>
                                    <th className="sm:w-1/4">Foto</th>
                                    <th className="sm:w-1/4">Nombre</th>
                                    <th className="sm:w-1/4">Nombre Inglés</th>
                                    <th className="sm:w-1/4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id}>
                                        <td className="sm:w-1/4">
                                            {category.foto && (
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12">
                                                            <img
                                                                src={`http://localhost:5000/uploads/${category.foto}`}
                                                                alt={category.nombreesp}
                                                                className="max-w-full h-auto"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="sm:w-1/4">{category.nombreesp}</td>
                                        <td className="sm:w-1/4">{category.nombreeng}</td>
                                        <td className="sm:w-1/4">
                                            <button
                                                onClick={() => handleDeleteCategory(category.id)}
                                                className="btn btn-outline btn-error"
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
            )}

            {mostrarFormularioProductos && (
                <div className='animate-flip-down max-w-screen-xl mx-auto px-10 '>
                    <form className="grid md:grid-cols-3 gap-6">
                        <div className="form-control w-full max-w-xs">
                            <input type="text" id="name_product_esp" className="input input-bordered w-full max-w-xs" placeholder="Nombre Producto Español" onChange={handleNombreEspChangeProduct} required />
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <input type="text" id="name_product_eng" className="input input-bordered w-full max-w-xs" placeholder="Nombre Producto Inglés" onChange={handleNombreEngChangeProduct} required />
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <input type="text" id="description_product_esp" className="input input-bordered w-full max-w-xs" placeholder="Descripción Producto Español" onChange={handleDescripcionEspChange} required />
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <input type="text" id="description_product_eng" className="input input-bordered w-full max-w-xs" placeholder="Descripción Producto Inglés" onChange={handleDescripcionEngChange} required />
                        </div>

                        <div className='form-control w-full max-w-xs"'>
                            <select
                                className="select select-bordered w-full max-w-xs"
                                value={categoryId}
                                onChange={handleCategoryChange}
                            >
                                <option value="" disabled>Seleccionar categoría</option>
                                {categories && categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.nombreesp} - {category.nombreeng}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={handleFileChangeProduct} required />
                        </div>
                        <div className='mx-auto md:col-start-2 mb-5 mt-5'>
                            <button onClick={handleUploadProduct} type="button" className="btn btn-outline btn-success">Crear Producto</button>
                        </div>
                    </form>
                    {/* agregar meses */}
                    <form className="grid grid-cols-1 mb-5">
                        <div>
                            <select
                                className="select select-bordered w-full max-w-xs"
                                value={productId}  // Cambié productId por el valor correcto
                                onChange={handleProductChange}  // Cambié handleProductChange por el valor correcto
                            >
                                <option value="" disabled>Seleccionar producto</option>
                                {products && products.map(product => (
                                    <option key={product.id} value={product.id}>
                                        {product.nombreesp}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <label htmlFor="monthSelector" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white mt-3">
                            Meses de producción:
                        </label>
                        <ul className="grid grid-cols-4 lg:grid-cols-4 gap-4 items-center text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                                <li key={month} className="w-full lg:w-auto border-r last:border-r-0 border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center ps-3">
                                        <input
                                            id={`month-${month}`}
                                            type="checkbox"
                                            value={month}
                                            className="checkbox"
                                            checked={selectedMonths.includes(month)}
                                            onChange={() => handleCheckboxChange(month)}
                                        />
                                        <label
                                            htmlFor={`month-${month}`}
                                            className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                        >{`${month}`}</label>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </form>
                    <div className='flex justify-center mt-5'>
                        <button onClick={handleAgregarMeses} type="button" className="btn btn-outline btn-success">Añadir Meses de Producción</button>
                    </div>
                    <div className="overflow-x-auto mt-5">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th>Foto</th>
                                    <th>Nombre</th>
                                    <th className="hidden md:table-cell">Nombre Inglés</th>
                                    <th className="hidden md:table-cell">Descripción</th>
                                    <th className="hidden md:table-cell">Descripción Inglés</th>
                                    <th>Meses de Producción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>
                                            {product.foto && (
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="mask mask-squircle w-12 h-12">
                                                            <img src={`http://localhost:5000/uploads/${product.foto}`} alt={product.nombreesp} />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {product.nombreesp}
                                        </td>
                                        <td className="hidden md:table-cell">
                                            {product.nombreeng}
                                        </td>
                                        <td className="hidden md:table-cell">
                                            {product.descripcionesp}
                                        </td>
                                        <td className="hidden md:table-cell">
                                            {product.descripcioneng}
                                        </td>
                                        <td>
                                            {product.meses_de_produccion.map(mes => (
                                                <span key={mes.id}>{mes.mes} </span>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}


            {mostrarFormularioPackaging && (
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
                            <input type="file" className="file-input file-input-bordered max-w-xs" onChange={handleFileChange} required />
                        </div>
                        <div className='mx-auto md:col-start-2 mt-5 '>
                            <button onClick={handleSubmit} type="button" className="btn btn-outline btn-success">Crear Packaging</button>
                        </div>
                    </form>


                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Foto</th>
                                    <th>
                                        <select
                                            className="p-1 border border-gray-300 rounded"
                                            value={filtroProducto}
                                            onChange={(e) => setFiltroProducto(e.target.value)}
                                        >
                                            <option value="">Todos los productos</option>
                                            {nombresProductos.map((nombre) => (
                                                <option key={nombre} value={nombre}>
                                                    {nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </th>
                                    <th>Packaging</th>
                                    <th>Unidades</th>
                                    <th>Calibre</th>
                                    <th>Peso Packaging (g)</th>
                                    <th>Peso Neto Confección (kg)</th>
                                    <th>Tamaño Caja</th>
                                    <th>Unidades Pallet 80x120</th>
                                    <th>Peso Neto Pallet 80x120 (kg)</th>
                                    <th>Unidades Pallet 100x120</th>
                                    <th>Peso Neto Pallet 100x120 (kg)</th>
                                    <th>Usuarios</th>
                                    <th>Editar Usuarios</th>
                                    <th>Eliminar Packaging</th>
                                    <th>Marca</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datosEmpaquetadoFiltrados.map((data) => (
                                    data.packagings.map((packaging, index) => {
                                        const modalId = `my_modal_${data.id}_${index}`;
                                        return (
                                            <tr key={`${data.id}_${index}`}>
                                                <td>
                                                    <div className="mask mask-squircle w-12 h-12">
                                                        <img
                                                            src={`http://localhost:5000/uploads/${packaging.foto}`}
                                                            alt={packaging.nombreesp || 'Alt Text Placeholder'}
                                                        />
                                                    </div>
                                                </td>
                                                <td>{data.nombreesp}</td>
                                                <td>{packaging.nombreesp}</td>
                                                <td>{packaging.presentacion}</td>
                                                <td>{packaging.calibre}</td>
                                                <td>{packaging.peso_presentacion_g}</td>
                                                <td>{packaging.peso_neto_kg}</td>
                                                <td>{packaging.tamano_caja}</td>
                                                <td>{packaging.pallet_80x120}</td>
                                                <td>{packaging.peso_neto_pallet_80x120_kg}</td>
                                                <td>{packaging.pallet_100x120}</td>
                                                <td>{packaging.peso_neto_pallet_100x120_kg}</td>
                                                <td>
                                                    {packaging.users?.map((user) => (
                                                        <span key={user} className="mr-2">
                                                            {user}
                                                        </span>
                                                    ))}
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-outline btn-warning"
                                                        onClick={() => {
                                                            document.getElementById(modalId).showModal();
                                                            handleEditUsers(packaging);
                                                        }}
                                                    >
                                                        Editar Usuarios
                                                    </button>
                                                    <dialog id={modalId} className="modal">
                                                        <div className="modal-box">
                                                            {selectedPackaging && (
                                                                <EditPackagingUsers
                                                                    packaging={selectedPackaging}
                                                                    onUpdate={() => setUpdatedPackaging(selectedPackaging)}
                                                                />
                                                            )}
                                                        </div>
                                                        <form method="dialog" className="modal-backdrop" onClick={() => document.getElementById(modalId).close()}>
                                                        </form>
                                                    </dialog>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-outline btn-danger"
                                                        onClick={() => handleDeletePackaging(data.id)}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Admin;
