import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { TypeSelectionStep } from './steps/TypeSelectionStep';
import { VoiceSamplingStep } from './steps/VoiceSamplingStep';
import { StyleSelectionStep } from './steps/StyleSelectionStep';
import { ModelCustomizationStep } from './steps/ModelCustomizationStep';
import { PersonalityReportStep } from './steps/PersonalityReportStep';

type Step = 'type' | 'voice' | 'style' | 'model' | 'report';

export function CreateDigitalHumanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('voice');
  const [type, setType] = useState<'real' | 'clone' | null>(null);
  const [voiceSamples, setVoiceSamples] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [modelConfig, setModelConfig] = useState(null);

  useEffect(() => {
    // 从路由状态中获取类型
    const state = location.state as { type: 'real' | 'clone' } | null;
    if (state?.type) {
      setType(state.type);
    } else {
      // 如果没有类型参数，返回到数字人页面
      navigate('/digital-human');
    }
  }, [location.state, navigate]);

  const handleBack = () => {
    const stepOrder: Step[] = ['voice', 'style', 'model', 'report'];
    const currentIndex = stepOrder.indexOf(currentStep);
    
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    } else {
      navigate('/digital-human');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'voice':
        return (
          <VoiceSamplingStep
            onComplete={(samples) => {
              setVoiceSamples(samples);
              setCurrentStep('style');
            }}
          />
        );
      case 'style':
        return (
          <StyleSelectionStep
            onComplete={(styles) => {
              setSelectedStyles(styles);
              setCurrentStep('model');
            }}
          />
        );
      case 'model':
        return (
          <ModelCustomizationStep
            selectedStyles={selectedStyles}
            onComplete={(config) => {
              setModelConfig(config);
              setCurrentStep('report');
            }}
          />
        );
      case 'report':
        return (
          <PersonalityReportStep
            type={type!}
            voiceSamples={voiceSamples}
            selectedStyles={selectedStyles}
            modelConfig={modelConfig}
            onComplete={() => navigate('/digital-human')}
            onAdjust={() => setCurrentStep('model')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={handleBack} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">创建数字人</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {renderStep()}
      </div>
    </div>
  );
}
