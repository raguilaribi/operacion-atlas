/**
 * User Management Component
 * Gestion de usuarios en el panel administrativo
 */

import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin/components.module.css';
import { api } from '../../utils/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ limit: 50, offset: 0 });
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [pagination]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users', {
        params: {
          limit: pagination.limit,
          offset: pagination.offset,
          search: searchTerm
        }
      });
      setUsers(response.data.users);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
      setError(null);
    } catch (err) {
      setError('Error al cargar usuarios');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPagination({ ...pagination, offset: 0 });
  };

  const handleBanUser = async (userId) => {
    if (!confirm('¿Deseas banear este usuario?')) return;
    try {
      await api.post(`/admin/users/${userId}/ban`, {
        reason: 'Baneado por administrador'
      });
      fetchUsers();
    } catch (err) {
      setError('Error al banear usuario');
      console.error(err);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await api.post(`/admin/users/${userId}/unban`);
      fetchUsers();
    } catch (err) {
      setError('Error al desbanear usuario');
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('¿Deseas eliminar este usuario? Esta accion no se puede deshacer.')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      setError('Error al eliminar usuario');
      console.error(err);
    }
  };

  if (loading && users.length === 0) return <div className={styles.loading}>Cargando usuarios...</div>;

  return (
    <div className={styles.userManagementContainer}>
      <div className={styles.userSearchBar}>
        <input
          type="text"
          placeholder="Buscar por usuario o email..."
          value={searchTerm}
          onChange={handleSearch}
          className={styles.searchInput}
        />
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className={!user.is_active ? styles.inactive : ''}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <span className={`${styles.badge} ${styles[`role-${user.role}`]}`}>
                  {user.role}
                </span>
              </td>
              <td>
                <span className={`${styles.status} ${user.is_active ? styles.active : styles.banned}`}>
                  {user.is_active ? 'Activo' : 'Baneado'}
                </span>
              </td>
              <td>
                <div className={styles.actionButtons}>
                  {user.is_active ? (
                    <button
                      className={styles.banBtn}
                      onClick={() => handleBanUser(user.id)}
                    >
                      Banear
                    </button>
                  ) : (
                    <button
                      className={styles.unbanBtn}
                      onClick={() => handleUnbanUser(user.id)}
                    >
                      Desbanear
                    </button>
                  )}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default UserManagement;
