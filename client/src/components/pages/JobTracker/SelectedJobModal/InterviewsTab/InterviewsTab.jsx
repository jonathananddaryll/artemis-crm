import React from 'react';
import styles from './InterviewsTab.module.scss';
import Button from '../../../../layout/Button/Button';

export default function InteviewTab({ interviews }) {
  return (
    <div className={styles.interviewsTabContainer}>
      <div className={styles.buttonsContainer}>
        <Button value={'Add Interview'} color={'blue'} size={'small'} />
      </div>
      {interviews.length > 0 ? (
        <div>
          {interviews.map(interview => (
            <div key={interview.id}>
              <p>{interview.category}</p>
              <p>{interview.start_date}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No interview scheduled for this job</p>
      )}
    </div>
  );
}
