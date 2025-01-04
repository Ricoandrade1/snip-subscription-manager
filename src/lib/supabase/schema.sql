-- Criar tabela de planos
create table plans (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  price decimal not null,
  features text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de membros
create table members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  nickname text,
  phone text not null,
  nif text,
  birth_date date not null,
  passport text,
  citizen_card text,
  bi text,
  bank text not null,
  iban text not null,
  debit_date date not null,
  plan_id uuid references plans(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de pagamentos
create table payments (
  id uuid default gen_random_uuid() primary key,
  member_id uuid references members(id) not null,
  amount decimal not null,
  status text not null check (status in ('paid', 'pending', 'overdue')),
  payment_date timestamp with time zone not null,
  receipt_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar tabela de visitas
create table visits (
  id uuid default gen_random_uuid() primary key,
  member_id uuid references members(id) not null,
  service text not null,
  barber text not null,
  visit_date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Inserir planos padrão
insert into plans (title, price, features) values
  ('Basic', 30, ARRAY['Somente barba', '1 vez por semana', 'Agendamento prioritário']),
  ('Classic', 40, ARRAY['Somente cabelo', '1 vez por semana', 'Agendamento prioritário']),
  ('Business', 50, ARRAY['Cabelo e barba', '1 vez por semana', 'Agendamento VIP', 'Produtos exclusivos']);

-- Criar políticas de segurança (RLS)
alter table plans enable row level security;
alter table members enable row level security;
alter table payments enable row level security;
alter table visits enable row level security;

-- Políticas para planos (apenas leitura pública)
create policy "Planos são públicos para leitura"
  on plans for select
  to public
  using (true);

-- Políticas para membros (apenas usuários autenticados)
create policy "Membros são visíveis apenas para usuários autenticados"
  on members for select
  to authenticated
  using (true);

-- Políticas para pagamentos (apenas usuários autenticados)
create policy "Pagamentos são visíveis apenas para usuários autenticados"
  on payments for select
  to authenticated
  using (true);

-- Políticas para visitas (apenas usuários autenticados)
create policy "Visitas são visíveis apenas para usuários autenticados"
  on visits for select
  to authenticated
  using (true);