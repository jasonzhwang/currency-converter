import styles from "./InputModal.module.scss";
import { InputModalProps } from "@/types/modals.types";
import { useInputValidation } from "@/hooks/useInputValidation";
import { DECIMAL_PLACES } from "@/data/constants";

export default function InputModal({
  isOpen,
  currency,
  inputValue,
  onInputChange,
  onConfirm,
  onCancel,
}: InputModalProps) {
  const { isValid, shouldShowError } = useInputValidation(inputValue);

  if (!isOpen) return null;

  const handleNumberClick = (num: number) => {
    const newValue = inputValue + num.toString();
    // Limit decimal places to the defined constant
    const limitedValue = limitDecimalPlaces(newValue, DECIMAL_PLACES);
    onInputChange(limitedValue);
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

  // Limit input to specified decimal places
  const limitDecimalPlaces = (value: string, decimalPlaces: number): string => {
    if (!value.includes(".")) {
      return value;
    }
    const [integerPart, decimalPart] = value.split(".");
    if (decimalPart.length > decimalPlaces) {
      return integerPart + "." + decimalPart.slice(0, decimalPlaces);
    }
    return value;
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
        {shouldShowError && (
          <div className={styles.errorMessage}>Please enter a valid positive number</div>
        )}

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
          <button onClick={onConfirm} className={styles.confirmBtn} disabled={!isValid}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
