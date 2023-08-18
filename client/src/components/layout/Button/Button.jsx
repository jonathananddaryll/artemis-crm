import React from 'react';
import styles from './Button.module.scss';

const Button = ({ value, onClick, color, size }) => {
  return (
    <button
      className={
        `${styles.button}` + ' ' + `${styles[color]}` + ' ' + `${styles[size]}`
      }
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Button;
