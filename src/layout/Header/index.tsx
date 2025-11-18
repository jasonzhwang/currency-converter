import styles from "./Header.module.scss";

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Convert</h1>
    </header>
  );
};

export default Header;
