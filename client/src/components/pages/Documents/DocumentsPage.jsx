import React from 'react';
import NoDataPlaceholder from '../../layout/NoDataPlaceholder/NoDataPlaceholder';
import websitesetup from '../../../assets/websitesetup.svg';
import styles from './DocumentsPage.module.scss';

export default function DocumentsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.marginTop}>
        <NoDataPlaceholder
          image={websitesetup}
          header={'THIS FEATURE IS BEING BUILT'}
          subHeader={'Wait for our next update'}
        />
      </div>
    </div>
  );
}
