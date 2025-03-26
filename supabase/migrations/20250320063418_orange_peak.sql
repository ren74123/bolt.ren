/*
  # Add Stability AI API Key
  
  1. Update
    - Add actual Stability AI API key to api_keys table
    - Ensure proper security through RLS
*/

-- First check if the key already exists
do $$
begin
  if not exists (
    select 1 from api_keys
    where service = 'stability_ai'
  ) then
    -- Insert the API key if it doesn't exist
    insert into api_keys (service, api_key)
    values ('stability_ai', 'sk-VbEOcOboUw5XzQGA2aKfPx4wocROHxzRLzbMOzlehg2yZAxC');
  else
    -- Update existing key
    update api_keys
    set api_key = 'sk-VbEOcOboUw5XzQGA2aKfPx4wocROHxzRLzbMOzlehg2yZAxC',
        updated_at = now()
    where service = 'stability_ai';
  end if;
end $$;
