import React from 'react';
import styles from './Button.module.scss';

const Button = ({ value, onClick, color, size, disabled }) => {
  return (
    <button
      className={
        `${styles.button}` + ' ' + `${styles[color]}` + ' ' + `${styles[size]}`
      }
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
};

export default Button;
