import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  description: string;
}

interface StepProgressProps {
  steps: Step[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
}

export function StepProgress({ steps, currentStep, onStepClick }: StepProgressProps) {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="px-4 py-6">
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-6 right-6 h-0.5 bg-gray-200">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${(currentIndex / (steps.length - 1)) * 100}%`
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <button
                key={step.id}
                onClick={() => onStepClick?.(step.id)}
                className="flex flex-col items-center"
                disabled={index > currentIndex}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted
                      ? 'bg-primary border-primary text-white'
                      : isCurrent
                      ? 'border-primary bg-white text-primary'
                      : 'border-gray-200 bg-white text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-primary' : 'text-gray-600'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 max-w-[100px]">
                    {step.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
