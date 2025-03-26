/*
  # Add WeChat API Key

  1. Changes
    - Add WeChat API key to api_keys table
    - Use DO block to handle existing key

  2. Security
    - Only authenticated users can read API keys
*/

-- Add WeChat API key if it doesn't exist
do $$
begin
  if not exists (
    select 1 from api_keys
    where service = 'wechat'
  ) then
    -- Insert new key
    insert into api_keys (service, api_key)
    values ('wechat', 'wx1234567890abcdef');
  else
    -- Update existing key
    update api_keys
    set api_key = 'wx1234567890abcdef',
        updated_at = now()
    where service = 'wechat';
  end if;
end $$;
