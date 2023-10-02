import React from 'react';
import Button from '../../../../layout/Button/Button';
import NoDataPlaceholder from '../../../../layout/NoDataPlaceholder/NoDataPlaceholder';
import noDocuments from '../../../../../assets/nofiles.svg';
import styles from './DocumentsTab.module.scss';

export default function DocumentsTab() {
  return (
    <div className={styles.documentsTabContainer}>
      {/* <div className={styles.buttonsContainer}>
        <Button
          type={'button'}
          value={'Link Document'}
          color={'white'}
          size={'small'}
        />
        <Button
          type={'button'}
          value={'Add Document'}
          color={'blue'}
          size={'small'}
        />
      </div> */}
      <div className={styles.documentsContentContainer}>
        <NoDataPlaceholder
          image={noDocuments}
          header={'NO LINKED DOCUMENTS'}
          subHeader={'Here you can add and link documents'}
        />
      </div>
    </div>
  );
}
