import { cn } from "@/lib/utils";

interface Props {
    amount: number | undefined;
    className?: string;
}

const PriceFormatter = ({amount, className}: Props) => {
    const formattedPrice = new Number(amount).toLocaleString("en-US", {
        currency: "ZMW",
        style: "currency",
        maximumFractionDigits: 2,
    });
    return (
        <span className={cn("text-sm font-semibold text-dark", className)}
        >
            {formattedPrice}
        </span>
    );
}

export default PriceFormatter