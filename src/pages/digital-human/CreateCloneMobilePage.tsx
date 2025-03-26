import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const templates = [
  {
    id: 'explorer',
    name: '探索者模板',
    description: '充满好奇心和冒险精神，善于发现新事物',
    preview: 'https://source.unsplash.com/random/400x400?explorer',
    traits: [
      { name: '好奇心', value: 85 },
      { name: '适应力', value: 75 },
      { name: '创造力', value: 70 }
    ]
  },
  {
    id: 'thinker',
    name: '思考者模板',
    description: '理性分析，深度思考，擅长解决复杂问题',
    preview: 'https://source.unsplash.com/random/400x400?thinker',
    traits: [
      { name: '逻辑思维', value: 90 },
      { name: '专注力', value: 80 },
      { name: '分析能力', value: 85 }
    ]
  },
  {
    id: 'creator',
    name: '创造者模板',
    description: '富有想象力和创意，善于艺术表达',
    preview: 'https://source.unsplash.com/random/400x400?creator',
    traits: [
      { name: '创造力', value: 95 },
      { name: '艺术感', value: 85 },
      { name: '表现力', value: 80 }
    ]
  }
];

export function CreateCloneMobilePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'template' | 'params' | 'confirm'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [parameters, setParameters] = useState({
    personality: 50,
    intelligence: 50,
    creativity: 50,
    sociability: 50
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-30">
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate('/digital-human')} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">创建副本数字人</h1>
          <div className="w-10" />
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${step === 'template' ? 33 : step === 'params' ? 66 : 100}%` }}
          />
        </div>
      </div>

      <div className="pt-[72px] pb-20">
        {step === 'template' && (
          <div className="p-4 space-y-4">
            {/* Template List */}
            {templates.map(template => (
              <button
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  setStep('params');
                }}
                className="w-full bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <img
                  src={template.preview}
                  alt={template.name}
                  className="w-full aspect-video object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                  <div className="space-y-2">
                    {template.traits.map(trait => (
                      <div key={trait.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{trait.name}</span>
                          <span className="text-primary">{trait.value}%</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${trait.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 'params' && (
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              {Object.entries(parameters).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">
                      {key === 'personality' ? '性格特征' :
                       key === 'intelligence' ? '智力水平' :
                       key === 'creativity' ? '创造能力' :
                       '社交能力'}
                    </span>
                    <span className="text-primary">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setParameters(prev => ({
                      ...prev,
                      [key]: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'confirm' && (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-xl p-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2">选择模板</h3>
                <p className="text-gray-600">
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">参数设置</h3>
                <div className="space-y-2">
                  {Object.entries(parameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">
                        {key === 'personality' ? '性格特征' :
                         key === 'intelligence' ? '智力水平' :
                         key === 'creativity' ? '创造能力' :
                         '社交能力'}
                      </span>
                      <span className="text-primary">{value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={() => {
            if (step === 'template') {
              setStep('params');
            } else if (step === 'params') {
              setStep('confirm');
            } else {
              navigate('/digital-human');
            }
          }}
          className="w-full py-3 bg-primary text-white rounded-xl font-medium"
        >
          {step === 'confirm' ? '完成创建' : '下一步'}
        </button>
      </div>
    </div>
  );
}
