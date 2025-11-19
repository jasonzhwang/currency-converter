import styles from "./CurrencyCard.module.scss";
import Card from "@/design-system/components/Card";
import { FLAG_IMAGE_SIZE, EDIT_BUTTON_SIZE, DECIMAL_PLACES } from "@/data/constants";
import { CurrencyCardProps } from "@/types/conversion.types";
import { flagImageFor, countryCodeFor } from "@/utils/conversionHelper";
import { EMPTY_VALUE } from "@/data/constants";

export default function CurrencyCard({
  country,
  baseCurrency,
  amount = 0,
  conversion,
  currencies = [],
  isBase = false,
  onCurrencyChange,
  onEditAmount,
  onViewChart,
  formatCurrency,
}: CurrencyCardProps) {
  const displayAmount = isBase ? amount : conversion?.value;
  const displayRate = conversion?.rate;
  const flagImage = flagImageFor(country);

  return (
    <Card>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.flag}>
            {flagImage ? (
              <img src={flagImage} alt={country} width={FLAG_IMAGE_SIZE} height={FLAG_IMAGE_SIZE} />
            ) : (
              <span>{countryCodeFor(country)}</span>
            )}
          </div>

          <div className={styles.info}>
            {isBase ? (
              <select
                value={country}
                onChange={(e) => onCurrencyChange?.(e.target.value)}
                className={styles.currencySelect}
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            ) : (
              <div className={styles.code}>{country}</div>
            )}
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.valueWrapper}>
            <div className={styles.amount}>
              {displayAmount !== undefined ? formatCurrency(displayAmount, country) : EMPTY_VALUE}
            </div>
            {!isBase && (
              <div className={styles.rate}>
                1 {baseCurrency} = {displayRate?.toFixed(DECIMAL_PLACES) || EMPTY_VALUE} {country}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditAmount();
            }}
            className={styles.editBtn}
            aria-label="Edit amount"
          >
            <img
              src="/images/num-input.png"
              alt="Edit"
              width={EDIT_BUTTON_SIZE}
              height={EDIT_BUTTON_SIZE}
            />
          </button>
        </div>
      </div>
    </Card>
  );
}
