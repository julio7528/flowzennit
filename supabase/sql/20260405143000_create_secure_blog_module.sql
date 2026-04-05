create or replace function public.is_blog_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tbf_controle_usuario
    where uid = auth.uid()
      and role = 'admin'
      and ativo is true
  );
$$;

create or replace function public.is_published_blog_post(target_post_id bigint)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.blog_posts
    where id = target_post_id
      and published is true
  );
$$;

create table if not exists public.blog_posts (
  id bigint generated always as identity primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  cover_image_url text not null,
  content_json jsonb not null default '{}'::jsonb,
  content_html text not null,
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  updated_by uuid not null default auth.uid() references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint blog_posts_title_length check (char_length(btrim(title)) between 3 and 180),
  constraint blog_posts_excerpt_length check (char_length(btrim(excerpt)) between 10 and 400),
  constraint blog_posts_cover_image_url_length check (char_length(btrim(cover_image_url)) between 10 and 2048),
  constraint blog_posts_content_html_length check (char_length(btrim(content_html)) >= 10)
);

create table if not exists public.blog_comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.blog_posts(id) on delete cascade,
  display_name text not null,
  comment_text text not null,
  visitor_fingerprint text not null,
  created_at timestamptz not null default now(),
  constraint blog_comments_display_name_length check (char_length(btrim(display_name)) between 2 and 80),
  constraint blog_comments_text_length check (char_length(btrim(comment_text)) between 2 and 1500),
  constraint blog_comments_fingerprint_format check (visitor_fingerprint ~ '^[0-9a-f]{64}$'),
  constraint blog_comments_single_comment_per_visitor unique (post_id, visitor_fingerprint)
);

create table if not exists public.blog_likes (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.blog_posts(id) on delete cascade,
  visitor_fingerprint text not null,
  created_at timestamptz not null default now(),
  constraint blog_likes_fingerprint_format check (visitor_fingerprint ~ '^[0-9a-f]{64}$'),
  constraint blog_likes_single_like_per_visitor unique (post_id, visitor_fingerprint)
);

create index if not exists blog_posts_published_idx
  on public.blog_posts (published, published_at desc, created_at desc);

create index if not exists blog_posts_slug_idx
  on public.blog_posts (slug);

create index if not exists blog_comments_post_created_idx
  on public.blog_comments (post_id, created_at asc);

create index if not exists blog_likes_post_created_idx
  on public.blog_likes (post_id, created_at asc);

create or replace function public.set_blog_post_audit_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    new.created_by := coalesce(new.created_by, auth.uid());
    new.updated_by := coalesce(new.updated_by, auth.uid());
    new.created_at := coalesce(new.created_at, now());
  else
    new.created_by := old.created_by;
    new.updated_by := auth.uid();
    new.created_at := old.created_at;
  end if;

  new.updated_at := now();

  if new.published is true and (tg_op = 'INSERT' or old.published is distinct from true or new.published_at is null) then
    new.published_at := coalesce(new.published_at, now());
  end if;

  if new.published is false then
    new.published_at := null;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_blog_posts_audit_fields on public.blog_posts;
create trigger trg_blog_posts_audit_fields
before insert or update on public.blog_posts
for each row
execute function public.set_blog_post_audit_fields();

alter table public.blog_posts enable row level security;
alter table public.blog_comments enable row level security;
alter table public.blog_likes enable row level security;

revoke all on public.blog_posts from anon, authenticated, public;
revoke all on public.blog_comments from anon, authenticated, public;
revoke all on public.blog_likes from anon, authenticated, public;

grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;

grant select on public.blog_comments to anon, authenticated;
grant insert on public.blog_comments to anon, authenticated;

grant select on public.blog_likes to anon, authenticated;
grant insert on public.blog_likes to anon, authenticated;

revoke all on sequence public.blog_posts_id_seq from anon, authenticated, public;
revoke all on sequence public.blog_comments_id_seq from anon, authenticated, public;
revoke all on sequence public.blog_likes_id_seq from anon, authenticated, public;

grant usage on sequence public.blog_posts_id_seq to authenticated;
grant usage on sequence public.blog_comments_id_seq to anon, authenticated;
grant usage on sequence public.blog_likes_id_seq to anon, authenticated;

drop policy if exists blog_posts_public_read_published on public.blog_posts;
create policy blog_posts_public_read_published
on public.blog_posts
for select
to anon, authenticated
using (published is true);

drop policy if exists blog_posts_admin_select_all on public.blog_posts;
create policy blog_posts_admin_select_all
on public.blog_posts
for select
to authenticated
using (public.is_blog_admin());

drop policy if exists blog_posts_admin_insert on public.blog_posts;
create policy blog_posts_admin_insert
on public.blog_posts
for insert
to authenticated
with check (
  public.is_blog_admin()
  and created_by = auth.uid()
  and updated_by = auth.uid()
);

drop policy if exists blog_posts_admin_update on public.blog_posts;
create policy blog_posts_admin_update
on public.blog_posts
for update
to authenticated
using (public.is_blog_admin())
with check (public.is_blog_admin());

drop policy if exists blog_posts_admin_delete on public.blog_posts;
create policy blog_posts_admin_delete
on public.blog_posts
for delete
to authenticated
using (public.is_blog_admin());

drop policy if exists blog_comments_public_read_published_posts on public.blog_comments;
create policy blog_comments_public_read_published_posts
on public.blog_comments
for select
to anon, authenticated
using (public.is_published_blog_post(post_id));

drop policy if exists blog_comments_public_insert_once on public.blog_comments;
create policy blog_comments_public_insert_once
on public.blog_comments
for insert
to anon, authenticated
with check (
  public.is_published_blog_post(post_id)
  and char_length(btrim(display_name)) between 2 and 80
  and char_length(btrim(comment_text)) between 2 and 1500
  and visitor_fingerprint ~ '^[0-9a-f]{64}$'
);

drop policy if exists blog_likes_public_read_published_posts on public.blog_likes;
create policy blog_likes_public_read_published_posts
on public.blog_likes
for select
to anon, authenticated
using (public.is_published_blog_post(post_id));

drop policy if exists blog_likes_public_insert_once on public.blog_likes;
create policy blog_likes_public_insert_once
on public.blog_likes
for insert
to anon, authenticated
with check (
  public.is_published_blog_post(post_id)
  and visitor_fingerprint ~ '^[0-9a-f]{64}$'
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-media',
  'blog-media',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists blog_media_public_read on storage.objects;
create policy blog_media_public_read
on storage.objects
for select
to public
using (bucket_id = 'blog-media');

drop policy if exists blog_media_admin_insert on storage.objects;
create policy blog_media_admin_insert
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'blog-media'
  and public.is_blog_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists blog_media_admin_update on storage.objects;
create policy blog_media_admin_update
on storage.objects
for update
to authenticated
using (
  bucket_id = 'blog-media'
  and public.is_blog_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'blog-media'
  and public.is_blog_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists blog_media_admin_delete on storage.objects;
create policy blog_media_admin_delete
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'blog-media'
  and public.is_blog_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);
