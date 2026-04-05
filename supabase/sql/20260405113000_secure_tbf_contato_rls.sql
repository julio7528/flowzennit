alter table public.tbf_contato enable row level security;

revoke all on public.tbf_contato from anon;
revoke all on public.tbf_contato from authenticated;
revoke all on public.tbf_contato from public;

grant insert on public.tbf_contato to anon;
grant insert on public.tbf_contato to authenticated;

revoke all on sequence public.tbf_contato_id_seq from anon;
revoke all on sequence public.tbf_contato_id_seq from authenticated;
revoke all on sequence public.tbf_contato_id_seq from public;

grant usage on sequence public.tbf_contato_id_seq to anon;
grant usage on sequence public.tbf_contato_id_seq to authenticated;

drop policy if exists "tbf_contato_insert_public_form" on public.tbf_contato;

create policy "tbf_contato_insert_public_form"
on public.tbf_contato
for insert
to anon, authenticated
with check (
  jsonb_typeof(dados_json) = 'object'
  and (dados_json ?& array['name', 'email', 'message'])
  and (dados_json - 'name' - 'email' - 'message') = '{}'::jsonb
  and jsonb_typeof(dados_json -> 'name') = 'string'
  and jsonb_typeof(dados_json -> 'email') = 'string'
  and jsonb_typeof(dados_json -> 'message') = 'string'
  and length(btrim(dados_json ->> 'name')) between 1 and 120
  and length(btrim(dados_json ->> 'email')) between 3 and 255
  and length(btrim(dados_json ->> 'message')) between 1 and 4000
  and lower(btrim(dados_json ->> 'email')) ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);
