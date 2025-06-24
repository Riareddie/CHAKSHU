/**
 * Currency utilities for Indian Rupee formatting
 */

export const formatCurrency = (amount: number): string => {
  if (amount === 0) return "₹0";

  // Handle negative amounts
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  // Format using Indian numbering system (lakhs and crores)
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(absoluteAmount);

  return isNegative ? `-${formatted}` : formatted;
};

export const formatCurrencyCompact = (amount: number): string => {
  if (amount === 0) return "₹0";

  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  let formatted: string;

  if (absoluteAmount >= 10000000) {
    // 1 crore
    formatted = `₹${(absoluteAmount / 10000000).toFixed(1)}Cr`;
  } else if (absoluteAmount >= 100000) {
    // 1 lakh
    formatted = `₹${(absoluteAmount / 100000).toFixed(1)}L`;
  } else if (absoluteAmount >= 1000) {
    // 1 thousand
    formatted = `₹${(absoluteAmount / 1000).toFixed(1)}K`;
  } else {
    formatted = `₹${absoluteAmount}`;
  }

  return isNegative ? `-${formatted}` : formatted;
};

export const parseCurrency = (value: string): number => {
  // Remove currency symbols and spaces
  const cleaned = value.replace(/[₹,\s]/g, "");
  return parseFloat(cleaned) || 0;
};

export const validateCurrencyInput = (
  value: string,
): { isValid: boolean; error?: string } => {
  if (!value || value.trim() === "") {
    return { isValid: true }; // Empty is valid (optional field)
  }

  const numericValue = parseCurrency(value);

  if (isNaN(numericValue)) {
    return { isValid: false, error: "Please enter a valid amount" };
  }

  if (numericValue < 0) {
    return { isValid: false, error: "Amount cannot be negative" };
  }

  if (numericValue > 100000000) {
    // 10 crores
    return { isValid: false, error: "Amount cannot exceed ₹10,00,00,000" };
  }

  return { isValid: true };
};

export const formatIndianNumber = (num: number): string => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export const getCurrencyInputProps = () => ({
  placeholder: "₹0",
  prefix: "₹",
  type: "text" as const,
});

export const formatCurrencyForInput = (amount: number | undefined): string => {
  if (!amount && amount !== 0) return "";
  return amount.toString();
};
