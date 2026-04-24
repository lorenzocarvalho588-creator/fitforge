-- ============================================================
-- FITFORGE — Supabase Schema
-- Cole isso no SQL Editor do Supabase e execute
-- ============================================================

-- 1. Tabela de perfis de usuários
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text not null,
  goal text not null,           -- 'emagrecer' | 'hipertrofia' | 'condicionamento'
  level text not null,          -- 'iniciante' | 'intermediario' | 'avancado'
  restrictions text default '', -- alergias, lesões, etc.
  plan text default 'free',     -- 'free' | 'pro'
  created_at timestamptz default now()
);

-- 2. Planos de treino gerados por IA
create table if not exists public.workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan text not null,           -- JSON string com os treinos da semana
  week integer default 1,
  created_at timestamptz default now()
);

-- 3. Planos de dieta gerados por IA
create table if not exists public.diet_plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan text not null,           -- JSON string com o plano alimentar
  calories integer default 2000,
  created_at timestamptz default now()
);

-- 4. Registro de progresso (peso, notas)
create table if not exists public.progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  weight numeric(5,2),
  note text default '',
  date date default current_date
);

-- 5. Comunidade (posts)
create table if not exists public.community_posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  user_name text not null,
  content text not null,
  likes integer default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.workouts enable row level security;
alter table public.diet_plans enable row level security;
alter table public.progress enable row level security;
alter table public.community_posts enable row level security;

-- Profiles: só o próprio usuário pode ler/editar
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Workouts: só o dono acessa
create policy "Users own workouts" on public.workouts for all using (auth.uid() = user_id);

-- Diet plans: só o dono acessa
create policy "Users own diet plans" on public.diet_plans for all using (auth.uid() = user_id);

-- Progress: só o dono acessa
create policy "Users own progress" on public.progress for all using (auth.uid() = user_id);

-- Community: todos leem, autenticados postam
create policy "Anyone reads posts" on public.community_posts for select using (true);
create policy "Auth users post" on public.community_posts for insert with check (auth.uid() = user_id);
