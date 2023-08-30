import React, { useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { useDispatch } from 'react-redux';
import styles from './JobInfoTab.module.scss';
import Button from '../../../../layout/Button/Button';
import TextEditor from '../../../../layout/TextEditor/TextEditor';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function JobInfoTab({
  selectedJob,
  selectedBoard_userId,
  jobId,
  updateJobInfo
}) {
  const [formData, setFormData] = useState({
    company: selectedJob.company,
    job_title: selectedJob.job_title,
    location: selectedJob.location,
    rate_of_pay:
      selectedJob.rate_of_pay !== null ? selectedJob.rate_of_pay : '',
    job_url: selectedJob.job_url !== null ? selectedJob.job_url : ''
  });

  // Deconstruct formData
  const { company, job_title, location, rate_of_pay, job_url } = formData;

  const { session } = useSession();
  const dispatch = useDispatch();

  // onChange Hander
  const onChangeHandler = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const [noteDesc, setNoteDesc] = useState(
    selectedJob.description !== null ? selectedJob.description : ''
  );

  async function onSubmitHandler(e) {
    e.preventDefault();

    const formD = {
      company: company,
      job_title: job_title,
      location: location,
      rate_of_pay: rate_of_pay !== '' ? rate_of_pay : null,
      job_url: job_url,
      description: noteDesc,
      job_id: jobId,
      selectedBoard_userId: selectedBoard_userId,
      token: await session.getToken()
    };

    console.log(formD);
    // dispatch the updateCall
    dispatch(updateJobInfo(formD));

    // Dont clear the form
  }

  const toolbarOption = [
    [{ size: ['small', false, 'large', 'huge'] }],
    [{ header: 1 }, { header: 2 }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }]
  ];

  const module = {
    toolbar: toolbarOption
  };
  return (
    <div className={styles.container}>
      <div className={styles.jobInfoForm}>
        <form onSubmit={e => onSubmitHandler(e)}>
          <div className={styles.formFlex}>
            <div className={styles.formGroup}>
              <label>Company</label>
              <input
                type='text'
                name='company'
                value={company}
                placeholder={company}
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Job Title</label>
              <input
                type='text'
                name='job_title'
                value={job_title}
                placeholder={job_title}
                onChange={e => onChangeHandler(e)}
              />
            </div>
          </div>
          <div className={styles.formFlex}>
            <div className={styles.formGroup}>
              <label>Location</label>
              <input
                type='text'
                name='location'
                value={location}
                placeholder={location}
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Salary</label>
              <input
                type='number'
                name='rate_of_pay'
                value={rate_of_pay}
                placeholder={rate_of_pay !== '' ? rate_of_pay : 'Add Salary'}
                onChange={e => onChangeHandler(e)}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Job URL</label>
            <input
              type='text'
              name='job_url'
              value={job_url}
              placeholder={job_url !== '' ? job_url : 'Add URL'}
              onChange={e => onChangeHandler(e)}
            />
          </div>
          {/* <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              name='description'
              value={description}
              onChange={e => onChangeHandler(e)}
            />
          </div> */}
          <div className={styles.formGroup}>
            <label>Description</label>
            <ReactQuill
              modules={module}
              value={noteDesc}
              theme='snow'
              name='noteDesc'
              onChange={setNoteDesc}
            />
          </div>
          <Button
            type={'submit'}
            value={'Save'}
            color={'blue'}
            disabled={job_title === '' || company === '' || location === ''}
          />
        </form>
      </div>
    </div>
  );
}
