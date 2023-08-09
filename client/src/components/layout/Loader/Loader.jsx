import React from 'react';
import styles from './Loader.module.css';

export default function Loader({ text, img, altText, imageStyle, textStyle }) {
  return (
    <div className={styles.loaderContainer}>
      <img
        className={styles['imageStyle_' + imageStyle]}
        src={img}
        alt={altText}
      />
      <p className={styles['textStyle_' + textStyle]}>{text}</p>
    </div>
  );
}
