/**
 * System Configuration Component
 * Gestion de configuracion del sistema
 */

import React, { useState, useEffect } from 'react';
import styles from '../../styles/admin/components.module.css';
import { api } from '../../utils/api';

const SystemConfig = () => {
  const [config, setConfig] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedValues, setEditedValues] = useState({});
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/config');
      setConfig(response.data.config);
      setError(null);
    } catch (err) {
      setError('Error al cargar configuracion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key, value) => {
    setEditedValues({
      ...editedValues,
      [key]: value
    });
  };

  const handleSaveConfig = async (key, value) => {
    try {
      setSaveStatus({ type: 'saving', key });
      await api.put('/admin/config', { key, value });
      setSaveStatus({ type: 'success', key, message: 'Guardado exitosamente' });
      
      // Refrescar config
      await fetchConfig();
      
      // Limpiar estado
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (err) {
      setSaveStatus({ type: 'error', key, message: 'Error al guardar' });
      console.error(err);
    }
  };

  if (loading) return <div className={styles.loading}>Cargando configuracion...</div>;

  return (
    <div className={styles.systemConfigContainer}>
      <div className={styles.configHeader}>
        <h3>Configuracion del Sistema</h3>
        <p className={styles.configSubtitle}>Parametros editables del sistema</p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.configGrid}>
        {config.map(item => (
          <div key={item.key} className={styles.configItem}>
            <div className={styles.configItemHeader}>
              <label className={styles.configLabel}>{item.key}</label>
              <span className={styles.configType}>{item.type}</span>
            </div>

            <p className={styles.configDescription}>{item.description}</p>

            <div className={styles.configInputWrapper}>
              {item.type === 'boolean' ? (
                <select
                  value={editedValues[item.key] ?? item.value}
                  onChange={(e) => handleConfigChange(item.key, e.target.value)}
                  className={styles.configSelect}
                >
                  <option value="true">Verdadero</option>
                  <option value="false">Falso</option>
                </select>
              ) : (
                <input
                  type={item.type === 'number' ? 'number' : 'text'}
                  value={editedValues[item.key] ?? item.value}
                  onChange={(e) => handleConfigChange(item.key, e.target.value)}
                  className={styles.configInput}
                />
              )}

              <button
                onClick={() => handleSaveConfig(item.key, editedValues[item.key] ?? item.value)}
                className={styles.configSaveBtn}
                disabled={saveStatus?.key === item.key}
              >
                {saveStatus?.key === item.key && saveStatus?.type === 'saving'
                  ? 'Guardando...'
                  : 'Guardar'}
              </button>
            </div>

            {saveStatus?.key === item.key && (
              <div className={`${styles.configStatus} ${styles[`status-${saveStatus.type}`]}`}>
                {saveStatus.message}
              </div>
            )}

            {item.default_value && (
              <div className={styles.configDefault}>
                <small>Por defecto: {item.default_value}</small>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemConfig;
