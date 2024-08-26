import React from 'react';

function InputField({ label, type, id, name, value, onChange, placeholder, required = false }) {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input 
                type={type} 
                className="form-control" 
                id={id} 
                name={name} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder}
                required={required}  // Validación
                aria-label={label}  // Accesibilidad
            />
        </div>
    );
}

export default InputField;
