import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { updateBoardName } from '../../../../reducers/BoardReducer';
import { useSession } from '@clerk/clerk-react';
import Button from '../../../layout/Button/Button';
import styles from './UpdateForm.module.scss';

export default function UpdateForm({ board, handleToggleUpdateForm }) {
  const [newTitle, setNewTitle] = useState(board.title);
  const dispatch = useDispatch();

  const { session } = useSession();

  const onSubmitHandler = async e => {
    e.preventDefault();

    const formData = {
      id: board.id,
      title: newTitle,
      userId: board.user_id,
      token: await session.getToken()
    };

    dispatch(updateBoardName(formData));
    handleToggleUpdateForm({ ind: null, state: false });
  };

  // for newformn opacity motionframer
  const opacity = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={styles.updateFormContainer}
        variants={opacity}
        initial='hidden'
        animate='visible'
      >
        <div className={styles.updateForm}>
          <form onSubmit={e => onSubmitHandler(e)}>
            <input
              type='text'
              value={newTitle}
              name='newTitle'
              placeholder='New Board Name'
              onChange={e => setNewTitle(e.target.value)}
              required
            />
            <div className={styles.formButtons}>
              <Button
                type={'button'}
                value={'Cancel'}
                color={'white'}
                size={'small'}
                onClick={() =>
                  handleToggleUpdateForm({ ind: null, state: false })
                }
              />
              <Button
                type={'submit'}
                value={'Update'}
                color={'blue'}
                size={'small'}
                disabled={newTitle === ''}
              />
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
