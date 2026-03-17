/**
 * Audit Log Component
 * Registro de auditoria del sistema
 */

import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin/components.module.css';
import { api } from '../../utils/api';

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ limit: 50, offset: 0 });
  const [filterAction, setFilterAction] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [pagination, filterAction]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/audit-log', {
        params: {
          limit: pagination.limit,
          offset: pagination.offset
        }
      });
      setLogs(response.data.logs);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
      setError(null);
    } catch (err) {
      setError('Error al cargar registro de auditoria');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getActionBadgeClass = (action) => {
    const actionClasses = {
      'create': styles.actionCreate,
      'update': styles.actionUpdate,
      'delete': styles.actionDelete,
      'ban': styles.actionBan,
      'unban': styles.actionUnban
    };
    return actionClasses[action] || styles.actionDefault;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CL');
  };

  if (loading && logs.length === 0) return <div className={styles.loading}>Cargando registro...</div>;

  return (
    <div className={styles.auditLogContainer}>
      <div className={styles.auditHeader}>
        <h3>Registro de Auditoria del Sistema</h3>
        <div className={styles.auditInfo}>
          <span>Total de registros: {pagination.total}</span>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.auditTableWrapper}>
        <table className={styles.auditTable}>
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>Administrador</th>
              <th>Accion</th>
              <th>Tabla</th>
              <th>ID Registro</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td className={styles.dateCell}>
                  {formatDate(log.created_at)}
                </td>
                <td className={styles.adminCell}>
                  Admin #{log.admin_user_id}
                </td>
                <td>
                  <span className={`${styles.actionBadge} ${getActionBadgeClass(log.action)}`}>
                    {log.action.toUpperCase()}
                  </span>
                </td>
                <td className={styles.tableCell}>{log.table_name}</td>
                <td className={styles.idCell}>{log.record_id || '-'}</td>
                <td className={styles.descriptionCell}>
                  {log.changes_description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <button
          disabled={pagination.offset === 0}
          onClick={() => setPagination({ ...pagination, offset: pagination.offset - pagination.limit })}
        >
          ← Anterior
        </button>
        <span>
          Pag {Math.floor(pagination.offset / pagination.limit) + 1} de{' '}
          {Math.ceil(pagination.total / pagination.limit)}
        </span>
        <button
          disabled={pagination.offset + pagination.limit >= pagination.total}
          onClick={() => setPagination({ ...pagination, offset: pagination.offset + pagination.limit })}
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};

export default AuditLog;
