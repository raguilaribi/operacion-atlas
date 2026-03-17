/**
 * Admin Layout Component
 * Layout especializado para el panel administrativo
 */

import React from 'react';
import AdminNavigation from './AdminNavigation';
import styles from '../../styles/admin/layout.module.css';

const AdminLayout = ({ children, user }) => {
  return (
    <div className={styles.adminLayout}>
      <AdminNavigation user={user} />
      
      <div className={styles.layoutContainer}>
        <main className={styles.mainContent}>
          {children}
        </main>
        
        <footer className={styles.adminFooter}>
          <div className={styles.footerContent}>
            <p>&copy; 2026 Operacion Atlas. Panel Administrativo.</p>
            <p className={styles.footerLinks}>
              <a href="#">Documentacion</a>
              <span> | </span>
              <a href="#">Soporte</a>
              <span> | </span>
              <a href="#">Estado del Sistema</a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
