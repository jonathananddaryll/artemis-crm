import styles from './StatusUpdateForm.module.scss';

export default function StatusUpdateForm({ title, setStatusFormToggle }) {
  return (
    <div className={styles.updateForm}>
      <form>
        <input type='text' value={title} />
      </form>
    </div>
  );
}
