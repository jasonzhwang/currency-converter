import styles from "./InputModal.module.scss";

interface InputModalProps {
  isOpen: boolean;
  currency: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function InputModal({
  isOpen,
  currency,
  inputValue,
  onInputChange,
  onConfirm,
  onCancel,
}: InputModalProps) {
  if (!isOpen) return null;

  const handleNumberClick = (num: number) => {
    onInputChange(inputValue + num.toString());
  };

  const handleDelete = () => {
    onInputChange(inputValue.slice(0, -1));
  };

  const handleClear = () => {
    onInputChange("");
  };

  const handleDecimal = () => {
    if (!inputValue.includes(".")) {
      onInputChange(inputValue ? inputValue + "." : "0.");
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel || onConfirm}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Enter Amount ({currency})</h2>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className={styles.modalInput}
          placeholder="0.00"
          autoFocus
        />

        {/* Number Pad */}
        <div className={styles.numberPad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button key={num} className={styles.numberBtn} onClick={() => handleNumberClick(num)}>
              {num}
            </button>
          ))}
          <button className={styles.decimalBtn} onClick={handleDecimal}>
            .
          </button>
          <button className={styles.deleteBtn} onClick={handleDelete}>
            Delete
          </button>
        </div>

        <div className={styles.modalButtons}>
          <button onClick={onCancel || onConfirm} className={styles.cancelBtn}>
            Cancel
          </button>
          <button onClick={handleClear} className={styles.clearBtn}>
            Clear
          </button>
          <button onClick={onConfirm} className={styles.confirmBtn}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
