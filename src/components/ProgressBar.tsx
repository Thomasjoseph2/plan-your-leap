import React from 'react';

interface ProgressBarProps {
  progress: number;
  showText?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  showText = true, 
  className = "" 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {showText && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">
            Progress
          </span>
          <span className="text-sm font-bold text-primary">
            {Math.round(progress)}%
          </span>
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
        <div 
          className="progress-fill h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
      {showText && progress > 0 && (
        <p className="text-xs text-muted-foreground text-center">
          {progress >= 75 ? "Amazing work! Keep it going! 🔥" :
           progress >= 50 ? "You're doing great! 💪" :
           progress >= 25 ? "Great start! Keep the momentum!" :
           "Every step counts! 🌟"}
        </p>
      )}
    </div>
  );
};