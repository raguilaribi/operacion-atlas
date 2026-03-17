/**
 * Admin Header Component
 * Encabezado del dashboard administrativo
 */

import React from 'react';
import styles from '../../styles/admin/components.module.css';

const AdminHeader = () => {
  return (
    <div className={styles.adminHeader}>
      <div className={styles.headerContent}>
        <h1>Panel Administrativo</h1>
        <p>Gestion centralizada de Operacion Atlas</p>
      </div>
      <div className={styles.headerActions}>
        <div className={styles.timestamp}>
          <span>Ultimo sincronizado:</span>
          <span id="lastSync">Hace un momento</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
