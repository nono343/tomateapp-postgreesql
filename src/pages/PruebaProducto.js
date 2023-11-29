import React, { useState, useEffect } from "react";
import axios from "axios";

function PruebaProducto(props) {
    const [selectedFileProduct, setSelectedFileProduct] = useState(null);
    const [selectedFileProduct2, setSelectedFileProduct2] = useState(null); // Added for the second file
    const [uploadedFileNameProduct, setUploadedFileNameProduct] = useState('');
    const [nombreEspProduct, setNombreEspProduct] = useState('');
    const [nombreEngProduct, setNombreEngProduct] = useState('');
    const [descripcionEsp, setDescripcionEsp] = useState('');
    const [descripcionEng, setDescripcionEng] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);


    const [categories, setCategories] = useState([]);
    // Función para obtener la lista de categorías desde el servidor
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        // Realiza una solicitud GET para obtener las categorías
        axios.get("http://localhost:5000/categorias")
            .then((response) => setCategories(response.data.categories))
            .catch((error) => console.error('Error al obtener las categorías', error));
    };

    useEffect(() => {
        // Fetch products when the component mounts
        axios.get('http://localhost:5000/productos')
            .then(response => setProducts(response.data.products))
            .catch(error => console.error('Error al obtener la lista de productos:', error));
    }, []);


    const handleFileChangeProduct = (event) => {
        setSelectedFileProduct(event.target.files[0]);
    };

    const handleFileChangeProduct2 = (event) => {
        setSelectedFileProduct2(event.target.files[0]);
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
            formData.append('file2', selectedFileProduct2); // Append the second file
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
                    // Fetch the updated list of products right after a successful upload
                    const updatedProductsResponse = await axios.get('http://localhost:5000/productos');
                    setProducts(updatedProductsResponse.data.products || []);
                } else {
                    console.error('Error al cargar el producto con foto');
                }
            } catch (error) {
                console.error('Error al cargar el producto con foto', error);
            }
        }
    };

    const handleDelete = async (productId) => {
        try {
            // Lógica para eliminar el producto con el ID proporcionado
            const response = await axios.delete(`http://localhost:5000/productos/${productId}`);
            if (response.status === 200) {
                // Actualizar la lista de productos después de la eliminación
                const updatedProductsResponse = await axios.get('http://localhost:5000/productos');
                setProducts(updatedProductsResponse.data.products || []);
            } else {
                console.error('Error al eliminar el producto');
            }
        } catch (error) {
            console.error('Error al eliminar el producto', error);
        }
    };

    console.log(products)
    // Función para iniciar la edición de una categoría
    const handleEditProducts = (product) => {
        setEditingProduct(product);
        setNombreEspProduct(product.nombreesp);
        setNombreEngProduct(product.nombreeng);
        setDescripcionEsp(product.descripcionesp);
        setDescripcionEng(product.descripcioneng);
        setCategoryId(product.categoria_id)
        setSelectedFileProduct(null);
        setSelectedFileProduct2(null);
    };

    // Función para cancelar la edición de una categoría
    const handleCancelEditProducts = () => {
        setEditingProduct(null);
        setNombreEspProduct("");
        setNombreEngProduct("");
        setDescripcionEsp("");
        setDescripcionEng("");
        setSelectedFileProduct(null);
        setSelectedFileProduct2(null);
    };

    // Función para actualizar una categoría después de editar
    const handleUpdateProduct = async () => {
        if (selectedFileProduct && nombreEspProduct && nombreEngProduct && categoryId) {

            try {
                const formData = new FormData();
                formData.append('file', selectedFileProduct);
                formData.append('file2', selectedFileProduct2); // Append the second file
                formData.append('nombreesp', nombreEspProduct);
                formData.append('nombreeng', nombreEngProduct);
                formData.append('descripcionesp', descripcionEsp);
                formData.append('descripcioneng', descripcionEng);
                formData.append('categoria', categoryId);

                const response = await axios.put(
                    `http://localhost:5000/edit_product/${editingProduct.id}`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                // Verifica la respuesta del servidor
                if (response.status === 200) {
                    // Actualiza el estado de la lista de categorías y reinicia los estados de edición
                    const updatedProductsResponse = await axios.get('http://localhost:5000/productos');
                    setProducts(updatedProductsResponse.data.products || []);
    
                    setUploadedFileNameProduct(response.data.message);
                    setEditingProduct(null);
                    setNombreEspProduct("");
                    setNombreEngProduct("");
                    setDescripcionEsp("");
                    setDescripcionEng("");
                    setSelectedFileProduct(null);
                    setSelectedFileProduct2(null);
                } else {
                    console.error("Error al cargar la categoría con foto");
                }
            } catch (error) {
                console.error("Error al cargar la categoría con foto", error);
            }
        } else {
            console.error("Todos los campos son obligatorios");
        }
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


            // Actualizar la lista de productos después de agregar meses
            axios.get('http://localhost:5000/productos')
                .then(response => setProducts(response.data.products))
                .catch(error => console.error('Error al obtener la lista de productos después de agregar meses:', error));
        } catch (error) {
            // ... (rest of your error handling code)
        }
    };


    return (
        <div className='animate-flip-down max-w-screen-xl mx-auto px-10 '>
            <form className="grid md:grid-cols-3 gap-6">
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Nombre Producto Español</span>
                    </label>
                    <input type="text" id="name_product_esp" className="input input-bordered w-full max-w-xs" placeholder="Nombre Producto Español" onChange={handleNombreEspChangeProduct} required />
                </div>

                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Nombre Producto Inglés</span>
                    </label>

                    <input type="text" id="name_product_eng" className="input input-bordered w-full max-w-xs" placeholder="Nombre Producto Inglés" onChange={handleNombreEngChangeProduct} required />
                </div>

                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Descripción Producto Español</span>
                    </label>

                    <input type="text" id="description_product_esp" className="input input-bordered w-full max-w-xs" placeholder="Descripción Producto Español" onChange={handleDescripcionEspChange} required />
                </div>

                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Descripción Producto Inglés</span>
                    </label>

                    <input type="text" id="description_product_eng" className="input input-bordered w-full max-w-xs" placeholder="Descripción Producto Inglés" onChange={handleDescripcionEngChange} required />
                </div>

                <div className='form-control w-full max-w-xs"'>
                    <label className="label">
                        <span className="label-text">Categoría</span>
                    </label>

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
                    <label className="label">
                        <span className="label-text">Foto Producto Abierto</span>
                    </label>
                    <input type="file" className="file-input file-input-bordered file-input-success w-full max-w-xs" onChange={handleFileChangeProduct} required />
                </div>
                <div className="form-control w-full max-w-xs">
                    <label className="label">
                        <span className="label-text">Foto Producto Cerrado</span>
                    </label>

                    <input type="file" className="file-input file-input-bordered  file-input-success w-full max-w-xs" onChange={handleFileChangeProduct2} required />
                </div>
            </form>
            <div className='flex justify-center md:col-start-2 mb-5 mt-5'>
                <button onClick={handleUploadProduct} type="button" className="btn btn-outline btn-success">Crear Producto</button>
            </div>
            {/* agregar meses */}

            <form className="grid grid-cols-1 mb-5">
                <div>
                    <label className="label">
                        <span className="label-text">Producto</span>
                    </label>

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
                    <thead>
                        <tr>
                            <th>Foto</th>
                            <th>Foto2</th>
                            <th>Nombre</th>
                            <th className="hidden md:table-cell">Nombre Inglés</th>
                            <th className="hidden md:table-cell">Descripción</th>
                            <th className="hidden md:table-cell">Descripción Inglés</th>
                            <th>Meses de Producción</th>
                            <th>Eliminar Producto</th> {/* Nueva columna para el botón de eliminación */}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    {product.foto_url && (
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img
                                                        src={product.foto_url}
                                                        alt={product.nombreesp}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {product.foto2_url && (
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="mask mask-squircle w-12 h-12">
                                                    <img
                                                        src={product.foto2_url}
                                                        alt={product.nombreesp}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td>{product.nombreesp}</td>
                                <td className="hidden md:table-cell">{product.nombreeng}</td>
                                <td className="hidden md:table-cell">{product.descripcionesp}</td>
                                <td className="hidden md:table-cell">{product.descripcioneng}</td>
                                <td>
                                    {product.meses_de_produccion.map((mes) => (
                                        <span key={mes.id}>{mes.mes} </span>
                                    ))}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleEditProducts(product)}
                                        className="btn btn-outline btn-info"
                                    >
                                        Editar
                                    </button>
                                    <button className="btn btn-outline btn-error" onClick={() => handleDelete(product.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {editingProduct && (
                    <div className="mt-5">
                        <h2>Editar Categoría</h2>
                        <form className="grid md:grid-cols-3 gap-6">
                            <div className="form-control w-full max-w-xs">
                                <input
                                    type="text"
                                    id="edit_name_esp"
                                    className="input input-bordered w-full max-w-xs"
                                    placeholder="Nombre Categoría Español"
                                    onChange={handleNombreEspChangeProduct}
                                    value={nombreEspProduct}
                                    required
                                />
                            </div>

                            <div className="form-control w-full max-w-xs">
                                <input
                                    type="text"
                                    id="edit_name_eng"
                                    className="input input-bordered w-full max-w-xs"
                                    placeholder="Nombre Categoría Inglés"
                                    onChange={handleNombreEngChangeProduct}
                                    value={nombreEngProduct}
                                    required
                                />
                            </div>

                            <div className="form-control w-full max-w-xs">
                                <input
                                    type="text"
                                    id="edit_desc_esp"
                                    className="input input-bordered w-full max-w-xs"
                                    placeholder="Nombre Categoría Español"
                                    onChange={handleDescripcionEspChange}
                                    value={descripcionEsp}
                                    required
                                />
                            </div>

                            <div className="form-control w-full max-w-xs">
                                <input
                                    type="text"
                                    id="edit_desc_eng"
                                    className="input input-bordered w-full max-w-xs"
                                    placeholder="Nombre Categoría Inglés"
                                    onChange={handleDescripcionEngChange}
                                    value={descripcionEng}
                                    required
                                />
                            </div>

                            <div className="form-control w-full max-w-xs">
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full max-w-xs"
                                    onChange={handleFileChangeProduct}
                                />
                            </div>
                            <div className="form-control w-full max-w-xs">
                                <input
                                    type="file"
                                    className="file-input file-input-bordered w-full max-w-xs"
                                    onChange={handleFileChangeProduct2}
                                />
                            </div>


                            <div className="mx-auto md:col-start-2 mt-5">
                                <button
                                    onClick={handleUpdateProduct}
                                    type="button"
                                    className="btn btn-outline btn-success"
                                >
                                    Actualizar Categoría
                                </button>
                                <button
                                    onClick={handleCancelEditProducts}
                                    type="button"
                                    className="btn btn-outline btn-danger ml-2"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
}

export default PruebaProducto;
