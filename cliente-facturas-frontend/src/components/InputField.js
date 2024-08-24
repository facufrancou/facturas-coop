// src/components/InputField.js
import React from 'react';

function InputField({ label, type, id, name, value, onChange, placeholder }) {
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
            />
        </div>
    );
}

export default InputField;
