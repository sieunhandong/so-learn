-- So-Learn: bảng dữ liệu và chính sách bảo mật (RLS)
-- Chạy file này một lần trong Supabase Dashboard > SQL Editor, trước file seed.sql.

-- ---------------------------------------------------------------------------
-- Người dùng (phụ huynh): mỗi tài khoản Supabase Auth có một dòng ở đây
-- ---------------------------------------------------------------------------
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- Tự tạo dòng public.users khi phụ huynh đăng ký
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email) values (new.id, coalesce(new.email, ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Hồ sơ học sinh, thuộc về một phụ huynh
-- ---------------------------------------------------------------------------
create table public.students (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 40),
  grade smallint not null check (grade between 1 and 5),
  avatar text not null default 'sun',
  created_at timestamptz not null default now()
);
create index students_parent_id_idx on public.students (parent_id);

-- ---------------------------------------------------------------------------
-- Bài học (chủ đề) theo lớp, kèm phần "Cùng học" ở đầu bài
-- ---------------------------------------------------------------------------
create table public.topics (
  id text primary key,
  grade smallint not null check (grade between 1 and 5),
  chapter_number smallint not null,
  chapter_title text not null,
  position smallint not null,
  title text not null,
  mark text not null,
  description text not null,
  intro jsonb not null default '[]'::jsonb,
  unique (grade, position)
);

-- ---------------------------------------------------------------------------
-- Ngân hàng câu hỏi
-- ---------------------------------------------------------------------------
create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  grade smallint not null check (grade between 1 and 5),
  topic text not null references public.topics (id) on delete cascade,
  position smallint not null,
  question text not null,
  answer text not null,
  options jsonb not null,
  type text not null default 'multiple_choice' check (type in ('multiple_choice', 'drag_drop', 'fill_blank')),
  difficulty smallint not null default 1 check (difficulty between 1 and 3),
  visual jsonb,
  explain text not null default '',
  image_url text,
  audio_url text
);
create index exercises_topic_position_idx on public.exercises (topic, position);

-- ---------------------------------------------------------------------------
-- Tiến độ: mỗi lần bé chọn một đáp án là một dòng
-- ---------------------------------------------------------------------------
create table public.progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  exercise_id uuid not null references public.exercises (id) on delete cascade,
  is_correct boolean not null,
  time_spent integer not null default 0 check (time_spent >= 0),
  created_at timestamptz not null default now()
);
create index progress_student_created_idx on public.progress (student_id, created_at);
create index progress_exercise_idx on public.progress (exercise_id);

-- ---------------------------------------------------------------------------
-- Huy hiệu, mỗi loại chỉ nhận một lần
-- ---------------------------------------------------------------------------
create table public.badges (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  badge_type text not null,
  earned_at timestamptz not null default now(),
  unique (student_id, badge_type)
);

-- ---------------------------------------------------------------------------
-- Quyền truy cập bảng cho vai trò của Supabase (RLS bên dưới lọc tiếp từng dòng)
-- ---------------------------------------------------------------------------
grant select on public.topics, public.exercises to anon, authenticated;
grant select on public.users to authenticated;
grant select, insert, update, delete on public.students to authenticated;
grant select, insert on public.progress, public.badges to authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security: bật cho mọi bảng
-- ---------------------------------------------------------------------------
alter table public.users enable row level security;
alter table public.students enable row level security;
alter table public.topics enable row level security;
alter table public.exercises enable row level security;
alter table public.progress enable row level security;
alter table public.badges enable row level security;

-- Phụ huynh chỉ xem được dòng của chính mình
create policy "users: xem của mình" on public.users
  for select to authenticated using (id = (select auth.uid()));

-- Phụ huynh quản lý hồ sơ các bé của mình
create policy "students: xem của mình" on public.students
  for select to authenticated using (parent_id = (select auth.uid()));
create policy "students: thêm cho mình" on public.students
  for insert to authenticated with check (parent_id = (select auth.uid()));
create policy "students: sửa của mình" on public.students
  for update to authenticated using (parent_id = (select auth.uid())) with check (parent_id = (select auth.uid()));
create policy "students: xóa của mình" on public.students
  for delete to authenticated using (parent_id = (select auth.uid()));

-- Bài học và câu hỏi: ai cũng đọc được (kể cả khách chưa đăng nhập), không ai sửa từ app
create policy "topics: ai cũng đọc" on public.topics
  for select to anon, authenticated using (true);
create policy "exercises: ai cũng đọc" on public.exercises
  for select to anon, authenticated using (true);

-- Tiến độ và huy hiệu: chỉ của các bé thuộc phụ huynh đang đăng nhập; chỉ thêm, không sửa
create policy "progress: xem của bé mình" on public.progress
  for select to authenticated
  using (student_id in (select s.id from public.students s where s.parent_id = (select auth.uid())));
create policy "progress: ghi cho bé mình" on public.progress
  for insert to authenticated
  with check (student_id in (select s.id from public.students s where s.parent_id = (select auth.uid())));

create policy "badges: xem của bé mình" on public.badges
  for select to authenticated
  using (student_id in (select s.id from public.students s where s.parent_id = (select auth.uid())));
create policy "badges: ghi cho bé mình" on public.badges
  for insert to authenticated
  with check (student_id in (select s.id from public.students s where s.parent_id = (select auth.uid())));
