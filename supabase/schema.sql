-- Panduan koneksi Laut Otsuka
-- Jalankan di Supabase SQL Editor, lalu isi .env.local:
--   NEXT_PUBLIC_SUPABASE_URL
--   NEXT_PUBLIC_SUPABASE_ANON_KEY

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  wifi_ssid text not null,
  wifi_password text not null,
  qr_url text not null,
  qr_title_id text not null default 'Scan QR Code',
  qr_title_en text not null default 'Scan QR Code',
  qr_title_ja text not null default 'QRコードをスキャン',
  qr_subtitle_id text not null default 'Akses cepat ke panduan koneksi ruang rapat.',
  qr_subtitle_en text not null default 'Quick access to the meeting room connection guide.',
  qr_subtitle_ja text not null default '会議室の接続ガイドへのクイックアクセス。',
  installer_path text not null,
  installer_filename text not null,
  projector_note_id text not null,
  projector_note_en text not null,
  projector_note_ja text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ip_address text not null,
  sort_order int not null
);

create table if not exists public.guide_steps (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('install', 'connect')),
  sort_order int not null,
  image_path text,
  is_final boolean not null default false,
  title_id text not null,
  title_en text not null,
  title_ja text not null,
  body_id text not null,
  body_en text not null,
  body_ja text not null
);

alter table public.settings enable row level security;
alter table public.rooms enable row level security;
alter table public.guide_steps enable row level security;

drop policy if exists "public read settings" on public.settings;
drop policy if exists "public read rooms" on public.rooms;
drop policy if exists "public read guide steps" on public.guide_steps;
drop policy if exists "admin all settings" on public.settings;
drop policy if exists "admin all rooms" on public.rooms;
drop policy if exists "admin all guide steps" on public.guide_steps;

create policy "public read settings" on public.settings for select to anon, authenticated using (true);
create policy "public read rooms" on public.rooms for select to anon, authenticated using (true);
create policy "public read guide steps" on public.guide_steps for select to anon, authenticated using (true);

create policy "admin all settings" on public.settings for all to authenticated using (true) with check (true);
create policy "admin all rooms" on public.rooms for all to authenticated using (true) with check (true);
create policy "admin all guide steps" on public.guide_steps for all to authenticated using (true) with check (true);

grant usage on schema public to anon, authenticated;
grant all on public.settings, public.rooms, public.guide_steps to anon, authenticated;

-- Storage setup
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict (id) do nothing;
drop policy if exists "public read images" on storage.objects;
drop policy if exists "admin all images" on storage.objects;
create policy "public read images" on storage.objects for select to anon, authenticated using (bucket_id = 'images');
create policy "admin all images" on storage.objects for all to authenticated using (bucket_id = 'images') with check (bucket_id = 'images');

-- Seed data
insert into public.settings (
  id, wifi_ssid, wifi_password, qr_url,
  qr_title_id, qr_title_en, qr_title_ja,
  qr_subtitle_id, qr_subtitle_en, qr_subtitle_ja,
  installer_path, installer_filename,
  projector_note_id, projector_note_en, projector_note_ja
) values (
  1,
  'OneOtsukaID-Guest',
  'Network123!',
  'https://guidline-loc-rooms.vercel.app/',
  'Scan QR Code', 'Scan QR Code', 'QRコードをスキャン',
  'Akses cepat ke panduan koneksi ruang rapat.', 'Quick access to the meeting room connection guide.', '会議室の接続ガイドへのクイックアクセス。',
  '/images/iprov410win_web.exe',
  'iProV410Win_Web.exe',
  $id$Jika gambar tidak muncul setelah semua langkah, coba restart proyektor. Untuk bantuan hubungi Department Information Technology Team di ext. 1100.$id$,
  $en$If no image appears after all steps, try restarting the projector. For further help, contact Department Information Technology Team at ext. 1100.$en$,
  $ja$すべての手順を行っても映像が表示されない場合は、プロジェクターを再起動してください。詳細は内線1100のDepartment Information Technology Teamまでご連絡ください。$ja$
) on conflict (id) do update set
  wifi_ssid = excluded.wifi_ssid,
  wifi_password = excluded.wifi_password,
  qr_url = excluded.qr_url,
  qr_title_id = excluded.qr_title_id,
  qr_title_en = excluded.qr_title_en,
  qr_title_ja = excluded.qr_title_ja,
  qr_subtitle_id = excluded.qr_subtitle_id,
  qr_subtitle_en = excluded.qr_subtitle_en,
  qr_subtitle_ja = excluded.qr_subtitle_ja,
  installer_path = excluded.installer_path,
  installer_filename = excluded.installer_filename,
  projector_note_id = excluded.projector_note_id,
  projector_note_en = excluded.projector_note_en,
  projector_note_ja = excluded.projector_note_ja,
  updated_at = now();

delete from public.rooms;
insert into public.rooms (name, ip_address, sort_order) values
  ('Meeting Room 1', '10.3.171.31', 1),
  ('Meeting Room 2', '10.3.171.32', 2),
  ('Meeting Room 3', '10.3.171.33', 3);

delete from public.guide_steps;
insert into public.guide_steps (
  section, sort_order, image_path, is_final,
  title_id, title_en, title_ja, body_id, body_en, body_ja
) values
(
  'install', 1, '/images/panduan_wireless/1.1.png', false,
  $id$Klik kanan file installer$id$,
  $en$Right-click installer file$en$,
  $ja$インストーラーを右クリック$ja$,
  $id$Klik kanan berkas (iProV410Win_Web) lalu pilih "Run as administrator".$id$,
  $en$Right-click the installer file (iProV410Win_Web) and select "Run as administrator".$en$,
  $ja$インストーラーファイル (iProV410Win_Web) を右クリックし、「管理者として実行」を選択します。$ja$
),
(
  'install', 2, '/images/panduan_wireless/1.2.jpeg', false,
  $id$Konfirmasi UAC$id$,
  $en$Confirm UAC$en$,
  $ja$UACの確認$ja$,
  $id$Pilih "Yes" jika muncul notifikasi User Account Control (UAC).$id$,
  $en$Select "Yes" if a User Account Control (UAC) notification appears.$en$,
  $ja$ユーザーアカウント制御 (UAC) の確認画面が表示されたら、「はい」を選択します。$ja$
),
(
  'install', 3, '/images/panduan_wireless/1.3.png', false,
  $id$Pilih bahasa$id$,
  $en$Select language$en$,
  $ja$言語の選択$ja$,
  $id$Pilih bahasa yang diinginkan untuk proses instalasi.$id$,
  $en$Select your preferred language for the installation.$en$,
  $ja$インストールに使用する言語を選択します。$ja$
),
(
  'install', 4, '/images/panduan_wireless/1.4.png', false,
  $id$Klik Next$id$,
  $en$Click Next$en$,
  $ja$「Next」をクリック$ja$,
  $id$Klik tombol "Next" untuk melanjutkan.$id$,
  $en$Click the "Next" button to proceed.$en$,
  $ja$「Next」ボタンをクリックして進みます。$ja$
),
(
  'install', 5, '/images/panduan_wireless/1.5.png', false,
  $id$Persetujuan Lisensi$id$,
  $en$License Agreement$en$,
  $ja$ライセンス契約の同意$ja$,
  $id$Pilih "Yes" untuk menyetujui Perjanjian Lisensi (License Agreement).$id$,
  $en$Select "Yes" to accept the License Agreement.$en$,
  $ja$「Yes」を選択してライセンス契約に同意します。$ja$
),
(
  'install', 6, '/images/panduan_wireless/1.6.png', false,
  $id$Pilih Edisi Standar$id$,
  $en$Select Standard Edition$en$,
  $ja$Standard Editionの選択$ja$,
  $id$Pilih opsi "Standard Edition" untuk instalasi.$id$,
  $en$Select the "Standard Edition" option for installation.$en$,
  $ja$インストールオプションで「Standard Edition」を選択します。$ja$
),
(
  'install', 7, '/images/panduan_wireless/1.7.png', true,
  $id$Selesaikan Instalasi$id$,
  $en$Complete Installation$en$,
  $ja$インストールの完了$ja$,
  $id$Tunggu hingga seluruh proses instalasi selesai.$id$,
  $en$Wait for the installation process to complete.$en$,
  $ja$インストールプロセスが完了するまで待ちます。$ja$
),
(
  'connect', 1, '/images/panduan_wireless/2.1.jpeg', false,
  $id$Buka aplikasi$id$,
  $en$Open application$en$,
  $ja$アプリの起動$ja$,
  $id$Buka aplikasi Epson iProjection V.4.10.$id$,
  $en$Open the Epson iProjection V.4.10 application.$en$,
  $ja$Epson iProjection V.4.10 アプリを起動します。$ja$
),
(
  'connect', 2, '/images/panduan_wireless/2.2.png', false,
  $id$Persetujuan Privasi$id$,
  $en$Privacy Statement$en$,
  $ja$プライバシーポリシーへの同意$ja$,
  $id$Pilih "Agree" pada pernyataan kebijakan privasi (Privacy Statement).$id$,
  $en$Select "Agree" on the privacy statement screen.$en$,
  $ja$プライバシーステートメント画面で「Agree」を選択します。$ja$
),
(
  'connect', 3, '/images/panduan_wireless/2.3.png', false,
  $id$Partisipasi Survei$id$,
  $en$Survey Participation$en$,
  $ja$アンケートへの回答$ja$,
  $id$Pilih "Allow" pada survei Epson.$id$,
  $en$Select "Allow" on the Epson survey prompt.$en$,
  $ja$エプソンのアンケートで「Allow」を選択します。$ja$
),
(
  'connect', 4, '/images/panduan_wireless/2.4.png', false,
  $id$Pilih Advanced Connection$id$,
  $en$Select Advanced Connection$en$,
  $ja$Advanced Connectionの選択$ja$,
  $id$Pilih tipe koneksi "Advanced connection".$id$,
  $en$Select the "Advanced connection" mode.$en$,
  $ja$接続モードで「Advanced connection」を選択します。$ja$
),
(
  'connect', 5, '/images/panduan_wireless/2.5.png', false,
  $id$Nonaktifkan Firewall$id$,
  $en$Disable Firewall$en$,
  $ja$ファイアウォールの無効化$ja$,
  $id$Pilih "Yes" untuk menonaktifkan firewall (disable firewall).$id$,
  $en$Select "Yes" to disable the firewall block.$en$,
  $ja$「Yes」を選択してファイアウォールを無効化します。$ja$
),
(
  'connect', 6, '/images/panduan_wireless/2.6.png', false,
  $id$Konfirmasi Buka Aplikasi$id$,
  $en$Confirm Open App$en$,
  $ja$アプリ起動の確認$ja$,
  $id$Pilih "Yes" untuk membuka aplikasi.$id$,
  $en$Select "Yes" to open the application.$en$,
  $ja$「Yes」を選択してアプリの起動を確定します。$ja$
),
(
  'connect', 7, '/images/panduan_wireless/2.7.png', true,
  $id$Pencarian Manual & Masukkan IP$id$,
  $en$Manual Search & Enter IP$en$,
  $ja$手動検索とIPアドレス入力$ja$,
  $id$Pilih "Manual Search" kemudian masukkan IP Address proyektor ruangan Anda.$id$,
  $en$Select "Manual Search" and enter the projector's IP Address.$en$,
  $ja$「Manual Search」を選択し、会議室のプロジェクターのIPアドレスを入力します。$ja$
);

-- Note: Untuk auth, jalankan query ini di SQL Editor Supabase untuk membuat user (jika belum ada)
-- Atau gunakan fitur Sign Up di dashboard Supabase.
-- admin@otsuka.id / Loc?1234
