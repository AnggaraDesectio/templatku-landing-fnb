// Landing page KOPI SENJA, coffee shop di Bandung.
// Halaman ini TIDAK memakai AuthenticatedLayout, header/nav + footer inline, self-contained.
// Tidak menerima props.
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StickyMobileCta } from '@/components/sticky-mobile-cta';
import {
    AtSign,
    Cake,
    CheckCircle2,
    Clock,
    Coffee,
    Cookie,
    Croissant,
    CupSoda,
    GraduationCap,
    Laptop,
    Leaf,
    MapPin,
    Menu,
    Milk,
    Phone,
    Sandwich,
    Star,
    Soup,
    Users,
    UtensilsCrossed,
    Wifi,
    X,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Format rupiah gaya Indonesia: 22000 -> "Rp22.000"
const rupiah = (n: number) => `Rp${n.toLocaleString('id-ID')}`;

// Jam operasional: 08.00–22.00 setiap hari.
const JAM_BUKA = 8;
const JAM_TUTUP = 22;

// ---------- Data ----------

interface MenuItem {
    nama: string;
    harga: number;
    deskripsi: string;
    icon: LucideIcon;
    art: string; // kelas gradient untuk tile CSS-art
    andalan?: boolean;
}

const MENU: Record<'kopi' | 'nonkopi' | 'makanan' | 'dessert', MenuItem[]> = {
    kopi: [
        { nama: 'Kopi Susu Senja', harga: 22000, deskripsi: 'Espresso double shot, susu segar, dan gula aren khas kami.', icon: Coffee, art: 'from-amber-800 via-yellow-900 to-stone-950', andalan: true },
        { nama: 'Espresso', harga: 18000, deskripsi: 'Single origin Gayo, diseduh pekat dan aromatik.', icon: Coffee, art: 'from-stone-800 via-stone-900 to-black' },
        { nama: 'Kopi Tubruk Gayo', harga: 20000, deskripsi: 'Tubruk klasik ala warung kopi, pahitnya nendang.', icon: Coffee, art: 'from-amber-900 via-stone-900 to-black' },
        { nama: 'Caffe Latte', harga: 24000, deskripsi: 'Espresso lembut dengan susu steamed yang creamy.', icon: Milk, art: 'from-orange-200 via-amber-300 to-yellow-500', andalan: true },
        { nama: 'V60 Kopi Hitam', harga: 23000, deskripsi: 'Seduh manual pour-over, pilihan biji Toraja atau Kintamani.', icon: Coffee, art: 'from-yellow-700 via-amber-800 to-stone-900' },
        { nama: 'Aren Latte', harga: 25000, deskripsi: 'Latte dingin dengan gula aren asli dan taburan kayu manis.', icon: Milk, art: 'from-amber-600 via-orange-700 to-amber-900' },
    ],
    nonkopi: [
        { nama: 'Teh Melati Panas', harga: 12000, deskripsi: 'Teh melati Slawi diseduh panas, wangi dan menenangkan.', icon: Leaf, art: 'from-emerald-600 via-teal-700 to-emerald-900' },
        { nama: 'Matcha Latte', harga: 26000, deskripsi: 'Matcha premium Uji dengan susu segar, bisa panas atau dingin.', icon: Leaf, art: 'from-lime-600 via-green-700 to-emerald-800', andalan: true },
        { nama: 'Cokelat Panas', harga: 22000, deskripsi: 'Cokelat Belgia pekat dengan whipped cream di atasnya.', icon: CupSoda, art: 'from-amber-900 via-orange-950 to-stone-950' },
        { nama: 'Lemon Tea', harga: 15000, deskripsi: 'Teh segar dengan perasan lemon asli, dingin menyegarkan.', icon: CupSoda, art: 'from-yellow-400 via-amber-500 to-orange-600' },
        { nama: 'Soda Gembira', harga: 20000, deskripsi: 'Soda, susu, dan sirup cocopandan, nostalgia masa kecil.', icon: CupSoda, art: 'from-rose-400 via-pink-500 to-rose-600' },
    ],
    makanan: [
        { nama: 'Pisang Goreng Coklat Keju', harga: 18000, deskripsi: 'Pisang raja goreng renyah, lelehan cokelat dan parutan keju.', icon: Cookie, art: 'from-yellow-500 via-amber-600 to-orange-700', andalan: true },
        { nama: 'Mie Tek-Tek Senja', harga: 25000, deskripsi: 'Mie goreng tek-tek dengan telur, ayam suwir, dan kerupuk.', icon: Soup, art: 'from-orange-500 via-red-600 to-orange-800' },
        { nama: 'Nasi Goreng Kampung', harga: 28000, deskripsi: 'Nasi goreng terasi dengan ayam, telur mata sapi, dan emping.', icon: UtensilsCrossed, art: 'from-amber-700 via-orange-800 to-red-900' },
        { nama: 'Roti Bakar Cokelat', harga: 15000, deskripsi: 'Roti bakar tebal dengan selai cokelat melimpah.', icon: Sandwich, art: 'from-yellow-600 via-amber-700 to-orange-800' },
        { nama: 'Cireng Rujak', harga: 15000, deskripsi: 'Cireng goreng garing dengan sambal rujak khas Bandung.', icon: Cookie, art: 'from-red-500 via-rose-600 to-red-700' },
    ],
    dessert: [
        { nama: 'Brownies Kukus', harga: 20000, deskripsi: 'Brownies cokelat kukus lembut dengan topping keju.', icon: Cake, art: 'from-stone-700 via-amber-900 to-stone-950', andalan: true },
        { nama: 'Klepon Cake', harga: 22000, deskripsi: 'Cake pandan dengan isian gula merah dan taburan kelapa.', icon: Cake, art: 'from-green-600 via-emerald-700 to-teal-800' },
        { nama: 'Es Cendol Senja', harga: 18000, deskripsi: 'Cendol, santan, dan gula aren dalam satu gelas segar.', icon: CupSoda, art: 'from-lime-500 via-green-600 to-emerald-700' },
        { nama: 'Puding Karamel', harga: 16000, deskripsi: 'Puding susu lembut dengan saus karamel homemade.', icon: Croissant, art: 'from-amber-400 via-orange-500 to-amber-600' },
    ],
};

const TAB_MENU = [
    { value: 'kopi', label: 'Kopi' },
    { value: 'nonkopi', label: 'Non-Kopi' },
    { value: 'makanan', label: 'Makanan' },
    { value: 'dessert', label: 'Dessert' },
] as const;

const GALERI = [
    { judul: 'Sudut favorit pembaca', foto: '/images/landing-fnb/galeri-sudut-baca.jpg' },
    { judul: 'Latte art barista kami', foto: '/images/landing-fnb/galeri-latte-art.jpg' },
    { judul: 'Ruang outdoor sore hari', foto: '/images/landing-fnb/galeri-outdoor.jpg' },
    { judul: 'Biji kopi pilihan', foto: '/images/landing-fnb/galeri-biji-kopi.jpg' },
    { judul: 'Dapur & dessert', foto: '/images/landing-fnb/galeri-dessert.jpg' },
];

// ---------- Halaman ----------

export default function FnbLanding() {
    const [menuBuka, setMenuBuka] = useState(false);
    const [tabAktif, setTabAktif] = useState<'kopi' | 'nonkopi' | 'makanan' | 'dessert'>('kopi');

    // Status buka/tutup dihitung dari jam saat ini (buka 08.00–22.00).
    // Dihitung setelah mount: getHours() tergantung timezone, sehingga
    // nilai SSR (server) & klien bisa berbeda → hydration mismatch.
    const [statusToko, setStatusToko] = useState({ buka: true, jam: JAM_BUKA });
    useEffect(() => {
        const jam = new Date().getHours();
        setStatusToko({ buka: jam >= JAM_BUKA && jam < JAM_TUTUP, jam });
    }, []);

    // Form reservasi, tanpa backend, hanya state konfirmasi.
    const [nama, setNama] = useState('');
    const [tanggal, setTanggal] = useState('');
    const [jamReservasi, setJamReservasi] = useState('');
    const [jumlahOrang, setJumlahOrang] = useState('2');
    const [reservasiOk, setReservasiOk] = useState(false);

    // Tanggal minimal = hari ini (format yyyy-mm-dd).
    const hariIni = useMemo(() => {
        const d = new Date();
        const bln = String(d.getMonth() + 1).padStart(2, '0');
        const tgl = String(d.getDate()).padStart(2, '0');
        return `${d.getFullYear()}-${bln}-${tgl}`;
    }, []);

    const slotJam = ['10.00', '12.00', '14.00', '16.00', '18.00', '20.00'];

    function kirimReservasi(e: FormEvent) {
        e.preventDefault();
        if (!nama.trim() || !tanggal || !jamReservasi) return;
        setReservasiOk(true);
    }

    const navLinks = [
        { href: '#beranda', label: 'Beranda' },
        { href: '#menu', label: 'Menu' },
        { href: '#galeri', label: 'Galeri' },
        { href: '#reservasi', label: 'Reservasi' },
        { href: '#lokasi', label: 'Lokasi' },
    ];

    return (
        <div className="min-h-screen bg-[#faf6f0] pb-24 text-stone-900 md:pb-0">
            {/* Navbar */}
            <header className="sticky top-0 z-40 border-b border-amber-900/10 bg-[#faf6f0]/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
                    <a href="#beranda" className="flex items-center gap-2.5">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-stone-900">
                            <Coffee className="h-5 w-5 text-amber-100" />
                        </span>
                        <span className="text-xl font-extrabold tracking-tight">
                            KOPI <span className="text-amber-700">SENJA</span>
                        </span>
                    </a>
                    <nav className="ml-8 hidden items-center gap-1 md:flex">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-amber-900/5 hover:text-stone-900">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                    <Button className="ml-auto hidden bg-amber-800 hover:bg-amber-900 sm:inline-flex" asChild>
                        <a href="#reservasi">Reservasi Meja</a>
                    </Button>
                    <Button variant="ghost" size="icon" className="ml-auto sm:hidden" onClick={() => setMenuBuka((v) => !v)} aria-label="Menu">
                        {menuBuka ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
                {menuBuka && (
                    <nav className="border-t border-amber-900/10 px-4 py-2 md:hidden">
                        {navLinks.map((l) => (
                            <a key={l.href} href={l.href} onClick={() => setMenuBuka(false)} className="block rounded-md px-3 py-2 text-sm font-medium text-stone-700 hover:bg-amber-900/5">
                                {l.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* Hero hangat */}
            <section id="beranda" className="relative overflow-hidden bg-gradient-to-br from-amber-100 via-[#f5e8d5] to-orange-100">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%, rgba(180,120,60,.18) 0, transparent 45%), radial-gradient(circle at 85% 75%, rgba(120,70,30,.15) 0, transparent 45%)' }} aria-hidden />
                <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-20 lg:grid-cols-2">
                    <div>
                        <Badge className="mb-4 bg-amber-800 text-amber-50 hover:bg-amber-800">Coffee Shop • Bandung</Badge>
                        <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            Espresso Gayo <span className="text-amber-700">Rp18.000,</span> di Jantung Dago.
                        </h1>
                        <p className="mt-4 max-w-md text-stone-600">
                            Kopi susu gula aren andalan kami cuma Rp22.000. Buka 08.00–22.00 setiap hari,
                            colokan di hampir setiap meja, WiFi kencang, live music tiap Jumat malam.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center gap-4">
                            <Button size="lg" className="bg-amber-800 hover:bg-amber-900" asChild>
                                <a href="#menu">Lihat Menu</a>
                            </Button>
                            <a href="#reservasi" className="text-sm font-semibold text-amber-800 underline-offset-4 hover:underline">
                                atau reservasi meja dulu →
                            </a>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-6 text-sm text-stone-600">
                            <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.9 (2.300+ ulasan)</span>
                            <span className="flex items-center gap-1.5"><Wifi className="h-4 w-4" /> WiFi kencang</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Buka 08.00–22.00</span>
                        </div>
                    </div>
                    {/* Foto hero: barista menuang latte art */}
                    <div className="relative mx-auto hidden w-full max-w-md sm:block lg:max-w-lg">
                        <img src="/images/landing-fnb/hero.jpg" alt="Barista Kopi Senja menuang latte art" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl" />
                        <div className="absolute top-4 left-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
                            <span className="text-xs font-bold text-amber-800">100%<br />Arabika</span>
                        </div>
                        <div className="absolute right-4 bottom-4 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold text-amber-100 shadow-lg">
                            Sejak 2019
                        </div>
                    </div>
                </div>
            </section>

            {/* Buat siapa: tiga alasan orang balik lagi */}
            <section className="mx-auto max-w-6xl px-4 pt-12">
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { icon: Laptop, judul: 'Buat kerja', teks: 'Colokan di hampir setiap meja + WiFi 100 Mbps. Nugas dari pagi sampai sore, aman.' },
                        { icon: GraduationCap, judul: 'Buat nongkrong', teks: 'Pisang goreng coklat keju Rp18.000 buat patungan. Live music tiap Jumat malam.' },
                        { icon: Users, judul: 'Buat komunitas', teks: 'Ruang outdoor muat 30 orang, reservasi gratis, nobar, kopdar, bedah buku.' },
                    ].map((p) => (
                        <div key={p.judul} className="flex gap-3 rounded-2xl border border-amber-900/10 bg-white/70 p-4">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-800/10">
                                <p.icon className="h-5 w-5 text-amber-800" />
                            </span>
                            <div>
                                <p className="font-bold">{p.judul}</p>
                                <p className="mt-0.5 text-sm text-stone-600">{p.teks}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Menu dengan tabs */}
            <section id="menu" className="mx-auto max-w-6xl px-4 py-14">
                <div className="text-center">
                    <Badge variant="outline" className="border-amber-800/30 text-amber-800">Menu Kami</Badge>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Dibuat Segar Setiap Hari</h2>
                    <p className="mx-auto mt-2 max-w-lg text-stone-600">Semua harga sudah termasuk pajak. Ukuran reguler, tambah Rp5.000 untuk ukuran besar.</p>
                </div>
                <Tabs value={tabAktif} onValueChange={(v) => setTabAktif(v as typeof tabAktif)} className="mt-8">
                    <TabsList className="mx-auto flex w-full max-w-xl bg-amber-900/10">
                        {TAB_MENU.map((t) => (
                            <TabsTrigger key={t.value} value={t.value} className="flex-1 data-[state=active]:bg-white">
                                {t.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {TAB_MENU.map((t) => (
                        <TabsContent key={t.value} value={t.value}>
                            <div className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3">
                                {MENU[t.value].map((m) => (
                                    <Card key={m.nama} className="overflow-hidden transition-shadow hover:shadow-md">
                                        <div className={cn('relative flex h-32 items-center justify-center bg-gradient-to-br', m.art)}>
                                            <m.icon className="h-12 w-12 text-white/85" strokeWidth={1.5} />
                                            {m.andalan && <Badge className="absolute top-2 left-2 bg-amber-500 text-amber-950 hover:bg-amber-500">Andalan</Badge>}
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="font-semibold">{m.nama}</p>
                                                <p className="shrink-0 font-bold text-amber-800">{rupiah(m.harga)}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-stone-600">{m.deskripsi}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    ))}
                </Tabs>
            </section>

            {/* Jam operasional + status live */}
            <section className="mx-auto max-w-6xl px-4 pb-14">
                <Card className="overflow-hidden border-amber-900/15">
                    <div className="grid md:grid-cols-2">
                        <CardContent className="p-6 sm:p-8">
                            <div className="flex items-center gap-3">
                                <span className={cn('relative flex h-3.5 w-3.5')}>
                                    <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-60', statusToko.buka ? 'bg-green-500' : 'bg-red-500')} />
                                    <span className={cn('relative inline-flex h-3.5 w-3.5 rounded-full', statusToko.buka ? 'bg-green-600' : 'bg-red-600')} />
                                </span>
                                <p className={cn('text-lg font-bold', statusToko.buka ? 'text-green-700' : 'text-red-700')}>
                                    {statusToko.buka ? 'Buka Sekarang' : 'Tutup'}
                                </p>
                            </div>
                            <p className="mt-2 text-sm text-stone-600">
                                {statusToko.buka
                                    ? `Masih buka sampai pukul 22.00, yuk mampir!`
                                    : `Kami buka kembali pukul 08.00. Sampai jumpa!`}
                            </p>
                            <div className="mt-5 space-y-2 text-sm">
                                {[
                                    ['Senin, Jumat', '08.00, 22.00'],
                                    ['Sabtu, Minggu', '08.00, 23.00'],
                                ].map(([hari, jam]) => (
                                    <div key={hari} className="flex items-center justify-between border-b border-dashed border-amber-900/15 pb-2">
                                        <span className="flex items-center gap-2 text-stone-600"><Clock className="h-4 w-4 text-amber-700" />{hari}</span>
                                        <span className="font-semibold">{jam}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <div className="relative flex min-h-56 items-center justify-center bg-gradient-to-br from-stone-800 via-amber-950 to-black p-8">
                            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(255,200,120,.25) 0, transparent 50%)' }} aria-hidden />
                            <div className="relative text-center text-amber-100">
                                <Coffee className="mx-auto h-14 w-14" strokeWidth={1.25} />
                                <p className="mt-3 font-semibold">Live music tiap Jumat malam</p>
                                <p className="text-sm text-amber-200/80">19.00, 21.00 • musisi lokal Bandung</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Galeri strip CSS-art */}
            <section id="galeri" className="bg-stone-950 py-14 text-white">
                <div className="mx-auto max-w-6xl px-4">
                    <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Suasana di Kopi Senja</h2>
                    <p className="mt-1 text-sm text-stone-400">Sekilas sudut-sudut favorit pengunjung kami.</p>
                    <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                        {GALERI.map((g) => (
                            <div key={g.judul} className="w-60 shrink-0 overflow-hidden rounded-xl sm:w-72">
                                <img src={g.foto} alt={g.judul} loading="lazy" className="h-40 w-full object-cover sm:h-48" />
                                <p className="bg-stone-900 px-3 py-2.5 text-sm font-medium text-stone-200">{g.judul}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Reservasi */}
            <section id="reservasi" className="mx-auto max-w-6xl px-4 py-14">
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    <div>
                        <Badge variant="outline" className="border-amber-800/30 text-amber-800">Reservasi</Badge>
                        <h2 className="mt-3 text-3xl font-extrabold tracking-tight">Amankan Mejammu</h2>
                        <p className="mt-2 text-stone-600">
                            Akhir pekan biasanya ramai, reservasi minimal 2 jam sebelumnya.
                            Tanpa uang muka, cukup datang tepat waktu.
                        </p>
                        <ul className="mt-5 space-y-3 text-sm text-stone-700">
                            {['Area indoor ber-AC & outdoor yang asri', 'Colokan di hampir setiap meja', 'Bisa untuk acara komunitas s.d. 30 orang'].map((x) => (
                                <li key={x} className="flex items-start gap-2">
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-700" /> {x}
                                </li>
                            ))}
                        </ul>
                        <figure className="mt-6 rounded-2xl border-l-4 border-amber-700 bg-white p-4 shadow-sm">
                            <blockquote className="text-sm italic text-stone-700">
                                “Seminggu 3x nugas di sini. Colokan selalu dapat, WiFi nggak pernah ngadat,
                                kopi susu arennya juga nggak pernah gagal.”
                            </blockquote>
                            <figcaption className="mt-2 text-xs font-semibold text-stone-500">
                                Rizky Pratama, mahasiswa, langganan sejak 2023
                            </figcaption>
                        </figure>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Form Reservasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reservasiOk ? (
                                <div className="rounded-xl bg-green-50 p-6 text-center">
                                    <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                                    <p className="mt-3 text-lg font-bold text-green-800">Reservasi diterima!</p>
                                    <p className="mt-1 text-sm text-green-700">
                                        Terima kasih, <span className="font-semibold">{nama}</span>. Meja untuk {jumlahOrang} orang
                                        pada {tanggal} pukul {jamReservasi} WIB sudah kami catat. Kami tunggu kedatanganmu!
                                    </p>
                                    <Button variant="outline" className="mt-4" onClick={() => { setReservasiOk(false); setNama(''); setTanggal(''); setJamReservasi(''); }}>
                                        Buat reservasi lain
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={kirimReservasi} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="rsv-nama">Nama</Label>
                                        <Input id="rsv-nama" placeholder="cth: Rizky Pratama" value={nama} onChange={(e) => setNama(e.target.value)} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="rsv-tanggal">Tanggal</Label>
                                            <Input id="rsv-tanggal" type="date" min={hariIni} value={tanggal} onChange={(e) => setTanggal(e.target.value)} required />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="rsv-jam">Jam</Label>
                                            <Select value={jamReservasi} onValueChange={setJamReservasi} required>
                                                <SelectTrigger id="rsv-jam">
                                                    <SelectValue placeholder="Pilih jam" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {slotJam.map((j) => (
                                                        <SelectItem key={j} value={j}>{j} WIB</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="rsv-orang">Jumlah orang</Label>
                                        <Select value={jumlahOrang} onValueChange={setJumlahOrang}>
                                            <SelectTrigger id="rsv-orang">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['1', '2', '3', '4', '5', '6+'].map((n) => (
                                                    <SelectItem key={n} value={n}>{n} orang</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button type="submit" className="w-full bg-amber-800 hover:bg-amber-900">Kirim Reservasi</Button>
                                    <p className="text-center text-xs text-stone-500">Konfirmasi via WhatsApp maksimal 30 menit setelah pengiriman.</p>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Lokasi + WhatsApp CTA */}
            <section id="lokasi" className="mx-auto max-w-6xl px-4 pb-16">
                <Card className="overflow-hidden">
                    <div className="grid md:grid-cols-2">
                        {/* Peta CSS-art */}
                        <div className="relative min-h-64 bg-gradient-to-br from-emerald-100 via-amber-50 to-orange-100" aria-hidden>
                            <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(120,90,60,.08) 0 2px, transparent 2px 40px), repeating-linear-gradient(90deg, rgba(120,90,60,.08) 0 2px, transparent 2px 40px)' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="relative mx-auto flex h-14 w-14 items-center justify-center">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-40" />
                                    <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg">
                                        <MapPin className="h-7 w-7 text-white" />
                                    </span>
                                </span>
                                <p className="mt-2 rounded-full bg-white px-3 py-1 text-xs font-bold shadow">KOPI SENJA</p>
                            </div>
                        </div>
                        <CardContent className="p-6 sm:p-8">
                            <h2 className="text-2xl font-extrabold tracking-tight">Kunjungi Kami</h2>
                            <div className="mt-4 space-y-3 text-sm text-stone-700">
                                <p className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /> Jl. Dago No. 88, Coblong, Bandung 40135<br />(5 menit dari Simpang Dago)</p>
                                <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-amber-700" /> 0812-3456-7890</p>
                                <p className="flex items-center gap-2"><AtSign className="h-4 w-4 shrink-0 text-amber-700" /> kopisenja.bdg</p>
                                <p className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0 text-amber-700" /> Setiap hari 08.00–22.00 WIB</p>
                            </div>
                            <Button size="lg" className="mt-6 w-full bg-green-600 hover:bg-green-700 sm:w-auto" asChild>
                                <a href="https://wa.me/6281234567890?text=Halo%20Kopi%20Senja!%20Saya%20mau%20tanya-tanya%20dulu." target="_blank" rel="noreferrer">
                                    Chat WhatsApp
                                </a>
                            </Button>
                        </CardContent>
                    </div>
                </Card>
            </section>

            {/* Footer */}
            <footer className="bg-stone-950 text-stone-400">
                <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-700 to-stone-900">
                                <Coffee className="h-4 w-4 text-amber-100" />
                            </span>
                            <span className="text-lg font-extrabold text-white">KOPI <span className="text-amber-500">SENJA</span></span>
                        </div>
                        <p className="mt-3 text-sm">Ngopi santai, rasa rumahan. Coffee shop favorit warga Dago sejak 2019.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Jam Operasional</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Senin, Jumat: 08.00, 22.00</li>
                            <li>Sabtu, Minggu: 08.00, 23.00</li>
                        </ul>
                    </div>
                    <div>
                        <p className="font-semibold text-white">Kontak</p>
                        <ul className="mt-3 space-y-1.5 text-sm">
                            <li>Jl. Dago No. 88, Bandung</li>
                            <li>0812-3456-7890</li>
                            <li>kopisenja.bdg</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-stone-800 py-4 text-center text-xs">© 2026 Kopi Senja, Bandung. Diseduh dengan cinta.</div>
            </footer>

            {/* CTA sticky mobile: WhatsApp */}
            <StickyMobileCta
                variant="whatsapp"
                title="Kopi Senja"
                subtitle={statusToko.buka ? 'Buka sekarang • s.d. 22.00' : 'Buka kembali 08.00'}
                actionLabel="Chat WhatsApp"
            />
        </div>
    );
}
