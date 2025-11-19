import ConversionBoard from "@/components/ConversionBoard";
import { DEFAULT_CURRENCY, DEFAULT_AMOUNT } from "@/data/constants";

export default function Home() {
  return (
    <>
      <ConversionBoard initialBaseCurrency={DEFAULT_CURRENCY} initialAmount={DEFAULT_AMOUNT} />
    </>
  );
}
