import React, { useState, useEffect } from 'react';



const TaskForm = ({ onSaveTask, taskToEdit, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('PENDIENTE');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('PENDIENTE');
    }
  }, [taskToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSaveTask({
      title,
      description,
      status,
      id: taskToEdit ? taskToEdit.id : null
    });

    if (!taskToEdit) {
      setTitle('');
      setDescription('');
      setStatus('PENDIENTE');
    }
  };

  return (
    <div className="task-form-container" style={{ padding: '20px', background: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
      <h2>{taskToEdit ? 'Editar Tarea (PUT)' : 'Crear Nueva Tarea (POST)'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Título:</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Descripción:</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            rows="3"
            required 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Estado:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="EN_PROGRESO">EN_PROGRESO</option>
            <option value="COMPLETADO">COMPLETADO</option>
          </select>
        </div>
        <button type="submit" style={{ background: '#007bff', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>
          {taskToEdit ? 'Guardar Cambios' : 'Agregar Registro'}
        </button>
        {taskToEdit && (
          <button type="button" onClick={onCancelEdit} style={{ background: '#6c757d', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
};

export default TaskForm;