/*
  # Add Initial AI Models

  1. Changes
    - Insert initial AI models for text-to-image and 3D scene generation
    - Add default parameters and descriptions
*/

-- Insert initial AI models
insert into ai_models (name, type, description, parameters, status)
values
  (
    'Stable Diffusion XL',
    'text-to-image',
    '高质量图像生成模型，支持多种艺术风格和真实场景',
    jsonb_build_object(
      'width', 1024,
      'height', 1024,
      'num_inference_steps', 50,
      'guidance_scale', 7.5,
      'negative_prompt', '',
      'scheduler', 'euler_a'
    ),
    'active'
  ),
  (
    'DALL-E 3',
    'text-to-image',
    '擅长创意概念和艺术风格的图像生成',
    jsonb_build_object(
      'width', 1024,
      'height', 1024,
      'quality', 'standard',
      'style', 'vivid'
    ),
    'active'
  ),
  (
    'Midjourney V6',
    'text-to-image',
    '专注于高品质艺术创作和概念设计',
    jsonb_build_object(
      'version', 6,
      'quality', 2,
      'style', 'raw',
      'chaos', 0
    ),
    'active'
  ),
  (
    'NeRF Studio',
    '3d-scene',
    '基于神经辐射场的3D场景重建和生成',
    jsonb_build_object(
      'resolution', 256,
      'num_training_steps', 5000,
      'camera_type', 'perspective'
    ),
    'active'
  ),
  (
    'Point-E',
    '3d-scene',
    '快速3D模型生成和场景构建',
    jsonb_build_object(
      'resolution', 128,
      'points_per_batch', 1024,
      'noise_scale', 1.0
    ),
    'active'
  );
