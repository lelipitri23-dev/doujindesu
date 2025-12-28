import Navbar from '@/components/Navbar';
import MangaCard from '@/components/MangaCard';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Flame, Clock, BookOpen, Star, Palette } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config'; // Import konfigurasi terpusat

// --- DATA FETCHING ---
async function getHomeData() {
  try {
    // Menggunakan API Base URL dari Config
    const res = await fetch(`${SITE_CONFIG.apiBaseUrl}/home`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) throw new Error('Fetch failed');
    return res.json();
  } catch (e) {
    console.error("Error fetching home data:", e);
    return { success: false, data: null };
  }
}

async function getGenres() {
  try {
    const res = await fetch(`${SITE_CONFIG.apiBaseUrl}/genres`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return { data: [] };
    return res.json();
  } catch (e) { 
    return { data: [] }; 
  }
}

// --- HELPER COMPONENTS ---

// 1. Judul Section yang Keren
const SectionHeader = ({ title, icon: Icon, link, color = "border-primary" }) => (
  <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
    <h2 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 uppercase">
      {Icon && <Icon className="text-primary w-5 h-5" />}
      <span className={`border-l-4 pl-3 ${color}`}>{title}</span>
    </h2>
    {link && (
      <Link href={link} className="text-[10px] md:text-xs bg-darker hover:bg-primary border border-gray-700 hover:border-primary text-gray-300 hover:text-white px-3 py-1 rounded transition flex items-center gap-1">
        Lihat Semua <ChevronRight size={12} />
      </Link>
    )}
  </div>
);

// 2. Sidebar Item (Popular List)
const PopularSidebarItem = ({ manga, index }) => (
  <div className="flex gap-3 items-center border-b border-gray-800 pb-3 last:border-0 group">
    <div className={`
      w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-sm rounded shadow-md
      ${index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' : 
        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' : 
        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-700 text-white' : 'bg-darker text-gray-500 border border-gray-700'}
    `}>
      {index + 1}
    </div>
    <div className="w-14 h-16 relative flex-shrink-0 overflow-hidden rounded bg-gray-800">
      <Image 
        src={manga.thumb} 
        alt={manga.title} 
        fill 
        className="object-cover group-hover:scale-110 transition duration-300" 
        unoptimized 
      />
    </div>
    <div className="flex-1 min-w-0">
      <Link href={`/manga/${manga.slug}`}>
        <h4 className="text-xs md:text-sm text-white font-medium line-clamp-2 group-hover:text-primary transition">
          {manga.title}
        </h4>
      </Link>
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Star size={10} className="text-yellow-500 fill-yellow-500" />
            <span>{manga.metadata?.rating || '7.0'}</span>
        </div>
        <span className="text-[10px] text-gray-500">
            {manga.views ? (manga.views / 1000).toFixed(1) + 'K' : '0'} Views
        </span>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
export default async function Home() {
  const homeRes = await getHomeData();
  const genreRes = await getGenres();

  // Error Handling UI
  if (!homeRes.data) {
    return (
      <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">Gagal Memuat Data</h1>
        <p className="text-gray-400">Pastikan Backend berjalan di {SITE_CONFIG.apiBaseUrl}</p>
      </div>
    );
  }

  // Ambil semua data dari API Home
  const { recents, popular, manhwa, doujinshi } = homeRes.data;
  const genres = genreRes.data || [];

  return (
    <main className="min-h-screen bg-dark pb-20 font-sans">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            
            {/* === KOLOM KIRI (KONTEN UTAMA) === */}
            <div className="space-y-12 min-w-0">
                
                {/* 1. HOT KOMIK UPDATE (Slider Horizontal) */}
                <section>
                    <div className="bg-card p-5 rounded-lg border border-gray-800 shadow-xl relative overflow-hidden">
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Flame size={100} />
                        </div>

                        <SectionHeader title="POPULAR TODAY" icon={Flame} color="border-red-500" />
                        
                        {/* Slider Container */}
                        <div className="flex overflow-x-auto gap-4 pb-2 snap-x custom-scrollbar">
                            {popular.slice(0, 10).map((manga) => (
                                <div key={manga._id} className="w-[140px] md:w-[160px] flex-shrink-0 snap-start">
                                    <MangaCard manga={manga} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2. RILISAN TERBARU (Grid) */}
                <section>
                    <SectionHeader title="RILISAN TERBARU" icon={Clock} link="/list?orderby=latest" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {recents.slice(0, 8).map((manga) => (
                             <MangaCard key={manga._id} manga={manga} />
                        ))}
                    </div>
                </section>

                {/* 3. MANHWA UPDATE (Grid) */}
                <section>
                    <SectionHeader title="MANHWA UPDATE" icon={BookOpen} link="/type/manhwa" color="border-green-500" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {manhwa && manhwa.slice(0, 12).map((manga) => (
                            <MangaCard key={manga._id} manga={manga} />
                        ))}
                    </div>
                </section>

                {/* 4. DOUJINSHI UPDATE (Grid) */}
                <section>
                    <SectionHeader title="DOUJINSHI UPDATE" icon={Palette} link="/type/doujinshi" color="border-pink-500" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {doujinshi && doujinshi.slice(0, 12).map((manga) => (
                            <MangaCard key={manga._id} manga={manga} />
                        ))}
                    </div>
                </section>

            </div>

            {/* === KOLOM KANAN (SIDEBAR) === */}
            <aside className="space-y-8">
                
                {/* Widget: Genre Cloud */}
                <div className="bg-card p-5 rounded-lg border border-gray-800 shadow-lg">
                    <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2 uppercase text-xs tracking-wider flex items-center gap-2">
                        <span className="w-1 h-4 bg-primary rounded"></span> Genre
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {genres.slice(0, 30).map((genre) => (
                            <Link 
                                key={genre} 
                                href={`/list?genre=${genre}`} 
                                className="text-[10px] uppercase font-bold bg-darker hover:bg-primary border border-gray-700 hover:border-primary text-gray-400 hover:text-white px-2 py-1 rounded transition"
                            >
                                {genre}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Widget: Popular List Sidebar */}
                <div className="bg-card p-5 rounded-lg border border-gray-800 shadow-lg">
                    <h3 className="text-white font-bold mb-4 border-b border-gray-700 pb-2 uppercase text-xs tracking-wider flex items-center gap-2">
                        <span className="w-1 h-4 bg-yellow-500 rounded"></span> Top Weekly
                    </h3>
                    <div className="space-y-2">
                         {popular.slice(0, 12).map((manga, idx) => (
                             <PopularSidebarItem key={manga._id} manga={manga} index={idx} />
                         ))}
                    </div>
                </div>

                {/* Widget: Discord (Menggunakan Link dari Config) */}
                <a 
                  href={SITE_CONFIG.socials.discord || '#'} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative h-24 rounded-lg overflow-hidden group shadow-lg"
                >
                    <div className="absolute inset-0 bg-[#5865F2] flex items-center justify-center group-hover:bg-[#4752c4] transition">
                        <span className="font-bold text-white flex items-center gap-2">
                            <span className="bg-white text-[#5865F2] p-1 rounded-full text-xs">JOIN</span> DISCORD SERVER
                        </span>
                    </div>
                </a>

            </aside>
        </div>
      </div>
    </main>
  );
}