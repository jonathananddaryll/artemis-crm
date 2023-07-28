import React from 'react';
import styles from './Timeline.module.css';

export default function Timeline({ timelines, timelinesLoading }) {
  return (
    <div className={styles.timelineContainer}>
      <p>Timeline</p>
      {timelinesLoading ? (
        <p>TIMELINE IS LOADING</p>
      ) : (
        <div className={styles.content}>
          {timelines.length > 0 && (
            <>
              {/* THIS IS WHERE THE LINES ARE WITH DOT IN THE MIDDLE ARE GONNA GO... I WAS THINKING I PROBABLY INCLUDE IT IN THE MAPPING AND THEN HAVE A BOX FOR EVERY MAP WITH THE DIV OF LINE AND BOX INSIDE IT */}
              <div className={styles.verticalLine}></div>
              <div className={styles.cardsContainer}>
                {timelines.map(timeline => (
                  <div key={timeline.id} className={styles.timelineCard}>
                    <p className={styles.textUpdateType}>
                      {timeline.update_type}
                    </p>
                    <p className={styles.textDescription}>
                      {timeline.description.substring(0, 35)}
                    </p>
                    <p className={styles.textDateCreated}>
                      {timeline.date_created}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
