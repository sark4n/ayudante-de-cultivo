"use client";

import { useForm } from 'react-hook-form';
import { resizeImage } from '../../lib/navigation';

export default function PlantForm({ onSubmit, onCancel, initialData, title, icon }) {
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
          <i className={icon}></i> {title}
        </h2>
        <div className="form-content">
          <div className="form-field">
            <label><i className="fas fa-pen"></i> Nombre</label>
            <input {...register('name', { required: true })} placeholder="Nombre de la planta" />
          </div>
          <div className="form-field">
            <label><i className="fas fa-calendar-alt"></i> Fecha de Inicio</label>
            <input type="date" {...register('startDate', { required: true })} />
          </div>
          <div className="form-field">
            <label><i className="fas fa-seedling"></i> Tipo de Planta</label>
            <select {...register('type', { required: true })}>
              <option value="">Selecciona un tipo</option>
              <option value="indica">Indica</option>
              <option value="sativa">Sativa</option>
              <option value="hybrid">Híbrida</option>
              <option value="otra">Otra</option>
            </select>
          </div>
          <div className="form-field">
            <label><i className="fas fa-leaf"></i> Fase Actual</label>
            <select {...register('phase', { required: true })}>
              <option value="">Selecciona una fase</option>
              <option value="semilla">Semilla</option>
              <option value="vegetativa">Vegetativa</option>
              <option value="floracion">Floración</option>
            </select>
          </div>
          <div className="form-field">
            <label><i className="fas fa-camera"></i> Foto</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </div>
          <div className="form-field-start">
            <label><i className="fas fa-sticky-note"></i> Notas</label>
            <textarea {...register('notes')} placeholder="Añade notas sobre tu planta"></textarea>
          </div>
        </div>
        <div className="form-buttons">
          <button type="button" onClick={onCancel} className="plant-btn"><i className="fas fa-times"></i> Cancelar</button>
          <button type="submit" className="plant-btn"><i className="fas fa-save"></i> Guardar</button>
        </div>
      </div>
    </form>
  );
}