-- Add WeChat configuration to api_keys table
insert into api_keys (service, api_key)
values ('wechat', 'YOUR-WECHAT-APP-ID-HERE')
on conflict (service) do update
set api_key = excluded.api_key,
    updated_at = now();
