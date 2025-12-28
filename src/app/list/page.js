import Navbar from '@/components/Navbar';
import MangaCard from '@/components/MangaCard';
import Link from 'next/link';
import { Filter, ChevronLeft, ChevronRight, Tag } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config'; // Import Config

// --- FETCH DATA ---
async function getMangaList(page, status, type, genre, q) {
  try {
    // Menggunakan API Base URL dari Config
    const BASE_URL = SITE_CONFIG.apiBaseUrl;
    
    let url = `${BASE_URL}/manga?page=${page}`;
    if (status) url += `&status=${status}`;
    if (type) url += `&type=${type}`;
    if (genre) url += `&genre=${genre}`;
    if (q) url += `&q=${q}`;
    
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return { data: [] };
    return res.json();
  } catch (e) {
    console.error("Gagal mengambil daftar manga:", e);
    return { data: [] };
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

// --- GENERATE METADATA (SEO & OG:URL FIX) ---
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  
  // Ambil variable
  const type = sp.type || 'Komik';
  const genre = sp.genre ? `Genre ${sp.genre}` : '';
  const status = sp.status ? `Status ${sp.status}` : '';
  const q = sp.q ? `Pencarian "${sp.q}"` : '';
  const page = sp.page || 1;

  // 1. Buat Judul Dinamis
  let title = q || `Daftar ${type} ${genre} ${status}`.trim().replace(/\s+/g, ' ');
  if (page > 1) title += ` - Halaman ${page}`;

  // 2. Buat URL Lengkap untuk SEO (Harus Absolute URL)
  const urlParams = new URLSearchParams();
  if (sp.page && sp.page > 1) urlParams.set('page', sp.page);
  if (sp.status) urlParams.set('status', sp.status);
  if (sp.type) urlParams.set('type', sp.type);
  if (sp.genre) urlParams.set('genre', sp.genre);
  if (sp.q) urlParams.set('q', sp.q);

  const queryString = urlParams.toString();
  const relativePath = `/list${queryString ? `?${queryString}` : ''}`;
  const absoluteUrl = `${SITE_CONFIG.baseUrl}${relativePath}`; // Gabungkan dengan domain utama

  return {
    title: title,
    description: `Filter dan cari komik ${title} terlengkap bahasa Indonesia di ${SITE_CONFIG.name}.`,
    openGraph: {
      title: title,
      description: `Baca dan cari ${title} di ${SITE_CONFIG.name}.`,
      url: absoluteUrl,
      siteName: SITE_CONFIG.name,
      locale: 'id_ID',
      type: 'website',
    },
    alternates: {
        canonical: absoluteUrl,
    }
  };
}

// --- HELPER FILTER BUTTON ---
const FilterButton = ({ label, active, href }) => (
  <Link 
    href={href}
    className={`px-4 py-2 rounded text-xs font-bold uppercase transition border ${
      active 
        ? 'bg-primary border-primary text-white' 
        : 'bg-darker border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
    }`}
  >
    {label}
  </Link>
);

export default async function MangaListPage({ searchParams }) {
  const params = await searchParams;
  
  const page = Number(params.page) || 1;
  const status = params.status || '';
  const type = params.type || '';
  const genre = params.genre || '';
  const q = params.q || '';

  // Fetch Data secara paralel agar lebih cepat
  const [mangaRes, genreRes] = await Promise.all([
    getMangaList(page, status, type, genre, q),
    getGenres()
  ]);

  const mangas = mangaRes.data || [];
  const allGenres = genreRes.data || [];

  // Helper URL Builder
  const buildUrl = (key, value) => {
      const newParams = new URLSearchParams(params);
      if (value === 'all' || !value) newParams.delete(key);
      else newParams.set(key, value);
      
      // Reset page ke 1 setiap kali filter berubah
      newParams.delete('page');
      
      return `/list?${newParams.toString()}`;
  };

  let pageTitle = 'Daftar Komik';
  if (q) pageTitle = `Pencarian: "${q}"`;
  else if (genre) pageTitle = `Genre: ${genre}`;
  else if (type) pageTitle = `Tipe: ${type}`;

  return (
    <main className="min-h-screen bg-dark pb-20 font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
            
            {/* KONTEN UTAMA */}
            <div className="min-w-0">
                
                {/* FILTER BOX */}
                <div className="bg-card p-6 rounded-lg border border-gray-800 mb-8 shadow-lg">
                    <div className="flex items-center gap-2 mb-6 border-b border-gray-700 pb-4">
                        <Filter className="text-primary" />
                        <h1 className="text-xl font-bold text-white uppercase">{pageTitle}</h1>
                    </div>

                    <div className="space-y-4">
                        {/* Filter Status */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs text-gray-500 font-bold w-16">STATUS:</span>
                            <FilterButton label="ALL" active={!status} href={buildUrl('status', 'all')} />
                            <FilterButton label="PUBLISHING" active={status === 'Publishing'} href={buildUrl('status', 'publishing')} />
                            <FilterButton label="FINISHED" active={status === 'Finished'} href={buildUrl('status', 'finished')} />
                        </div>

                        {/* Filter Type */}
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs text-gray-500 font-bold w-16">TYPE:</span>
                            <FilterButton label="ALL" active={!type} href={buildUrl('type', 'all')} />
                            <FilterButton label="MANGA" active={type.toLowerCase() === 'manga'} href={buildUrl('type', 'Manga')} />
                            <FilterButton label="MANHWA" active={type.toLowerCase() === 'manhwa'} href={buildUrl('type', 'Manhwa')} />
                            <FilterButton label="DOUJINSHI" active={type.toLowerCase() === 'doujinshi'} href={buildUrl('type', 'Doujinshi')} />
                        </div>
                    </div>
                </div>

                {/* HASIL DATA */}
                {mangas.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mangas.map(manga => (
                            <MangaCard key={manga._id} manga={manga} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-card rounded-lg border border-gray-800">
                        <p className="text-gray-400 text-lg">Komik tidak ditemukan.</p>
                        <Link href="/list" className="text-primary text-sm mt-2 inline-block hover:underline">
                            Reset Filter
                        </Link>
                    </div>
                )}

                {/* PAGINATION */}
                <div className="flex justify-center gap-2 mt-12">
                    {page > 1 && (
                        <Link 
                            href={`/list?page=${page - 1}&status=${status}&type=${type}&genre=${genre}&q=${q}`} 
                            className="bg-card border border-gray-700 hover:border-primary text-white px-4 py-2 rounded flex items-center gap-1 transition"
                        >
                            <ChevronLeft size={16} /> Prev
                        </Link>
                    )}
                    
                    <span className="bg-primary text-white px-4 py-2 rounded font-bold shadow-lg">
                        {page}
                    </span>

                    {mangas.length >= 20 && (
                        <Link 
                            href={`/list?page=${page + 1}&status=${status}&type=${type}&genre=${genre}&q=${q}`} 
                            className="bg-card border border-gray-700 hover:border-primary text-white px-4 py-2 rounded flex items-center gap-1 transition"
                        >
                            Next <ChevronRight size={16} />
                        </Link>
                    )}
                </div>
            </div>

            {/* SIDEBAR GENRE */}
            <aside className="space-y-8">
                <div className="bg-card p-5 rounded-lg border border-gray-800 shadow-lg sticky top-24">
                    <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2 flex items-center gap-2">
                        <Tag size={18} className="text-primary" /> GENRE
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {allGenres.map((g) => (
                            <Link 
                                key={g} 
                                href={`/list?genre=${g}`} 
                                className={`text-[11px] px-2 py-1.5 rounded transition uppercase border ${
                                    genre === g 
                                    ? 'bg-primary border-primary text-white font-bold shadow-md' 
                                    : 'bg-darker border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'
                                }`}
                            >
                                {g}
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>

        </div>
      </div>
    </main>
  );
}