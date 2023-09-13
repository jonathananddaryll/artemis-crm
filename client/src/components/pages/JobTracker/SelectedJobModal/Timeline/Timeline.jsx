import React from 'react';
import timeSince from '../../../../../helpers/convertDate';
import loadingSpinner from '../../../../../assets/loadingSpinner.gif';
import Loader from '../../../../layout/Loader/Loader';
import styles from './Timeline.module.scss';

export default function Timeline({ timelines, timelinesLoading, dateCreated }) {
  return (
    <div className={styles.timelineContainer}>
      <h4 className={styles.textHeader}>Timeline</h4>
      {timelinesLoading ? (
        <Loader
          text={'Loading Timelines'}
          img={loadingSpinner}
          altText={'loading_timelines'}
          imageStyle={2}
          textStyle={2}
        />
      ) : (
        <div className={styles.timelineScroll}>
          {timelines.length > 0 && (
            <>
              {timelines.map(timeline => (
                <div key={timeline.id} className={styles.cardsContainer}>
                  <div className={styles.verticalLine}>
                    <div className={styles.topLine}></div>
                    <div className={styles.middleDot}></div>
                    <div className={styles.bottomLine}></div>
                  </div>
                  <div className={styles.box}>
                    <div key={timeline.id} className={styles.timelineCard}>
                      <h5 className={styles.textUpdateType}>
                        {timeline.update_type}
                      </h5>
                      <p className={styles.textDescription}>
                        {/* {timeline.description.substring(0, 30)} */}
                        {timeline.description}
                      </p>
                      <p className={styles.textDateCreated}>
                        {timeSince(timeline.date_created)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
          <div className={styles.cardsContainer}>
            <div className={styles.verticalLine}>
              <div className={styles.topLine}></div>
              <div className={styles.middleDot}></div>
              <div className={styles.bottomLine}></div>
            </div>
            <div className={styles.box}>
              <div className={styles.timelineCard}>
                <p className={styles.textUpdateType}>New Job Created</p>
                <p className={styles.textDescription}>You added this job</p>
                <p className={styles.textDateCreated}>
                  {timeSince(dateCreated)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
