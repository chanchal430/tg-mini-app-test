import styles from './EnergyBar.module.css';

type Props = {
  current: number;
  max: number;
};

const EnergyBar = ({ current, max }: Props) => {
  const percent = Math.min((current / max) * 100, 100);

  return (
    <div className={styles.wrapper}>
      <div className={styles.barBackground}>
        <div
          className={styles.barFill}
          style={{ width: `${percent}%` }}
        />
        <p className={styles.text}>
          {current}/{max}
        </p>
      </div>
    </div>
  );
};

export default EnergyBar;
