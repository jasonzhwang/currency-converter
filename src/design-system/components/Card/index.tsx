import { ReactNode } from "react";
import styles from "./Card.module.scss";

interface CardProps {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = "", interactive = false }) => {
  const interactiveClass = interactive ? styles.interactive : "";
  return <div className={`${styles.card} ${interactiveClass} ${className}`.trim()}>{children}</div>;
};

export default Card;
