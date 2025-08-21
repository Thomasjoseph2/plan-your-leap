import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import { MotivationalQuote } from '@/components/MotivationalQuote';
import { TaskItem } from '@/components/TaskItem';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  BookOpen, 
  TrendingUp, 
  LogOut, 
  Calendar,
  ChevronDown,
  ChevronRight,
  Target,
  Clock
} from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  estimatedTime?: string;
}

interface Day {
  _id: string;
  title: string;
  tasks: Task[];
}

interface Week {
  _id: string;
  title: string;
  subtitle?: string;
  progress: number;
  isExpanded: boolean;
  days: Day[];
}

interface Month {
  _id: string;
  title: string;
  progress: number;
  isExpanded: boolean;
  weeks: Week[];
}

interface Plan {
  _id: string;
  targetRole: string;
  skillLevel: string;
  totalProgress: number;
  months: Month[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plan, setPlan] = useState<Plan | null>(null);
  const [currentStreak, setCurrentStreak] = useState(3); // This would ideally come from backend

  const fetchPlans = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/plans', {
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming we only display the most recent plan for simplicity
        if (data.length > 0) {
          setPlan({ ...data[0], isExpanded: false }); // Initialize isExpanded for months/weeks
        }
      } else {
        toast({
          title: "Failed to fetch plans",
          description: "Please try again later.",
          variant: "destructive",
        });
        navigate('/login'); // Redirect if token is invalid or no plans
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Something went wrong while fetching plans.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [navigate, toast]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleMonth = (monthId: string) => {
    setPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        months: prev.months.map(month =>
          month._id === monthId ? { ...month, isExpanded: !month.isExpanded } : month
        )
      };
    });
  };

  const toggleWeek = (monthId: string, weekId: string) => {
    setPlan(prev => {
      if (!prev) return null;
      return {
        ...prev,
        months: prev.months.map(month =>
          month._id === monthId
            ? {
                ...month,
                weeks: month.weeks.map(week =>
                  week._id === weekId ? { ...week, isExpanded: !week.isExpanded } : week
                )
              }
            : month
        )
      };
    });
  };

  const handleTaskToggle = async (taskId: string) => {
    if (!plan) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Find the task and its parent IDs
    let updatedPlan = { ...plan };
    let foundTask = false;
    for (const month of updatedPlan.months) {
      for (const week of month.weeks) {
        for (const day of week.days) {
          const task = day.tasks.find(t => t._id === taskId);
          if (task) {
            task.completed = !task.completed;
            foundTask = true;
            
            try {
              const response = await fetch(`http://localhost:5000/api/plans/${plan._id}/${month._id}/${week._id}/${day._id}/${taskId}`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                  },
                  body: JSON.stringify({ completed: task.completed }),
                }
              );

              if (response.ok) {
                const updatedPlanFromServer = await response.json();
                setPlan(updatedPlanFromServer); // Update state with fresh data from server
                toast({
                  title: "Task Updated",
                  description: "Task completion status has been updated.",
                });
              } else {
                toast({
                  title: "Update Failed",
                  description: "Could not update task. Please try again.",
                  variant: "destructive",
                });
                // Revert task status if update fails
                task.completed = !task.completed;
                setPlan(updatedPlan); // Revert local state
              }
            } catch (error) {
              console.error('Error updating task:', error);
              toast({
                title: "Error",
                description: "Network error. Could not update task.",
                variant: "destructive",
              });
              // Revert task status if update fails
              task.completed = !task.completed;
              setPlan(updatedPlan); // Revert local state
            }
            break;
          }
        }
        if (foundTask) break;
      }
      if (foundTask) break;
    }
  };

  if (!plan) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading your plan...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold">Interview Prep</h2>
            <p className="text-xs text-muted-foreground">Planner</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <User className="w-4 h-4" />
            Profile
          </Button>
          <Button variant="default" className="w-full justify-start gap-3">
            <BookOpen className="w-4 h-4" />
            My Plans
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <TrendingUp className="w-4 h-4" />
            Progress
          </Button>
        </nav>

        <div className="pt-4 border-t border-border">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Here's your personalized journey 🎯
              </h1>
              <p className="text-motivational">
                {plan.targetRole} • {plan.skillLevel} Level
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold text-warning">{currentStreak} days 🔥</p>
            </div>
          </div>

          {/* Overall Progress */}
          <Card className="card-soft p-6 mb-6">
            <ProgressBar 
              progress={plan.totalProgress} 
              className="mb-4"
            />
            <p className="text-center text-sm text-muted-foreground">
              You've completed {plan.totalProgress}% — amazing work, keep it going!
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Content */}
          <div className="lg:col-span-2 space-y-4">
            {plan.months.map((month) => (
              <Card key={month._id} className="card-soft overflow-hidden">
                {/* Month Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleMonth(month._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {month.isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold">{month.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {month.weeks.length} weeks planned
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">{month.progress}%</p>
                      <div className="w-20 bg-muted rounded-full h-2 mt-1">
                        <div 
                          className="progress-fill h-full rounded-full"
                          style={{ width: `${month.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weeks (Expanded) */}
                {month.isExpanded && (
                  <div className="border-t border-border">
                    {month.weeks.map((week) => (
                      <div key={week._id} className="border-b border-border last:border-b-0">
                        <div 
                          className="p-4 pl-12 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => toggleWeek(month._id, week._id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {week.isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              )}
                              <div>
                                <h4 className="font-medium">{week.title}</h4>
                                <p className="text-sm text-muted-foreground">{week.subtitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{week.progress}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Days & Tasks (Expanded) */}
                        {week.isExpanded && (
                          <div className="p-4 pl-16 bg-muted/20 space-y-4">
                            {week.days.map((day) => (
                              <div key={day._id}>
                                <h5 className="font-medium text-sm mb-3 text-foreground">
                                  {day.title}
                                </h5>
                                <div className="space-y-2">
                                  {day.tasks.map((task) => (
                                    <TaskItem
                                      key={task._id}
                                      task={task}
                                      onToggle={handleTaskToggle}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            <MotivationalQuote />
            
            <Card className="card-soft p-6">
              <h3 className="font-semibold mb-4">Weekly Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Tasks Completed</span>
                  <span className="font-medium">12/15</span>
                </div>
                <ProgressBar progress={80} showText={false} />
                <p className="text-xs text-muted-foreground text-center">
                  3 days in a row! 🔥
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;