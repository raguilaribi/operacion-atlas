/**
 * Admin Dashboard
 * Panel de control para administradores del sistema
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import AdminHeader from '../../components/admin/AdminHeader';
import StatisticsCards from '../../components/admin/StatisticsCards';
import UserManagement from '../../components/admin/UserManagement';
import AuditLog from '../../components/admin/AuditLog';
import SystemConfig from '../../components/admin/SystemConfig';
import styles from '../../styles/admin/dashboard.module.css';
import { api } from '../../utils/api';
import { useAdminAuth } from '../../middleware/authMiddleware';

const AdminDashboard = () => {
  const router = useRouter();
  const { user, loading: authLoading, isAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchStatistics();
    }
  }, [authLoading, isAdmin]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/statistics');
      setStatistics(response.data.statistics);
      setError(null);
    } catch (err) {
      setError('Error al cargar estadisticas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar loader mientras se verifica autenticacion
  if (authLoading) {
    return (
      <Layout>
        <div className={styles.adminDashboard}>
          <div className={styles.loading}>Verificando autorizacion...</div>
        </div>
      </Layout>
    );
  }

  // Si no es admin, mostrar mensaje de error (el hook ya redirige pero esto es por si acaso)
  if (!isAdmin) {
    return (
      <Layout>
        <div className={styles.adminDashboard}>
          <div className={styles.error}>No tienes permisos para acceder a esta area</div>
        </div>
      </Layout>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className={styles.overviewSection}>
            <h2>Resumen del Sistema</h2>
            {loading ? (
              <div className={styles.loading}>Cargando estadisticas...</div>
            ) : statistics ? (
              <StatisticsCards statistics={statistics} />
            ) : null}
          </div>
        );
      case 'users':
        return <UserManagement />;
      case 'audit':
        return <AuditLog />;
      case 'config':
        return <SystemConfig />;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className={styles.adminDashboard}>
        <AdminHeader user={user} />
        
        <div className={styles.tabNavigation}>
          <button
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Resumen
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Usuarios
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'audit' ? styles.active : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            📋 Auditoria
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'config' ? styles.active : ''}`}
            onClick={() => setActiveTab('config')}
          >
            ⚙️ Configuracion
          </button>
        </div>

        <div className={styles.tabContent}>
          {error && <div className={styles.error}>{error}</div>}
          {renderTabContent()}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
