import React, { useState, useEffect } from 'react';
import axios from 'axios';

function EnviarFacturas() {
    const [clientesDisponibles, setClientesDisponibles] = useState([]);
    const [enviando, setEnviando] = useState(false);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        const fetchClientesDisponibles = async () => {
            try {
                const response = await axios.get('https://181.98.176.80:5000/api/clientes/disponibles');
                setClientesDisponibles(response.data);
            } catch (error) {
                console.error('Error al obtener los clientes disponibles:', error);
                setMensaje('Error al cargar los clientes disponibles.');
            }
        };

        fetchClientesDisponibles();
    }, []);

    const handleEnviarTodo = async () => {
        if (clientesDisponibles.length === 0) {
            setMensaje('No hay clientes disponibles para enviar facturas.');
            return;
        }

        setEnviando(true);
        setMensaje('');

        try {
            const response = await axios.post('https://181.98.176.80:5000/api/email/enviar');
            setMensaje(`Se han enviado correos electrónicos a ${response.data.enviados} clientes.`);
        } catch (error) {
            console.error('Error al enviar correos electrónicos:', error);
            setMensaje('Ocurrió un error al enviar los correos electrónicos.');
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h4 className="card-title">Enviar Facturas por Email</h4>
                    <p>Total de clientes con email disponibles: {clientesDisponibles.length}</p>
                    <button
                        className="btn btn-primary"
                        onClick={handleEnviarTodo}
                        disabled={enviando || clientesDisponibles.length === 0}
                    >
                        {enviando ? 'Enviando...' : 'Enviar Todo'}
                    </button>
                    {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
                </div>
            </div>
        </div>
    );
}

export default EnviarFacturas;
