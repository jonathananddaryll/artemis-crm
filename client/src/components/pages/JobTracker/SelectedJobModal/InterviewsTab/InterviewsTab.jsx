import React from 'react';
import styles from './InterviewsTab.module.scss';
import Button from '../../../../layout/Button/Button';
import NoDataPlaceholder from '../../../../layout/NoDataPlaceholder/NoDataPlaceholder';
import noInterviews from '../../../../../assets/nointerviews.svg';

export default function InteviewTab({ interviews }) {
  return (
    <div className={styles.interviewsTabContainer}>
      <div className={styles.buttonsContainer}>
        <Button
          type={'button'}
          value={'Add Interview'}
          color={'blue'}
          size={'small'}
        />
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
        <NoDataPlaceholder
          image={noInterviews}
          header={'NO UPCOMING INTERVIEWS'}
          subHeader={'Here you can add and see upcoming interviews'}
        />
      )}
    </div>
  );
}
