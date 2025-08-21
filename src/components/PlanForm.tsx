import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Rocket } from 'lucide-react';

interface PlanFormData {
  targetRole: string;
  skillLevel: string;
  timeInMonths: number;
  hoursPerDay: number;
}

interface PlanFormProps {
  onSubmit: (data: PlanFormData) => void;
}

export const PlanForm: React.FC<PlanFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PlanFormData>({
    targetRole: '',
    skillLevel: '',
    timeInMonths: 3,
    hoursPerDay: 2
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.targetRole && formData.skillLevel) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="card-soft p-8 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="targetRole" className="text-sm font-medium">
            Target Role
          </Label>
          <Input
            id="targetRole"
            placeholder="e.g., Node.js Developer"
            value={formData.targetRole}
            onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
            className="w-full"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skillLevel" className="text-sm font-medium">
            Current Skill Level
          </Label>
          <Select 
            value={formData.skillLevel} 
            onValueChange={(value) => setFormData({ ...formData, skillLevel: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeInMonths" className="text-sm font-medium">
            Available Time (Months)
          </Label>
          <Input
            id="timeInMonths"
            type="number"
            min="1"
            max="12"
            value={formData.timeInMonths}
            onChange={(e) => setFormData({ ...formData, timeInMonths: parseInt(e.target.value) || 1 })}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hoursPerDay" className="text-sm font-medium">
            Hours Per Day
          </Label>
          <Input
            id="hoursPerDay"
            type="number"
            min="0.5"
            max="8"
            step="0.5"
            value={formData.hoursPerDay}
            onChange={(e) => setFormData({ ...formData, hoursPerDay: parseFloat(e.target.value) || 1 })}
            className="w-full"
          />
        </div>

        <Button 
          type="submit" 
          className="btn-hero w-full flex items-center justify-center gap-2"
          disabled={!formData.targetRole || !formData.skillLevel}
        >
          <Rocket className="w-5 h-5" />
          Let's Go 🚀
        </Button>
      </form>
    </Card>
  );
};