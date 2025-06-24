import { useState, useEffect } from "react";
import { formatCurrencyCompact } from "@/lib/currency";

interface CounterProps {
  end: number;
  duration: number;
  label: string;
  suffix?: string;
}

const Counter = ({ end, duration, label, suffix = "" }: CounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const startCount = 0;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      const currentCount = Math.floor(
        startCount + (end - startCount) * percentage,
      );
      setCount(currentCount);

      if (percentage < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [end, duration]);

  return (
    <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-100 dark:border-gray-600 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 animate-count-up">
      <div className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        {count.toLocaleString("en-IN")}
        {suffix}
      </div>
      <div className="text-gray-600 dark:text-white font-medium">
        {label}
      </div>
    </div>
  );
};

const StatsCounter = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Making India Safer, One Report at a Time
          </h2>
          <p className="text-xl text-gray-600 dark:text-white max-w-2xl mx-auto">
            Real-time impact of our collective fight against fraud
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Counter
            end={2450000}
            duration={2000}
            label="Total Reports Filed"
            suffix="+"
          />
          <Counter
            end={89000}
            duration={2500}
            label="Fraudsters Blocked"
            suffix="+"
          />
          <Counter
            end={15600000}
            duration={3000}
            label="Citizens Protected"
            suffix="+"
          />
          <div className="text-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-lg border border-gray-100 dark:border-gray-600 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 animate-count-up">
            <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
              ₹890Cr+
            </div>
            <div className="text-gray-600 dark:text-white font-medium">
              Money Saved
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
