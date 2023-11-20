import React, { useEffect, useState } from 'react';
import logo from "../assets/LaPalma.png";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import ReactCountryFlag from "react-country-flag";
import { useNavigate } from 'react-router-dom';

export const Navbar = (props) => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/categorias')
            .then((response) => {
                setCategories(response.data.categories);
            })
            .catch((error) => {
                console.error('Error al obtener las categorías', error);
            });
    }, []);

    const token = props.token;
    const decodedToken = token ? jwt_decode(token) : null;
    const foto = decodedToken && decodedToken.foto;

    const [isChecked, setIsChecked] = useState(true);

    const toggleCheckbox = () => {
        setIsChecked((prev) => !prev);
        props.setIsSpanish((prev) => !prev); // Cambiar isSpanish en el componente padre
    };

    const navigate = useNavigate()
    const handleLogout = () => {
        // Aquí puedes realizar cualquier lógica adicional antes de hacer logout, si es necesario.
        // Por ejemplo, enviar una solicitud al servidor para invalidar el token.

        // Luego, realiza el logout llamando a la función onLogout.
        props.onLogout();
        navigate("/");
    };



    return (
        <div className="navbar max-w-screen-xl mx-auto bg-base-100 animate-fade-down">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/categories/${category.id}`}
                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"

                            >
                                <li>{props.isSpanish ? category.nombreesp : category.nombreeng}</li>
                            </Link>
                        ))}

                    </ul>
                </div>
                <Link to="/inicio">
                    <img src={logo} className='w-25 h-10' />
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/categorias/${category.id}`}
                            className="block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50 mx-1"

                        >
                            <li>{props.isSpanish ? category.nombreesp : category.nombreeng}</li>
                        </Link>
                    ))}

                </ul>
            </div>
            <div className="ml-10 flex items-center">
                <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={isChecked}
                    onChange={toggleCheckbox}
                />
                <div className="ml-2">
                    <ReactCountryFlag
                        countryCode={isChecked ? "ES" : "GB"}
                        svg
                        className="fill-current rounded-full"
                        style={{
                            width: '4em',
                            height: '5em',
                        }}
                    />
                </div>
            </div>
            <div className="navbar-end">
                <details className="dropdown dropdown-end">
                    <summary className="btn btn-ghost rounded-btn w-20 "><img src={foto} /></summary>
                    <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                        <li><a>Item 1</a></li>
                        <li><a>Item 2</a></li>
                    </ul>
                </details>
            </div>
            <button onClick={handleLogout}>
                Logout
            </button>

        </div>
    )
}
