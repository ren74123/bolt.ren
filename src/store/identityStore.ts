import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Gene {
  id: string;
  name: string;
  value: number;
  color: string;
}

interface Mutation {
  id: string;
  type: string;
  effect: Record<string, any>;
}

interface Identity {
  id: string;
  type: 'real' | 'clone';
  baseId?: string;
  name: string;
  status: 'active' | 'inactive' | 'locked';
  creationProgress: number;
  genes: Gene[];
  mutations: Mutation[];
}

interface IdentityState {
  currentIdentity: Identity | null;
  identities: Identity[];
  loading: boolean;
  error: string | null;
  setCurrentIdentity: (identity: Identity | null) => void;
  loadIdentities: () => Promise<void>;
  createIdentity: (type: 'real' | 'clone', baseId?: string) => Promise<Identity>;
  updateGenes: (identityId: string, genes: Gene[]) => Promise<void>;
  applyMutation: (identityId: string, mutation: Omit<Mutation, 'id'>) => Promise<void>;
  switchIdentity: (identityId: string) => Promise<void>;
}

export const useIdentityStore = create<IdentityState>((set, get) => ({
  currentIdentity: null,
  identities: [],
  loading: false,
  error: null,

  setCurrentIdentity: (identity) => set({ currentIdentity: identity }),

  loadIdentities: async () => {
    try {
      set({ loading: true, error: null });

      const { data: identities, error } = await supabase
        .from('digital_identities')
        .select(`
          *,
          genes:identity_genes(*),
          mutations:identity_mutations(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ 
        identities: identities.map(identity => ({
          ...identity,
          genes: identity.genes || [],
          mutations: identity.mutations || []
        })),
        loading: false 
      });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : '加载失败',
        loading: false 
      });
    }
  },

  createIdentity: async (type, baseId) => {
    try {
      set({ loading: true, error: null });

      const { data: identity, error: createError } = await supabase
        .from('digital_identities')
        .insert({
          type,
          base_id: baseId,
          name: type === 'real' ? '真实身份' : '副本身份',
          creation_progress: 0
        })
        .select()
        .single();

      if (createError) throw createError;

      // Update local state
      set(state => ({
        identities: [...state.identities, { ...identity, genes: [], mutations: [] }],
        loading: false
      }));

      return identity;
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : '创建失败',
        loading: false 
      });
      throw err;
    }
  },

  updateGenes: async (identityId, genes) => {
    try {
      set({ loading: true, error: null });

      // Update genes in database
      const { error } = await supabase
        .from('identity_genes')
        .upsert(
          genes.map(gene => ({
            identity_id: identityId,
            ...gene
          }))
        );

      if (error) throw error;

      // Update local state
      set(state => ({
        identities: state.identities.map(identity =>
          identity.id === identityId
            ? { ...identity, genes }
            : identity
        ),
        currentIdentity: state.currentIdentity?.id === identityId
          ? { ...state.currentIdentity, genes }
          : state.currentIdentity,
        loading: false
      }));
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : '更新基因失败',
        loading: false 
      });
    }
  },

  applyMutation: async (identityId, mutation) => {
    try {
      set({ loading: true, error: null });

      const { data: newMutation, error } = await supabase
        .from('identity_mutations')
        .insert({
          identity_id: identityId,
          ...mutation
        })
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set(state => ({
        identities: state.identities.map(identity =>
          identity.id === identityId
            ? { ...identity, mutations: [...identity.mutations, newMutation] }
            : identity
        ),
        currentIdentity: state.currentIdentity?.id === identityId
          ? { ...state.currentIdentity, mutations: [...state.currentIdentity.mutations, newMutation] }
          : state.currentIdentity,
        loading: false
      }));
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : '应用突变失败',
        loading: false 
      });
    }
  },

  switchIdentity: async (identityId) => {
    try {
      set({ loading: true, error: null });

      const identity = get().identities.find(i => i.id === identityId);
      if (!identity) throw new Error('身份不存在');

      // Update current identity in database
      const { error } = await supabase
        .from('digital_identities')
        .update({ status: 'active' })
        .eq('id', identityId);

      if (error) throw error;

      // Deactivate other identities
      await supabase
        .from('digital_identities')
        .update({ status: 'inactive' })
        .neq('id', identityId);

      set({ 
        currentIdentity: identity,
        loading: false 
      });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : '切换身份失败',
        loading: false 
      });
    }
  }
}));
