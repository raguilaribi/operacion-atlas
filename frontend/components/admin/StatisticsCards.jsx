/**
 * Statistics Cards Component
 * Tarjetas de estadisticas del sistema
 */

import React from 'react';
import styles from '../../styles/admin/components.module.css';

const StatisticsCards = ({ statistics }) => {
  const cards = [
    {
      title: 'Usuarios Totales',
      value: statistics.totalUsers,
      icon: '👥',
      color: 'blue'
    },
    {
      title: 'Usuarios Activos (7d)',
      value: statistics.activeUsers,
      icon: '✨',
      color: 'green'
    },
    {
      title: 'Sesiones Completadas',
      value: statistics.completedGames,
      icon: '🎮',
      color: 'purple'
    },
    {
      title: 'Tasa de Exito Global',
      value: `${statistics.globalWinRate}%`,
      icon: '🎯',
      color: 'orange'
    }
  ];

  return (
    <div className={styles.statisticsGrid}>
      {cards.map((card, index) => (
        <div key={index} className={`${styles.statCard} ${styles[`stat-${card.color}`]}`}>
          <div className={styles.statIcon}>{card.icon}</div>
          <div className={styles.statContent}>
            <p className={styles.statTitle}>{card.title}</p>
            <p className={styles.statValue}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;
