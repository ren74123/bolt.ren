import { create } from 'zustand';

interface DigitalHumanState {
  type: 'real' | 'clone' | null;
  baseId: string | null;
  voiceSamples: string[];
  selectedStyles: string[];
  modelConfig: any;
  creationProgress: number;
  currentStep: string;
  setType: (type: 'real' | 'clone') => void;
  setBaseId: (id: string) => void;
  addVoiceSample: (sample: string) => void;
  setSelectedStyles: (styles: string[]) => void;
  setModelConfig: (config: any) => void;
  updateProgress: (progress: number) => void;
  setCurrentStep: (step: string) => void;
  reset: () => void;
}

export const useDigitalHumanStore = create<DigitalHumanState>((set) => ({
  type: null,
  baseId: null,
  voiceSamples: [],
  selectedStyles: [],
  modelConfig: null,
  creationProgress: 0,
  currentStep: 'type',
  setType: (type) => set({ type }),
  setBaseId: (id) => set({ baseId: id }),
  addVoiceSample: (sample) => 
    set((state) => ({ 
      voiceSamples: [...state.voiceSamples, sample],
      creationProgress: Math.min(100, state.creationProgress + 20)
    })),
  setSelectedStyles: (styles) => set({ selectedStyles: styles }),
  setModelConfig: (config) => set({ modelConfig: config }),
  updateProgress: (progress) => set({ creationProgress: progress }),
  setCurrentStep: (step) => set({ currentStep: step }),
  reset: () => set({
    type: null,
    baseId: null,
    voiceSamples: [],
    selectedStyles: [],
    modelConfig: null,
    creationProgress: 0,
    currentStep: 'type'
  })
}));
