-- Create public storage bucket for cached logos
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

-- Basic policy: allow authenticated users to read
do $$
begin
  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow read logos'
  ) then
    create policy "Allow read logos"
      on storage.objects for select
      using (
        bucket_id = 'logos'
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow insert logos for auth users'
  ) then
    create policy "Allow insert logos for auth users"
      on storage.objects for insert
      to authenticated
      with check (
        bucket_id = 'logos'
      );
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'Allow update logos for owner'
  ) then
    create policy "Allow update logos for owner"
      on storage.objects for update
      to authenticated
      using (
        bucket_id = 'logos'
      )
      with check (
        bucket_id = 'logos'
      );
  end if;
end $$;


