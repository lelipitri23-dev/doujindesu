import Navbar from '@/components/Navbar';
import MangaCard from '@/components/MangaCard';
import Link from 'next/link';
import { Filter, ChevronLeft, ChevronRight, Tag, BookOpen, Search } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';

// --- FETCH DATA ---
async function getMangaList(page, status, type, genre, q) {
  try {
    const params = new URLSearchParams();
    
    // Set parameter sesuai input
    if (page) params.set('page', page);
    if (status && status !== 'all') params.set('status', status);
    if (type && type !== 'all') params.set('type', type);
    if (genre) params.set('genre', genre);
    if (q) params.set('q', q);

    // Fetch ke Backend
    const res = await fetch(`${SITE_CONFIG.apiBaseUrl}/manga?${params.toString()}`, { 
      cache: 'no-store' 
    });
    
    // Jika gagal, return object kosong agar tidak crash
    if (!res.ok) return { data: [], pagination: {} };
    
    return res.json();
  } catch (e) {
    console.error("Gagal mengambil daftar manga:", e);
    return { data: [], pagination: {} };
  }
}

async function getGenres() {
  try {
    const res = await fetch(`${SITE_CONFIG.apiBaseUrl}/genres`, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return res.json();
  } catch (e) { 
    return { data: [] }; 
  }
}

// --- GENERATE METADATA (SEO OPTIMIZED) ---
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  
  const type = sp.type || 'Komik';
  const genre = sp.genre ? `Genre ${sp.genre}` : '';
  const status = sp.status ? `Status ${sp.status}` : '';
  const q = sp.q ? `Pencarian "${sp.q}"` : '';
  const page = sp.page || 1;

  // Title Logic
  let titleRaw = q || `Daftar ${type} ${genre} ${status}`.trim().replace(/\s+/g, ' ');
  let title = `${titleRaw} Bahasa Indonesia`;
  if (page > 1) title += ` - Halaman ${page}`;

  // Build Canonical URL
  const urlParams = new URLSearchParams();
  if (sp.page && sp.page > 1) urlParams.set('page', sp.page);
  if (sp.status) urlParams.set('status', sp.status);
  if (sp.type) urlParams.set('type', sp.type);
  if (sp.genre) urlParams.set('genre', sp.genre);
  if (sp.q) urlParams.set('q', sp.q);

  const queryString = urlParams.toString();
  const absoluteUrl = `${SITE_CONFIG.baseUrl}/list${queryString ? `?${queryString}` : ''}`;
  const description = `Cari dan baca ${titleRaw} bahasa Indonesia terlengkap di ${SITE_CONFIG.name}. Filter berdasarkan genre, status, dan tipe manga, manhwa, atau manhua.`;

  return {
    title: title,
    description: description,
    keywords: [
      `baca ${type.toLowerCase()} online`,
      `daftar ${type.toLowerCase()}`,
      `${type.toLowerCase()} indo`,
      `komik ${genre}`,
      SITE_CONFIG.name
    ],
    openGraph: {
      title: title,
      description: description,
      url: absoluteUrl,
      type: 'website',
      images: [{ url: `${SITE_CONFIG.baseUrl}/og-image.jpg` }],
    },
    alternates: { canonical: absoluteUrl },
    robots: {
      index: true,
      follow: true,
    }
  };
}

// --- HELPER COMPONENT: FILTER BUTTON ---
const FilterButton = ({ label, active, href }) => (
  <Link 
    href={href}
    scroll={false} 
    className={`px-3 py-1.5 rounded text-[10px] md:text-xs font-bold uppercase transition border whitespace-nowrap ${
      active 
        ? 'bg-primary border-primary text-white shadow-md' 
        : 'bg-darker border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
    }`}
  >
    {label}
  </Link>
);

// --- MAIN PAGE ---
export default async function MangaListPage({ searchParams }) {
  const params = await searchParams;
  
  // 1. Ambil Parameter URL
  const page = Number(params.page) || 1;
  const status = params.status || '';
  const type = params.type || '';
  const genre = params.genre || '';
  const q = params.q || '';

  // 2. Fetch Data (Paralel)
  const [mangaRes, genreRes] = await Promise.all([
    getMangaList(page, status, type, genre, q),
    getGenres()
  ]);

  // 3. Olah Data dari JSON
  const mangas = mangaRes.data || [];
  const pagination = mangaRes.pagination || { totalPages: 1, currentPage: 1 };
  const allGenres = genreRes.data || [];

  // Helper URL Builder
  const buildUrl = (key, value) => {
      const newParams = new URLSearchParams(params);
      if (value === 'all' || !value) newParams.delete(key);
      else newParams.set(key, value);
      newParams.delete('page'); 
      return `/list?${newParams.toString()}`;
  };

  // Judul Halaman Dinamis untuk UI
  let pageTitle = 'Daftar Komik';
  if (q) pageTitle = `Hasil Cari: "${q}"`;
  else if (genre) pageTitle = `Genre: ${genre}`;
  else if (type) pageTitle = `Tipe: ${type}`;

  // --- JSON-LD SCHEMA (SEO) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage", // Tipe halaman koleksi
    "name": pageTitle,
    "description": `Daftar komik ${pageTitle} bahasa Indonesia`,
    "url": `${SITE_CONFIG.baseUrl}/list`,
    "hasPart": mangas.map(m => ({
        "@type": "ComicSeries",
        "name": m.title,
        "url": `${SITE_CONFIG.baseUrl}/manga/${m.slug}`,
        "image": m.thumb
    }))
  };

  return (
    <main className="min-h-screen bg-dark pb-20 font-sans">
      <Navbar />

      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
            
            {/* === KONTEN UTAMA === */}
            <div className="min-w-0">
                
                {/* FILTER CARD */}
                <div className="bg-card p-5 md:p-6 rounded-xl border border-gray-800 mb-8 shadow-lg">
                    <div className="flex items-center justify-between mb-5 border-b border-gray-700 pb-3">
                        <div className="flex items-center gap-2">
                          <Filter className="text-primary" size={20} />
                          <h1 className="text-lg md:text-xl font-bold text-white uppercase truncate max-w-[200px] md:max-w-none">
                            {pageTitle}
                          </h1>
                        </div>
                        <span className="text-[10px] text-gray-500 bg-darker px-2 py-1 rounded border border-gray-800">
                           Total: {pagination.totalItems || 0}
                        </span>
                    </div>

                    <div className="space-y-4">
                        {/* Filter Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold w-14 flex-shrink-0">Status</span>
                            <div className="flex flex-wrap gap-2">
                                <FilterButton label="Semua" active={!status} href={buildUrl('status', 'all')} />
                                <FilterButton label="Ongoing" active={status === 'Publishing'} href={buildUrl('status', 'Publishing')} />
                                <FilterButton label="Tamat" active={status === 'Finished'} href={buildUrl('status', 'Finished')} />
                            </div>
                        </div>

                        {/* Filter Type */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold w-14 flex-shrink-0">Type</span>
                            <div className="flex flex-wrap gap-2">
                                <FilterButton label="Semua" active={!type} href={buildUrl('type', 'all')} />
                                <FilterButton label="Manga" active={type === 'Manga'} href={buildUrl('type', 'Manga')} />
                                <FilterButton label="Manhwa" active={type === 'Manhwa'} href={buildUrl('type', 'Manhwa')} />
                                <FilterButton label="Doujin" active={type === 'Doujinshi'} href={buildUrl('type', 'Doujinshi')} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* HASIL DATA GRID */}
                {mangas.length > 0 ? (
                    <div className="bg-card p-5 rounded-lg border border-gray-800 shadow-xl relative overflow-hidden">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mangas.map(manga => (
                            <MangaCard key={manga._id} manga={manga} />
                        ))}
                    </div>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-card rounded-xl border border-gray-800 flex flex-col items-center justify-center">
                        <BookOpen size={48} className="text-gray-600 mb-4 opacity-50" />
                        <p className="text-gray-400 text-lg font-medium">Tidak ada komik ditemukan.</p>
                        <Link href="/list" className="text-primary text-sm mt-3 px-4 py-2 bg-primary/10 rounded-full hover:bg-primary/20 transition">
                            Reset Filter
                        </Link>
                    </div>
                )}

                {/* PAGINATION */}
                <div className="flex justify-center items-center gap-2 mt-12 mb-10">
                    {page > 1 ? (
                        <Link 
                            href={`/list?page=${page - 1}&status=${status}&type=${type}&genre=${genre}&q=${q}`} 
                            className="h-10 px-5 rounded-lg bg-card border border-gray-700 hover:border-primary text-white flex items-center gap-2 transition text-sm font-bold shadow-sm"
                        >
                            <ChevronLeft size={16} /> Prev
                        </Link>
                    ) : (
                        <button disabled className="h-10 px-5 rounded-lg bg-darker border border-gray-800 text-gray-600 flex items-center gap-2 cursor-not-allowed text-sm font-bold opacity-50">
                            <ChevronLeft size={16} /> Prev
                        </button>
                    )}
                    
                    <div className="h-10 px-5 rounded-lg bg-primary text-white font-bold shadow-lg flex items-center justify-center text-sm border border-blue-500">
                        Page {page} of {pagination.totalPages}
                    </div>

                    {page < (pagination.totalPages || 1) ? (
                        <Link 
                            href={`/list?page=${page + 1}&status=${status}&type=${type}&genre=${genre}&q=${q}`} 
                            className="h-10 px-5 rounded-lg bg-card border border-gray-700 hover:border-primary text-white flex items-center gap-2 transition text-sm font-bold shadow-sm"
                        >
                            Next <ChevronRight size={16} />
                        </Link>
                    ) : (
                        <button disabled className="h-10 px-5 rounded-lg bg-darker border border-gray-800 text-gray-600 flex items-center gap-2 cursor-not-allowed text-sm font-bold opacity-50">
                            Next <ChevronRight size={16} />
                        </button>
                    )}
                </div>

                {/* --- SEO TEXT BLOCK (OPTIMIZED) --- */}
                <div className="p-6 bg-card/50 rounded-xl border border-gray-800 text-center">
                    <h2 className="text-white font-bold mb-2">Baca Manga Bahasa Indonesia Terlengkap di {SITE_CONFIG.name}</h2>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-3xl mx-auto">
                        Selamat datang di halaman {pageTitle}. Di sini kamu bisa mencari koleksi <strong>manga, manhwa, dan manhua</strong> bahasa Indonesia terbaru. 
                        Gunakan filter genre untuk menemukan komik favoritmu seperti Action, Romance, atau Fantasy. 
                        Koleksi di {SITE_CONFIG.name} selalu update setiap hari dengan kualitas gambar HD. 
                        Jangan lupa untuk cek update manga lainnya di halaman <Link href="/" className="text-primary hover:underline">Home</Link>.
                    </p>
                </div>

            </div>

            {/* === SIDEBAR GENRE === */}
            <aside className="space-y-6 hidden lg:block">
                <div className="bg-card p-5 rounded-xl border border-gray-800 shadow-lg sticky top-24">
                    <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Tag size={16} className="text-primary" /> Filter Genre
                    </h3>
                    <div className="flex flex-wrap gap-2 content-start">
                        {allGenres.map((g, idx) => {
                            const genreName = g.name || g; 
                            if (!genreName) return null;
                            const isActive = genre === genreName;

                            return (
                                <Link 
                                    key={g._id || idx} 
                                    href={`/list?genre=${genreName}`} 
                                    title={`Komik Genre ${genreName}`} // SEO Title
                                    className={`text-[10px] px-2.5 py-1.5 rounded transition uppercase border font-medium ${
                                        isActive 
                                        ? 'bg-primary border-primary text-white shadow-md' 
                                        : 'bg-darker border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
                                    }`}
                                >
                                    {genreName}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </aside>

        </div>
      </div>
    </main>
  );
}