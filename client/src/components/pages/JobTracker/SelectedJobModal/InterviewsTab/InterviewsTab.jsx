import React from 'react';
import styles from './InterviewsTab.module.scss';
import Button from '../../../../layout/Button/Button';
import NoDataPlaceholder from '../../../../layout/NoDataPlaceholder/NoDataPlaceholder';
import noInterviews from '../../../../../assets/nointerviews.svg';
import timeSince from '../../../../../helpers/convertDate';

export default function InteviewTab({ interviews, completedInterviews }) {
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
      {interviews.length > 0 || completedInterviews.length > 0 ? (
        <>
          {interviews.length > 0 && (
            <div className={styles.interviewBox}>
              <p className={styles.interviewBoxHeaderText}>
                Upcoming Interviews
              </p>
              {interviews.map(interview => (
                <div key={interview.id} className={styles.interviewCard}>
                  <div className={styles.interviewCardFlexLeft}>
                    <p className={styles.titleText}>{interview.title}</p>
                  </div>
                  <div className={styles.interviewCardFlexMiddle}>
                    <p className={styles.categoryText}>{interview.category}</p>
                  </div>
                  <div className={styles.interviewCardFlexRight}>
                    <p className={styles.dateText}>
                      {timeSince(interview.start_date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {completedInterviews.length > 0 && (
            <div className={styles.interviewBox}>
              <p className={styles.interviewBoxHeaderText}>
                Completed Interviews
              </p>
              {completedInterviews.map(interview => (
                <div key={interview.id} className={styles.interviewCard}>
                  <div className={styles.interviewCardFlexLeft}>
                    <p className={styles.titleText}>{interview.title}</p>
                  </div>
                  <div className={styles.interviewCardFlexMiddle}>
                    <p className={styles.categoryText}>{interview.category}</p>
                  </div>
                  <div className={styles.interviewCardFlexRight}>
                    <p className={styles.dateText}>
                      {timeSince(interview.start_date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
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
