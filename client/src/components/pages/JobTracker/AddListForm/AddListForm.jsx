import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { addColumn } from '../../../../reducers/BoardReducer';
import { useSession } from '@clerk/clerk-react';
import Button from '../../../layout/Button/Button';
import styles from './AddListForm.module.scss';

export default function AddListForm({
  setAddListToggle,
  selectedBoard: { id, total_cols, user_id }
}) {
  const [formData, setFormData] = useState({
    id: id,
    totalCols: total_cols,
    columnStatus: '',
    userId: user_id
  });
  const dispatch = useDispatch();
  const { session } = useSession();
  const { columnStatus } = formData;

  const onChangeHandler = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();

    const formD = formData;
    formD.token = await session.getToken();

    dispatch(addColumn(formD));
    setAddListToggle(false);
  };

  // for modal backdrop motionframer
  const backdrop = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  const modal = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: { delay: 0.1 }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.form_wrapper}
        variants={backdrop}
        initial='hidden'
        animate='visible'
      >
        <div
          className={styles.popupOuter}
          onClick={() => setConfirmationToggle(false)}
        ></div>
        <motion.div
          className={styles.popupBox}
          variants={modal}
          initial='hidden'
          animate='visible'
        >
          <form onSubmit={e => onSubmit(e)}>
            <input
              className={styles.columnStatusInput}
              type='text'
              name='columnStatus'
              value={columnStatus}
              onChange={e => onChangeHandler(e)}
              required
            />
            <div className={styles.buttonsContainer}>
              <Button
                type={'button'}
                value={'Cancel'}
                color={'white'}
                // size={'small'}
                onClick={() => setAddListToggle(false)}
              />
              <Button
                type={'submit'}
                value={'Add New List'}
                color={'blue'}
                // size={'small'}
              />
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
