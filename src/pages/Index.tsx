import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlanForm } from '@/components/PlanForm';
import { Target, ArrowRight, Users, Award, TrendingUp } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

interface PlanFormData {
  targetRole: string;
  skillLevel: string;
  timeInMonths: number;
  hoursPerDay: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  const handlePlanSubmit = (data: PlanFormData) => {
    console.log('Plan data:', data);
    // In a real app, this would generate the plan via LangChain
    // For now, we'll redirect to dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const features = [
    {
      icon: Target,
      title: "Personalized Plans",
      description: "AI-generated study plans tailored to your goals and timeline"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Visual progress tracking with motivational streaks and milestones"
    },
    {
      icon: Award,
      title: "Stay Motivated",
      description: "Celebrate wins with rewards and encouraging messages"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-lg">Interview Prep Planner</span>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Button onClick={() => navigate('/dashboard')} variant="default">
              Dashboard
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate('/login')} variant="ghost">
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')} className="btn-hero">
                Get Started
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Professional growth journey" 
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-hero">
                  Your dream job is closer than you think
                </h1>
                <p className="text-motivational">
                  Let's plan your path together with personalized study plans, 
                  progress tracking, and the motivation you need to succeed.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setShowForm(true)}
                  className="btn-hero flex items-center gap-2"
                  size="lg"
                >
                  Start Your Journey
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline"
                  size="lg"
                >
                  I Have an Account
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">10k+</div>
                  <div className="text-sm text-muted-foreground">Success Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">94%</div>
                  <div className="text-sm text-muted-foreground">Job Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">3mo</div>
                  <div className="text-sm text-muted-foreground">Avg. Prep Time</div>
                </div>
              </div>
            </div>

            <div className="lg:pl-8">
              {showForm ? (
                <PlanForm onSubmit={handlePlanSubmit} />
              ) : (
                <div className="card-glow p-8 text-center space-y-6">
                  <Users className="w-12 h-12 text-primary mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Start?</h3>
                    <p className="text-muted-foreground">
                      Join thousands of successful job seekers who planned their way to success.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowForm(true)}
                    className="btn-hero w-full"
                  >
                    Create My Plan
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We combine AI-powered planning with motivational design to keep you on track
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-soft p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-glow rounded-full flex items-center justify-center mx-auto">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl font-bold">
            Start Your Success Story Today
          </h2>
          <p className="text-lg text-muted-foreground">
            Every expert was once a beginner. Your journey starts with a single step.
          </p>
          <Button 
            onClick={() => setShowForm(true)}
            className="btn-hero text-lg px-8 py-4"
          >
            Let's Go 🚀
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Interview Prep Planner. Built to help you succeed.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
