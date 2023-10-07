import React, { useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { useDispatch } from 'react-redux';
import { updateJobInfo } from '../../../../../reducers/BoardReducer';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Button from '../../../../layout/Button/Button';
import styles from './JobInfoTab.module.scss';

export default function JobInfoTab({ selectedJob, selectedBoard_userId }) {
  const [formData, setFormData] = useState({
    id: selectedJob.id,
    company: selectedJob.company,
    job_title: selectedJob.job_title,
    location: selectedJob.location,
    rate_of_pay: selectedJob.rate_of_pay ?? '',
    job_url: selectedJob.job_url ?? ''
  });

  // Deconstruct formData
  const { id, company, job_title, location, rate_of_pay, job_url } = formData;

  const [showUrl, setShowUrl] = useState(selectedJob.job_url !== '');
  const [noteDesc, setNoteDesc] = useState(selectedJob.description ?? '');
  const { session } = useSession();
  const dispatch = useDispatch();

  // onChange Hander
  const onChangeHandler = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmitHandler = async e => {
    e.preventDefault();

    const formD = {
      company: company,
      job_title: job_title,
      location: location,
      rate_of_pay: rate_of_pay !== '' ? rate_of_pay : null,
      job_url: job_url,
      description: noteDesc,
      job_id: id,
      selectedBoard_userId: selectedBoard_userId,
      token: await session.getToken()
    };

    // dispatch the updateCall
    dispatch(updateJobInfo(formD));

    // Show the Clickable URL
    if (formD.job_url !== '') setShowUrl(true);

    // Dont clear the form
  };

  // For the Description Box
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
              <label htmlFor='company'>Company</label>
              <input
                type='text'
                name='company'
                id='company'
                value={company}
                placeholder={company}
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='job_title'>Job Title</label>
              <input
                type='text'
                name='job_title'
                id='job_title'
                value={job_title}
                placeholder={job_title}
                onChange={e => onChangeHandler(e)}
              />
            </div>
          </div>
          <div className={styles.formFlex}>
            <div className={styles.formGroup}>
              <label htmlFor='location'>Location</label>
              <input
                type='text'
                name='location'
                id='location'
                value={location}
                placeholder={location}
                onChange={e => onChangeHandler(e)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor='rate_of_pay'>Salary</label>
              <input
                type='number'
                name='rate_of_pay'
                id='rate_of_pay'
                value={rate_of_pay}
                placeholder={rate_of_pay !== '' ? rate_of_pay : 'Add Salary'}
                onChange={e => onChangeHandler(e)}
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor='job_url'>Job URL</label>
            {!showUrl ? (
              <input
                type='text'
                name='job_url'
                id='job_url'
                value={job_url}
                placeholder={job_url !== '' ? job_url : 'Add URL'}
                onChange={e => onChangeHandler(e)}
              />
            ) : (
              <div className={styles.urlBox}>
                <a href={`${job_url}`} target='_blank'>
                  {job_url}
                </a>
                <button onClick={() => setShowUrl(false)}>
                  <i className='bi bi-pencil'></i>
                </button>
              </div>
            )}
          </div>
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
