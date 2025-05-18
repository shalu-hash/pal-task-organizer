
import React, { useState } from 'react';
import { Filter, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';

interface TaskFilterProps {
  onFilterChange: (filters: TaskFilters) => void;
}

export interface TaskFilters {
  showCompleted: boolean;
  dueDateFrom: Date | null;
  dueDateTo: Date | null;
  priorityLevels: Array<'low' | 'medium' | 'high'>;
  weightRange: [number, number];
}

const TaskFilter: React.FC<TaskFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<TaskFilters>({
    showCompleted: true,
    dueDateFrom: null,
    dueDateTo: null,
    priorityLevels: ['low', 'medium', 'high'],
    weightRange: [1, 5]
  });
  
  const [open, setOpen] = useState(false);
  
  const updateFilters = (partialFilters: Partial<TaskFilters>) => {
    const updatedFilters = { ...filters, ...partialFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  const togglePriorityLevel = (level: 'low' | 'medium' | 'high') => {
    const currentLevels = [...filters.priorityLevels];
    if (currentLevels.includes(level)) {
      // Don't allow removing all priorities - must have at least one
      if (currentLevels.length > 1) {
        updateFilters({ 
          priorityLevels: currentLevels.filter(l => l !== level) 
        });
      }
    } else {
      updateFilters({ 
        priorityLevels: [...currentLevels, level] 
      });
    }
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center">
          <Filter className="mr-2 h-4 w-4" />
          <span>Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <h4 className="font-medium">Task Filters</h4>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Completion</h5>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-completed" 
                checked={filters.showCompleted}
                onCheckedChange={(checked) => 
                  updateFilters({ showCompleted: !!checked })
                } 
              />
              <Label htmlFor="show-completed">Show completed tasks</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Priority</h5>
            <div className="flex flex-col space-y-2">
              {(['low', 'medium', 'high'] as const).map(level => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`priority-${level}`} 
                    checked={filters.priorityLevels.includes(level)}
                    onCheckedChange={() => togglePriorityLevel(level)}
                  />
                  <Label htmlFor={`priority-${level}`} className="capitalize">
                    {level}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Due date range</h5>
            <div className="flex flex-col space-y-2">
              <Calendar
                mode="range"
                selected={{
                  from: filters.dueDateFrom || undefined,
                  to: filters.dueDateTo || undefined
                }}
                onSelect={(range) => {
                  updateFilters({ 
                    dueDateFrom: range?.from || null,
                    dueDateTo: range?.to || null
                  });
                }}
                className="border rounded p-3 pointer-events-auto"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setFilters({
                  showCompleted: true,
                  dueDateFrom: null,
                  dueDateTo: null,
                  priorityLevels: ['low', 'medium', 'high'],
                  weightRange: [1, 5]
                });
                setOpen(false);
              }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TaskFilter;
