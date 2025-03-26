import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { generateImage } from '../lib/ai';

interface AIModel {
  id: string;
  name: string;
  type: 'text-to-image' | '3d-scene';
  description: string;
  parameters: Record<string, any>;
  status: 'active' | 'inactive' | 'maintenance';
}

interface GenerationResult {
  id: string;
  image_url: string;
  metadata: Record<string, any>;
}

interface AIState {
  models: AIModel[];
  loading: boolean;
  error: string | null;
  loadModels: () => Promise<void>;
  generateImage: (prompt: string, modelId: string, options?: Record<string, any>) => Promise<GenerationResult>;
}

export const useAIStore = create<AIState>((set) => ({
  models: [],
  loading: false,
  error: null,

  loadModels: async () => {
    try {
      set({ loading: true, error: null });

      const { data: models, error } = await supabase
        .from('ai_models')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;

      set({ models, loading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : '加载模型失败',
        loading: false 
      });
    }
  },

  generateImage: async (prompt, modelId, options = {}) => {
    try {
      set({ loading: true, error: null });
      const result = await generateImage(prompt, options);
      set({ loading: false });
      return result;
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : '生成失败',
        loading: false 
      });
      throw err;
    }
  }
}));
