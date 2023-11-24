// EditPackagingUsers.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditPackagingUsers = ({ packaging, onUpdate }) => {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [updatedPackaging, setUpdatedPackaging] = useState(null);
    const [selectedPackaging, setSelectedPackaging] = useState(null);

    useEffect(() => {
        console.log('selectedPackaging:', selectedPackaging);
    }, [selectedPackaging]);
    
    useEffect(() => {
        // Obtener la lista de usuarios
        axios.get('http://localhost:5000/users')
            .then(response => {
                setUsers(response.data.users);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener la lista de usuarios:', error);
                setIsLoading(false);
            });
    }, [updatedPackaging]); // Asegúrate de recargar la lista de usuarios después de la actualización

    const handleUserChange = (userId) => {
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter(id => id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };

    const handleSave = () => {
        if (!selectedPackaging || !selectedPackaging.id) {
            console.error('Por favor, selecciona un packaging válido.');
            return;
        }
        
        axios.put(`http://localhost:5000/packagings/${packaging.id}/edit_users`, { users: selectedUsers })
            .then(response => {
                console.log('Usuarios del packaging actualizados con éxito:', response.data);
                // Puedes realizar acciones adicionales después de la actualización
                onUpdate();
            })
            .catch(error => {
                console.error('Error al actualizar usuarios del packaging:', error);
            });
    };

    if (isLoading) {
        return <p>Cargando...</p>;
    }

    return (

        <div className="card w-96 bg-base-100  mx-auto">
            <div className="card-body">
                <h2 className="card-title">Editar Usuarios</h2>
                <div className="card-actions">
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {users.map(user => (
                            <li key={user.id} style={{ display: 'inline-block', marginRight: '10px' }}>
                              <label className="cursor-pointer label">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-success"
                                    id={user.id}
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={() => handleUserChange(user.id)}
                                />
                               <span className="label-text ml-2">{user.username}</span>
                               </label>

                            </li>
                        ))}
                    </ul>
                </div>
                <button onClick={handleSave} className="btn btn-outline btn-success">Guardar Cambios</button>
            </div>
        </div>
    );
};

export default EditPackagingUsers;
