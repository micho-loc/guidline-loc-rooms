import type { GuideContent, GuideStep } from "@/lib/types";

const install: Omit<GuideStep, "id" | "section" | "sortOrder">[] = [
  {
    imagePath: "/images/panduan_wireless/1.1.png",
    isFinal: false,
    title: {
      id: "Klik kanan file installer",
      en: "Right-click installer file",
      ja: "インストーラーを右クリック",
    },
    body: {
      id: 'Klik kanan berkas (iProV410Win_Web) lalu pilih "Run as administrator".',
      en: 'Right-click the installer file (iProV410Win_Web) and select "Run as administrator".',
      ja: "インストーラーファイル (iProV410Win_Web) を右クリックし、「管理者として実行」を選択します。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/1.2.jpeg",
    isFinal: false,
    title: { id: "Konfirmasi UAC", en: "Confirm UAC", ja: "UACの確認" },
    body: {
      id: 'Pilih "Yes" jika muncul notifikasi User Account Control (UAC).',
      en: 'Select "Yes" if a User Account Control (UAC) notification appears.',
      ja: "ユーザーアカウント制御 (UAC) の確認画面が表示されたら、「はい」を選択します。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/1.3.png",
    isFinal: false,
    title: { id: "Pilih bahasa", en: "Select language", ja: "言語の選択" },
    body: {
      id: "Pilih bahasa yang diinginkan untuk proses instalasi.",
      en: "Select your preferred language for the installation.",
      ja: "インストールに使用する言語を選択します。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/1.4.png",
    isFinal: false,
    title: { id: "Klik Next", en: "Click Next", ja: "「Next」をクリック" },
    body: {
      id: 'Klik tombol "Next" untuk melanjutkan.',
      en: 'Click the "Next" button to proceed.',
      ja: "「Next」ボタンをクリックして進みます。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/1.5.png",
    isFinal: false,
    title: {
      id: "Persetujuan Lisensi",
      en: "License Agreement",
      ja: "ライセンス契約の同意",
    },
    body: {
      id: 'Pilih "Yes" untuk menyetujui Perjanjian Lisensi (License Agreement).',
      en: 'Select "Yes" to accept the License Agreement.',
      ja: "「Yes」を選択してライセンス契約に同意します。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/1.6.png",
    isFinal: false,
    title: {
      id: "Pilih Edisi Standar",
      en: "Select Standard Edition",
      ja: "Standard Editionの選択",
    },
    body: {
      id: 'Pilih opsi "Standard Edition" untuk instalasi.',
      en: 'Select the "Standard Edition" option for installation.',
      ja: "インストールオプションで「Standard Edition」を選択します。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/1.7.png",
    isFinal: true,
    title: {
      id: "Selesaikan Instalasi",
      en: "Complete Installation",
      ja: "インストールの完了",
    },
    body: {
      id: "Tunggu hingga seluruh proses instalasi selesai.",
      en: "Wait for the installation process to complete.",
      ja: "インストールプロセスが完了するまで待ちます。",
    },
  },
];

const connect: Omit<GuideStep, "id" | "section" | "sortOrder">[] = [
  {
    imagePath: "/images/panduan_wireless/2.1.jpeg",
    isFinal: false,
    title: { id: "Buka aplikasi", en: "Open application", ja: "アプリの起動" },
    body: {
      id: "Buka aplikasi Epson iProjection V.4.10.",
      en: "Open the Epson iProjection V.4.10 application.",
      ja: "Epson iProjection V.4.10 アプリを起動します。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/2.2.png",
    isFinal: false,
    title: {
      id: "Persetujuan Privasi",
      en: "Privacy Statement",
      ja: "プライバシーポリシーへの同意",
    },
    body: {
      id: 'Pilih "Agree" pada pernyataan kebijakan privasi (Privacy Statement).',
      en: 'Select "Agree" on the privacy statement screen.',
      ja: "プライバシーステートメント画面で「Agree」を選択します。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/2.3.png",
    isFinal: false,
    title: {
      id: "Partisipasi Survei",
      en: "Survey Participation",
      ja: "アンケートへの回答",
    },
    body: {
      id: 'Pilih "Allow" pada survei Epson.',
      en: 'Select "Allow" on the Epson survey prompt.',
      ja: "エプソンのアンケートで「Allow」を選択します。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/2.4.png",
    isFinal: false,
    title: {
      id: "Pilih Advanced Connection",
      en: "Select Advanced Connection",
      ja: "Advanced Connectionの選択",
    },
    body: {
      id: 'Pilih tipe koneksi "Advanced connection".',
      en: 'Select the "Advanced connection" mode.',
      ja: "接続モードで「Advanced connection」を選択します。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/2.5.png",
    isFinal: false,
    title: {
      id: "Nonaktifkan Firewall",
      en: "Disable Firewall",
      ja: "ファイアウォールの無効化",
    },
    body: {
      id: 'Pilih "Yes" untuk menonaktifkan firewall (disable firewall).',
      en: 'Select "Yes" to disable the firewall block.',
      ja: "「Yes」を選択してファイアウォールを無効化します。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/2.6.png",
    isFinal: false,
    title: {
      id: "Konfirmasi Buka Aplikasi",
      en: "Confirm Open App",
      ja: "アプリ起動の確認",
    },
    body: {
      id: 'Pilih "Yes" untuk membuka aplikasi.',
      en: 'Select "Yes" to open the application.',
      ja: "「Yes」を選択してアプリの起動を確定します。",
    },
  },
  {
    imagePath: "/images/panduan_wireless/2.7.png",
    isFinal: true,
    title: {
      id: "Pencarian Manual & Masukkan IP",
      en: "Manual Search & Enter IP",
      ja: "手動検索とIPアドレス入力",
    },
    body: {
      id: 'Pilih "Manual Search" kemudian masukkan IP Address proyektor ruangan Anda.',
      en: 'Select "Manual Search" and enter the projector\'s IP Address.',
      ja: "「Manual Search」を選択し、会議室のプロジェクターのIPアドレスを入力します。",
    },
  },
];

function withMeta(
  section: GuideStep["section"],
  items: Omit<GuideStep, "id" | "section" | "sortOrder">[],
): GuideStep[] {
  return items.map((item, index) => ({
    ...item,
    id: `${section}-${index + 1}`,
    section,
    sortOrder: index + 1,
  }));
}

export const fallbackContent: GuideContent = {
  source: "fallback",
  settings: {
    wifiSsid: "OneOtsukaID-Guest",
    wifiPassword: "Network123!",
    qrUrl: "https://guidline-loc-rooms.vercel.app/",
    qrTitle: {
      id: "Scan QR Code",
      en: "Scan QR Code",
      ja: "QRコードをスキャン",
    },
    qrSubtitle: {
      id: "Akses cepat ke panduan koneksi ruang rapat.",
      en: "Quick access to the meeting room connection guide.",
      ja: "会議室の接続ガイドへのクイックアクセス。",
    },
    installerPath: "/images/iprov410win_web.exe",
    installerFilename: "iProV410Win_Web.exe",
    projectorNote: {
      id: "Jika gambar tidak muncul setelah semua langkah, coba restart proyektor. Untuk bantuan hubungi Department Information Technology Team di ext. 1100.",
      en: "If no image appears after all steps, try restarting the projector. For further help, contact Department Information Technology Team at ext. 1100.",
      ja: "すべての手順を行っても映像が表示されない場合は、プロジェクターを再起動してください。詳細は内線1100のDepartment Information Technology Teamまでご連絡ください。",
    },
  },
  rooms: [
    { id: "room-1", name: "Meeting Room 1", ipAddress: "10.3.171.31", sortOrder: 1 },
    { id: "room-2", name: "Meeting Room 2", ipAddress: "10.3.171.32", sortOrder: 2 },
    { id: "room-3", name: "Meeting Room 3", ipAddress: "10.3.171.33", sortOrder: 3 },
  ],
  steps: [...withMeta("install", install), ...withMeta("connect", connect)],
};
