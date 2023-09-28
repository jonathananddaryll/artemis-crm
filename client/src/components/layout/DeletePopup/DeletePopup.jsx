import React from 'react';
import Button from '../Button/Button';
import styles from './DeletePopup.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeletePopup({
  handleDelete,
  closePopUp,
  mainText,
  subText
}) {
  // for modal backdrop motionframer
  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  const modal = {
    hidden: {
      // y: '-110vh',
      opacity: 0
    },
    visible: {
      opacity: 1,
      // y: '100vh',
      transition: { delay: 0.1 }
    }
  };

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        className={styles.popupWrapper}
        variants={backdrop}
        initial='hidden'
        animate='visible'
      >
        <div className={styles.popupOuter} onClick={() => closePopUp()}></div>
        <motion.div
          className={styles.popupBox}
          variants={modal}
          initial='hidden'
          animate='visible'
        >
          <button className={styles.closeButton} onClick={() => closePopUp()}>
            <i className='bi bi-x-lg'></i>
          </button>
          <p className={styles.popupMainText}>{mainText}</p>
          <p className={styles.popupSubText}>{subText}</p>

          <div className={styles.popupButtons}>
            <Button
              type={'button'}
              // size={'small'}
              value={'Cancel'}
              color={'white'}
              onClick={() => closePopUp()}
            />
            <Button
              type={'button'}
              // size={'small'}
              value={'Delete'}
              color={'red'}
              onClick={() => handleDelete()}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
