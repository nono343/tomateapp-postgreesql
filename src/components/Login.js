import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login(props) {
    const [loginForm, setloginForm] = useState({
        username: "",
        password: ""
    });

    const navigate = useNavigate();

    function btnlogin(event) {
        axios({
            method: "POST",
            url: "http://127.0.0.1:5000/logintoken",
            data: {
                username: loginForm.username,
                password: loginForm.password
            }
        })
            .then((response) => {
                console.log(response);
                const { access_token, isAdmin } = response.data;
                props.setToken(access_token);
                alert("Successfully Login");
                localStorage.setItem('username', loginForm.username);
                localStorage.setItem('isAdmin', isAdmin);
                navigate('/profile');
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                    if (error.response.status === 401) {
                        alert("Invalid credentials");
                    }
                }
            });

        setloginForm({
            username: "",
            password: ""
        });

        event.preventDefault();
    }

    function handleChange(event) {
        const { value, name } = event.target
        setloginForm(prevNote => ({
            ...prevNote, [name]: value
        })
        )
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    className="mx-auto h-10 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                    alt="Your Company"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" action="#" method="POST">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Username
                        </label>
                        <div className="mt-2">
                            <input type="username" value={loginForm.username} onChange={handleChange} text={loginForm.username} name="username" id="form3Example3" className="form-control form-control-lg" placeholder="Enter a valid username address" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input type="password" value={loginForm.password} onChange={handleChange} text={loginForm.password} name="password" id="form3Example4" className="form-control form-control-lg" placeholder="Enter password" />
                        </div>
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary btn-lg" onClick={btnlogin} >Login</button>
                    </div>
                </form>
            </div>
        </div>

    );

}
export default Login;