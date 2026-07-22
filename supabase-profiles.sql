-- ============================================================
-- EJECUTA TODO ESTO en Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabla de perfiles
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  role text default 'customer',
  avatar text,
  orders integer default 0,
  favorites integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Eliminar políticas viejas si existen (evita error al re-ejecutar)
drop policy if exists "Usuarios pueden ver su propio perfil" on public.profiles;
drop policy if exists "Usuarios pueden insertar su propio perfil" on public.profiles;
drop policy if exists "Usuarios pueden actualizar su propio perfil" on public.profiles;

create policy "Usuarios pueden ver su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuarios pueden insertar su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Usuarios pueden actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. Trigger: crea el perfil AUTOMÁTICAMENTE al registrarse
--    (funciona aunque el usuario aún no haya confirmado el email)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
