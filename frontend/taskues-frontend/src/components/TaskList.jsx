import React from 'react';

const TaskList = ({ tasks, onEdit, onDelete }) => {
  return (
    <div className="task-list-container" style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #ddd' }}>
      <h2>Listado de Tareas (GET)</h2>
      {tasks.length === 0 ? (
        <p>No hay tareas registradas.</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {tasks.map((task) => (
            <div key={task.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '6px', background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{task.title}</h3>
                <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', background: task.status === 'COMPLETADO' ? '#d4edda' : task.status === 'EN_PROGRESO' ? '#fff3cd' : '#f8d7da' }}>
                  {task.status}
                </span>
              </div>
              <p style={{ color: '#555', fontSize: '14px' }}>{task.description}</p>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button onClick={() => onEdit(task)} style={{ background: '#ffc107', color: 'black', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                  Editar (PUT)
                </button>
                <button onClick={() => onDelete(task.id)} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                  Eliminar (DELETE)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;