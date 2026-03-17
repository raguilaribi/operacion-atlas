/**
 * Admin Navigation Component
 * Barra de navegacion con opciones de admin
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/admin/navigation.module.css';
import { useLogout } from '../../middleware/authMiddleware';

const AdminNavigation = ({ user }) => {
  const router = useRouter();
  const logout = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => router.pathname === path;

  return (
    <nav className={styles.adminNav}>
      <div className={styles.navContainer}>
        {/* Logo/Brand */}
        <div className={styles.navBrand}>
          <Link href="/">
            <a className={styles.brandLink}>
              <span className={styles.brandIcon}>🎮</span>
              <span className={styles.brandText}>Operacion Atlas</span>
            </a>
          </Link>
        </div>

        {/* Menu items */}
        <div className={styles.navMenu}>
          <Link href="/dashboard">
            <a className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}>
              🏠 Dashboard
            </a>
          </Link>
          
          <Link href="/admin/dashboard">
            <a className={`${styles.navItem} ${isActive('/admin/dashboard') ? styles.active : ''}`}>
              ⚙️ Panel Admin
            </a>
          </Link>

          <a href="#" className={styles.navItem}>
            📚 Documentacion
          </a>
        </div>

        {/* User menu */}
        <div className={styles.userMenu}>
          <button
            className={styles.userButton}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className={styles.userIcon}>👤</span>
            <span className={styles.username}>{user?.username || 'Usuario'}</span>
            <span className={styles.dropdown}>▼</span>
          </button>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownItem}>
                <strong>{user?.username}</strong>
                <span className={styles.userRole}>{user?.role}</span>
              </div>
              <hr className={styles.divider} />
              <a href="#" className={styles.dropdownLink}>
                ⚙️ Configuracion
              </a>
              <a href="#" className={styles.dropdownLink}>
                🔒 Seguridad
              </a>
              <hr className={styles.divider} />
              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
              >
                🚪 Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
