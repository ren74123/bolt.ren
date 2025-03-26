import { create } from 'zustand';

interface Gene {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  traits: {
    name: string;
    value: number;
  }[];
  popularity: number;
}

interface CloneState {
  selectedTemplate: Template | null;
  geneRatio: number;
  selectedGenes: Record<string, number>;
  mutations: string[];
  currentStep: 'template' | 'mix' | 'lab' | 'preview';
  hasConflicts: boolean;
  setTemplate: (template: Template | null) => void;
  setGeneRatio: (ratio: number) => void;
  updateGene: (geneId: string, value: number) => void;
  addMutation: (mutationId: string) => void;
  removeMutation: (mutationId: string) => void;
  setStep: (step: 'template' | 'mix' | 'lab' | 'preview') => void;
  reset: () => void;
}

export const useCloneStore = create<CloneState>((set) => ({
  selectedTemplate: null,
  geneRatio: 50,
  selectedGenes: {},
  mutations: [],
  currentStep: 'template',
  hasConflicts: false,

  setTemplate: (template) => set({ selectedTemplate: template }),
  
  setGeneRatio: (ratio) => set({ geneRatio: ratio }),
  
  updateGene: (geneId, value) => set((state) => ({
    selectedGenes: {
      ...state.selectedGenes,
      [geneId]: value
    }
  })),
  
  addMutation: (mutationId) => set((state) => ({
    mutations: [...state.mutations, mutationId]
  })),
  
  removeMutation: (mutationId) => set((state) => ({
    mutations: state.mutations.filter(id => id !== mutationId)
  })),
  
  setStep: (step) => set({ currentStep: step }),
  
  reset: () => set({
    selectedTemplate: null,
    geneRatio: 50,
    selectedGenes: {},
    mutations: [],
    currentStep: 'template',
    hasConflicts: false
  })
}));
