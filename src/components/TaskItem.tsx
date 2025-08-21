import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Confetti } from '@/components/ui/confetti';
import { CheckCircle2 } from 'lucide-react';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    estimatedTime?: string;
  };
  onToggle: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleToggle = () => {
    if (!task.completed) {
      setShowConfetti(true);
    }
    onToggle(task.id);
  };

  const motivationalMessages = [
    "Great job! Keep the streak alive ✨",
    "You're crushing it! 💪",
    "Amazing progress! 🌟",
    "One step closer to your goal! 🎯",
    "Consistency is key - well done! 🔥"
  ];

  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-lg border transition-all duration-300
      ${task.completed 
        ? 'bg-success/5 border-success/20' 
        : 'bg-card border-border hover:border-primary/30'
      }
    `}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={handleToggle}
        className="mt-1"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className={`
            font-medium transition-all duration-300
            ${task.completed 
              ? 'text-success line-through' 
              : 'text-foreground'
            }
          `}>
            {task.title}
          </h4>
          {task.completed && (
            <CheckCircle2 className="w-4 h-4 text-success animate-bounce" />
          )}
        </div>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {task.description}
          </p>
        )}
        
        {task.estimatedTime && (
          <p className="text-xs text-muted-foreground mt-2">
            Estimated time: {task.estimatedTime}
          </p>
        )}
        
        {task.completed && (
          <p className="text-xs text-success font-medium mt-2">
            {randomMessage}
          </p>
        )}
      </div>

      <Confetti 
        trigger={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
    </div>
  );
};