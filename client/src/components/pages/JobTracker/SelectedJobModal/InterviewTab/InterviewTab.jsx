import React from 'react';
import styles from './InterviewTab.module.scss';

export default function InteviewTab({ interviews }) {
  return (
    <div>
      <button>ADD INTERVIEW</button>
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
