import React from 'react';
import { Card } from '@/components/ui/card';

const quotes = [
  "Consistency beats intensity.",
  "Every expert was once a beginner.",
  "Progress, not perfection.",
  "Your future self will thank you.",
  "Small steps lead to big changes.",
  "Believe in your journey.",
  "Growth happens outside your comfort zone.",
  "Success is a series of small wins."
];

export const MotivationalQuote: React.FC = () => {
  const todayQuote = quotes[new Date().getDay() % quotes.length];

  return (
    <Card className="card-soft p-6 text-center">
      <div className="pulse-motivational">
        <p className="text-lg font-medium text-foreground mb-2">
          "{todayQuote}"
        </p>
        <div className="w-12 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full"></div>
      </div>
    </Card>
  );
};