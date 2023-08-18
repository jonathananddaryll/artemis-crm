import React from 'react';
import styles from './Button.module.scss';

const Button = ({ value, onClick, color }) => {
  return (
    <button
      className={`${styles.button}` + ' ' + `${styles[color]}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Button;
