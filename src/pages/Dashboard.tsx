import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import { MotivationalQuote } from '@/components/MotivationalQuote';
import { TaskItem } from '@/components/TaskItem';
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

// Mock data structure
const mockPlan = {
  targetRole: "Node.js Developer",
  skillLevel: "Intermediate",
  totalProgress: 35,
  months: [
    {
      id: 1,
      title: "Month 1: Fundamentals & Foundations",
      progress: 75,
      isExpanded: false,
      weeks: [
        {
          id: 1,
          title: "Week 1: JavaScript Mastery",
          subtitle: "Build your core foundation 💪",
          progress: 100,
          isExpanded: false,
          days: [
            {
              id: 1,
              title: "Day 1",
              tasks: [
                { id: '1', title: 'Review ES6+ features', description: 'Arrow functions, destructuring, promises', completed: true, estimatedTime: '2 hours' },
                { id: '2', title: 'Practice async/await patterns', completed: true, estimatedTime: '1.5 hours' },
                { id: '3', title: 'Build a simple promise chain', completed: false, estimatedTime: '1 hour' }
              ]
            }
          ]
        },
        {
          id: 2,
          title: "Week 2: Node.js Basics",
          subtitle: "Stay focused — Week 2 is all about mastery",
          progress: 60,
          isExpanded: false,
          days: []
        }
      ]
    },
    {
      id: 2,
      title: "Month 2: Advanced Concepts",
      progress: 20,
      isExpanded: false,
      weeks: []
    }
  ]
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState(mockPlan);
  const [currentStreak, setCurrentStreak] = useState(3);

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated');
    if (!isAuth) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const toggleMonth = (monthId: number) => {
    setPlan(prev => ({
      ...prev,
      months: prev.months.map(month =>
        month.id === monthId ? { ...month, isExpanded: !month.isExpanded } : month
      )
    }));
  };

  const toggleWeek = (monthId: number, weekId: number) => {
    setPlan(prev => ({
      ...prev,
      months: prev.months.map(month =>
        month.id === monthId
          ? {
              ...month,
              weeks: month.weeks.map(week =>
                week.id === weekId ? { ...week, isExpanded: !week.isExpanded } : week
              )
            }
          : month
      )
    }));
  };

  const handleTaskToggle = (taskId: string) => {
    // Update task completion state
    console.log(`Toggle task ${taskId}`);
  };

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
              <Card key={month.id} className="card-soft overflow-hidden">
                {/* Month Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleMonth(month.id)}
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
                      <div key={week.id} className="border-b border-border last:border-b-0">
                        <div 
                          className="p-4 pl-12 cursor-pointer hover:bg-muted/30 transition-colors"
                          onClick={() => toggleWeek(month.id, week.id)}
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
                              <div key={day.id}>
                                <h5 className="font-medium text-sm mb-3 text-foreground">
                                  {day.title}
                                </h5>
                                <div className="space-y-2">
                                  {day.tasks.map((task) => (
                                    <TaskItem
                                      key={task.id}
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