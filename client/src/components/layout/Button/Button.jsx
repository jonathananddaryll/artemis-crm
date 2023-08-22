import React from 'react';
import styles from './Button.module.scss';

const Button = ({ type, value, onClick, color, size, disabled }) => {
  return (
    <input
      type={type}
      className={
        `${styles.button}` + ' ' + `${styles[color]}` + ' ' + `${styles[size]}`
      }
      onClick={onClick}
      disabled={disabled}
      value={value}
    />
  );
};

export default Button;
