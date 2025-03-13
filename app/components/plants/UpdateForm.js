"use client";

import { useForm } from 'react-hook-form';
import { resizeImage } from '../../lib/navigation';

export default function UpdateForm({ onSubmit, onCancel, initialData, isEdit }) {
  const { register, handleSubmit, setValue } = useForm({ defaultValues: initialData });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      resizeImage(file, 300, 300).then((resizedData) => {
        setValue('photo', resizedData);
      });
    }
  };

  return (
    <form
      className="form-overlay"
      onSubmit={handleSubmit((data) => onSubmit({ preventDefault: () => {} }, data))}
    >
      <div className="plant-form">
        <h2>
          <i className={isEdit ? 'fas fa-edit' : 'fas fa-plus'}></i> {isEdit ? 'Editar Actualización' : 'Agregar Actualización'}
        </h2>
        <div className="form-content">
          <div className="form-field">
            <label><i className="fas fa-calendar-alt"></i> Fecha:</label>
            <input type="date" {...register('date', { required: true })} />
          </div>
          <div className="form-field">
            <label><i className="fas fa-leaf"></i> Fase:</label>
            <select {...register('phase', { required: true })}>
              <option value="">Fase actual</option>
              <option value="semilla">Semilla</option>
              <option value="vegetativa">Vegetativa</option>
              <option value="floracion">Floración</option>
            </select>
          </div>
          <div className="form-field">
            <label><i className="fas fa-thermometer-half"></i> Temperatura (°C):</label>
            <input type="number" {...register('temperature')} placeholder="Temperatura (°C)" step="0.1" min="0" max="50" />
          </div>
          <div className="form-field">
            <label><i className="fas fa-tint"></i> Humedad (%):</label>
            <input type="number" {...register('humidity')} placeholder="Humedad (%)" step="1" min="0" max="100" />
          </div>
          <div className="form-field-start">
            <label><i className="fas fa-sticky-note"></i> Notas:</label>
            <textarea {...register('notes')} placeholder="Notas"></textarea>
          </div>
          <div className="form-field">
            <label><i className="fas fa-camera"></i> Foto:</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </div>
        </div>
        <div className="form-buttons">
          <button type="submit" className="plant-btn"><i className={isEdit ? 'fas fa-save' : 'fas fa-plus'}></i> {isEdit ? 'Editar' : 'Agregar'}</button>
          <button type="button" onClick={onCancel} className="plant-btn"><i className="fas fa-times"></i> Cancelar</button>
        </div>
      </div>
    </form>
  );
}