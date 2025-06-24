
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp } from 'lucide-react';

interface CurrencyConverterProps {
  initialAmount?: number;
  initialFromCurrency?: string;
  initialToCurrency?: string;
  onConversionChange?: (amount: number, fromCurrency: string, toCurrency: string, convertedAmount: number) => void;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  initialAmount = 0,
  initialFromCurrency = 'INR',
  initialToCurrency = 'USD',
  onConversionChange
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [fromCurrency, setFromCurrency] = useState(initialFromCurrency);
  const [toCurrency, setToCurrency] = useState(initialToCurrency);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [loading, setLoading] = useState(false);

  // Common currencies for fraud reporting
  const currencies = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' }
  ];

  // Mock exchange rates (in a real app, you'd fetch from an API)
  const mockExchangeRates: Record<string, Record<string, number>> = {
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.8, AUD: 0.018, CAD: 0.016, CHF: 0.011, CNY: 0.086, SGD: 0.016 },
    USD: { INR: 83.5, EUR: 0.92, GBP: 0.79, JPY: 150, AUD: 1.5, CAD: 1.36, CHF: 0.91, CNY: 7.2, SGD: 1.35 },
    EUR: { INR: 91, USD: 1.09, GBP: 0.86, JPY: 163, AUD: 1.63, CAD: 1.48, CHF: 0.99, CNY: 7.8, SGD: 1.47 },
    GBP: { INR: 105, USD: 1.27, EUR: 1.16, JPY: 189, AUD: 1.9, CAD: 1.72, CHF: 1.15, CNY: 9.1, SGD: 1.71 },
    JPY: { INR: 0.56, USD: 0.0067, EUR: 0.0061, GBP: 0.0053, AUD: 0.01, CAD: 0.0091, CHF: 0.0061, CNY: 0.048, SGD: 0.009 }
  };

  const fetchExchangeRate = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let rate = 1;
      if (fromCurrency !== toCurrency) {
        if (mockExchangeRates[fromCurrency]?.[toCurrency]) {
          rate = mockExchangeRates[fromCurrency][toCurrency];
        } else if (mockExchangeRates[toCurrency]?.[fromCurrency]) {
          rate = 1 / mockExchangeRates[toCurrency][fromCurrency];
        }
      }
      
      setExchangeRate(rate);
      const converted = amount * rate;
      setConvertedAmount(converted);
      onConversionChange?.(amount, fromCurrency, toCurrency, converted);
    } catch (error) {
      console.error('Failed to fetch exchange rate:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (amount > 0) {
      fetchExchangeRate();
    }
  }, [amount, fromCurrency, toCurrency]);

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setAmount(numValue);
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code;
  };

  const formatAmount = (value: number, currencyCode: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="space-y-2">
            <Label>From Currency</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>To Currency</Label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Converted Amount</Label>
            <div className="flex items-center gap-2">
              <Input
                value={convertedAmount.toFixed(2)}
                readOnly
                className="bg-gray-50"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={fetchExchangeRate}
                disabled={loading}
                className="shrink-0"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {amount > 0 && exchangeRate > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Exchange Rate:</strong> 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </p>
            <p className="text-sm text-blue-800 mt-1">
              <strong>Conversion:</strong> {formatAmount(amount, fromCurrency)} = {formatAmount(convertedAmount, toCurrency)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;
