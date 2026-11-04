-- Thêm môn học. Chạy một lần, sau file 20261022000000_init.sql. Dữ liệu cũ tự nhận 'math'.
alter table public.topics add column subject text not null default 'math' check (subject in ('math', 'tieng-viet'));
alter table public.exercises add column subject text not null default 'math' check (subject in ('math', 'tieng-viet'));
alter table public.topics drop constraint if exists topics_grade_position_key;
alter table public.topics add constraint topics_subject_grade_position_key unique (subject, grade, position);
create index exercises_subject_grade_idx on public.exercises (subject, grade);
