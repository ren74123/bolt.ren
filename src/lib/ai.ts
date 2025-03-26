import { supabase } from './supabase';

interface GenerationOptions {
  style?: string;
  styleStrength?: number;
  negativePrompt?: string;
  tags?: string[];
  visibility?: 'public' | 'private' | 'followers';
}

export async function generateImage(prompt: string, options: GenerationOptions = {}) {
  try {
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    if (!session) throw new Error('请先登录');

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();

    if (profileError) throw profileError;
    if (!profile) throw new Error('用户资料不存在');

    // Create generation prompt record
    const { data: newPrompt, error: promptError } = await supabase
      .from('generation_prompts')
      .insert({
        user_id: session.user.id,
        prompt,
        parameters: options,
        status: 'processing'
      })
      .select()
      .single();

    if (promptError) throw promptError;

    // For development, generate a random art image URL
    const imageUrl = `https://source.unsplash.com/random/1024x1024?art=${Date.now()}`;

    // Create generation result
    const { data: result, error: resultError } = await supabase
      .from('generation_results')
      .insert({
        prompt_id: newPrompt.id,
        image_url: imageUrl,
        metadata: {
          style: options.style,
          styleStrength: options.styleStrength,
          tags: options.tags
        }
      })
      .select()
      .single();

    if (resultError) throw resultError;

    // Update prompt status
    await supabase
      .from('generation_prompts')
      .update({ status: 'completed' })
      .eq('id', newPrompt.id);

    // Save to content_items for gallery display
    const { error: contentError } = await supabase
      .from('content_items')
      .insert({
        creator_id: profile.id, // Use profile.id instead of session.user.id
        title: prompt,
        description: `使用 ${options.style || '默认'} 风格创作`,
        type: 'image',
        content_url: imageUrl,
        metadata: {
          prompt,
          style: options.style,
          styleStrength: options.styleStrength,
          tags: options.tags
        },
        visibility: options.visibility || 'public'
      });

    if (contentError) throw contentError;

    return result;
  } catch (err) {
    console.error('Image generation error:', err);
    throw err;
  }
}
