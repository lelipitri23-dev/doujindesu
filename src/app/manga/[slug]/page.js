import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import BookmarkButton from '@/components/BookmarkButton';
import MangaCard from '@/components/MangaCard';
import { Calendar, User, BookOpen, Star, AlertCircle, List, Tag, Eye, Heart } from 'lucide-react';

// --- FETCH DATA ---
async function getMangaDetail(slug) {
  try {
   const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const res = await fetch(`${baseUrl}/manga/${slug}`, { 
        cache: 'no-store' 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error("Error fetching manga:", e);
    return null;
  }
}

// --- GENERATE METADATA (SEO) ---
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const res = await getMangaDetail(slug);
  
  if (!res || !res.success || !res.data) {
    return {
      title: 'Manga Tidak Ditemukan',
      description: 'Halaman tidak tersedia.'
      
    };
  }

  // Handle struktur data (fallback untuk info/data langsung)
  const manga = res.data.info || res.data; 
  const finalPath = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/manga/${slug}`; // <--- Definisi URL Halaman ini

  return {
    title: `${manga.title} Bahasa Indonesia`,
    description: `Baca komik ${manga.title} bahasa Indonesia. ${manga.synopsis ? manga.synopsis.slice(0, 150) : 'Sinopsis belum tersedia'}...`,
    keywords: manga.tags || ['komik', 'manga', 'bahasa indonesia'],
    openGraph: {
      title: `${manga.title} - ${process.env.SITE_NAME || 'Doujindesu'}`,
      description: manga.synopsis ? manga.synopsis.slice(0, 200) : `Baca chapter terbaru ${manga.title} sub indo.`,
      url: finalPath,
      siteName: `${process.env.SITE_NAME || 'Doujindesu'}`,
      images: [
        {
          url: manga.thumb, // Gambar cover manga
          width: 800,
          height: 600,
          alt: manga.title,
        },
      ],
      type: 'article',
    },
    alternates: {
        canonical: finalPath, // Penting untuk SEO Google
    }
  };
}

// --- COMPONENT HELPER ---
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3 text-sm mb-3 border-b border-gray-800 pb-2 last:border-0">
    <div className="w-32 flex-shrink-0 text-gray-400 flex items-center gap-2 font-semibold">
      {Icon && <Icon size={14} className="text-primary" />}
      {label}
    </div>
    <div className="flex-1 text-gray-200 font-medium break-words">
      {value || '-'}
    </div>
  </div>
);

export default async function MangaDetail({ params }) {
  const { slug } = await params;
  const res = await getMangaDetail(slug);

  // 1. Validasi Data
  if (!res || !res.success || !res.data) {
    return (
      <main className="min-h-screen bg-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center flex flex-col items-center justify-center h-[60vh]">
          <AlertCircle size={64} className="text-red-500 mb-4 opacity-80" />
          <h1 className="text-3xl font-bold text-white mb-2">Komik Tidak Ditemukan</h1>
          <Link href="/" className="mt-8 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold transition">
            Kembali ke Home
          </Link>
        </div>
      </main>
    );
  }

  // 2. Ambil Data
  const manga = res.data; 
  const chapters = manga.chapters || []; 
  // Ambil data rekomendasi (pastikan backend api.js sudah diupdate)
  const recommendations = manga.recommendations || []; 

  return (
    <main className="min-h-screen bg-dark pb-20 font-sans">
      <Navbar />

      {/* --- BACKGROUND BANNER --- */}
      <div className="relative w-full h-[350px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/50 to-transparent z-10" />
          <Image 
            src={manga.thumb} 
            fill 
            className="object-cover opacity-30 blur-2xl scale-110" 
            alt="background" 
            unoptimized 
          />
      </div>

      <div className="container mx-auto px-4 -mt-60 relative z-20">
         <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
             
             {/* === KOLOM KIRI (KONTEN UTAMA) === */}
             <div className="space-y-10">
                 
                 {/* 1. HEADER INFO */}
                 <div className="flex flex-col md:flex-row gap-8">
                     <div className="w-full md:w-[260px] flex-shrink-0 flex flex-col gap-4">
                         <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 group">
                            <Image src={manga.thumb} fill className="object-cover" alt={manga.title} unoptimized />
                            <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase">
                                {manga.metadata?.type || 'Manga'}
                            </span>
                         </div>
                         <BookmarkButton manga={manga} />
                     </div>

                     <div className="flex-1 pt-2">
                         <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">
                             {manga.title}
                         </h1>
                         {manga.alternativeTitle && (
                            <p className="text-gray-400 text-sm mb-6 italic border-l-2 border-primary pl-3">
                                {manga.alternativeTitle}
                            </p>
                         )}

                         <div className="flex flex-wrap gap-4 mb-8">
                             <div className="bg-card border border-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
                                 <Star className="text-yellow-500 fill-yellow-500" size={18} />
                                 <span className="text-white font-bold">{manga.metadata?.rating || 'N/A'}</span>
                             </div>
                             <div className="bg-card border border-gray-700 px-4 py-2 rounded-lg flex items-center gap-2">
                                 <Eye className="text-blue-400" size={18} />
                                 <span className="text-white font-bold">{manga.views || 0} Views</span>
                             </div>
                             <div className={`px-4 py-2 rounded-lg flex items-center gap-2 font-bold text-sm
                                ${manga.metadata?.status === 'Finished' ? 'bg-green-600/20 text-green-400 border border-green-600/50' : 'bg-blue-600/20 text-blue-400 border border-blue-600/50'}
                             `}>
                                 <span className={`w-2 h-2 rounded-full ${manga.metadata?.status === 'Finished' ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                                 {manga.metadata?.status || 'Unknown'}
                             </div>
                         </div>

                         <div className="bg-card p-5 rounded-xl border border-gray-800 shadow-inner">
                             <InfoRow label="Penulis" value={manga.metadata?.author} icon={User} />
                             <InfoRow label="Rilis" value={manga.metadata?.created} icon={Calendar} />
                             <InfoRow label="Series" value={manga.metadata?.series} icon={BookOpen} />
                             <InfoRow label="Total Chapter" value={chapters?.length} icon={List} />
                         </div>
                     </div>
                 </div>

                 {/* 2. SINOPSIS & TAGS */}
                 <div className="bg-card p-6 rounded-xl border border-gray-800 shadow-lg">
                     <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-gray-800 pb-3">
                         <BookOpen className="text-primary" size={20} /> SINOPSIS
                     </h3>
                     <div className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base">
                         {manga.synopsis ? <p>{manga.synopsis}</p> : <p className="italic text-gray-500">Tidak ada sinopsis.</p>}
                     </div>
                     <div className="flex flex-wrap gap-2">
                         {manga.tags && manga.tags.map((tag) => (
                             <Link key={tag} href={`/list?genre=${tag}`} className="px-3 py-1.5 bg-darker hover:bg-primary border border-gray-700 hover:border-primary text-xs text-gray-300 hover:text-white rounded-md transition duration-200 flex items-center gap-1">
                                 <Tag size={12} /> {tag}
                             </Link>
                         ))}
                     </div>
                 </div>

                 {/* 3. CHAPTER LIST */}
                 <div className="bg-card rounded-xl border border-gray-800 overflow-hidden shadow-lg">
                     <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-card to-darker flex justify-between items-center">
                         <h3 className="text-lg font-bold text-white flex items-center gap-2">
                             <List className="text-primary" size={20} /> DAFTAR CHAPTER
                         </h3>
                         <span className="text-xs bg-darker border border-gray-700 px-3 py-1 rounded-full text-gray-300">
                             Updated: {new Date(manga.updatedAt).toLocaleDateString()}
                         </span>
                     </div>
                     <div className="max-h-[500px] overflow-y-auto custom-scrollbar bg-darker/50 p-3 space-y-2">
                         {chapters.length > 0 ? (
                             chapters.map((chap) => (
                                 <Link href={`/read/${manga.slug}/${chap.slug}`} key={chap._id} className="group flex justify-between items-center p-4 bg-card hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-primary/50 transition-all duration-200">
                                     <div className="flex items-center gap-4">
                                         <div className="w-12 h-12 bg-darker rounded-lg flex items-center justify-center text-gray-500 font-bold text-sm group-hover:bg-primary group-hover:text-white transition shadow-inner">
                                             {chap.chapter_index}
                                         </div>
                                         <span className="text-sm md:text-base font-semibold text-gray-200 group-hover:text-primary transition">
                                            Chapter {chap.title}
                                         </span>
                                     </div>
                                     <span className="text-xs text-gray-500 whitespace-nowrap">
                                         {new Date(chap.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                     </span>
                                 </Link>
                             ))
                         ) : (
                             <div className="text-center py-10 text-gray-500">Belum ada chapter.</div>
                         )}
                     </div>
                 </div>

                 {/* ========================================= */}
                 {/* 4. NEW: YOU MAY ALSO LIKE (12 ITEMS) */}
                 {/* ========================================= */}
                 {recommendations.length > 0 && (
                    <section className="bg-card p-6 rounded-xl border border-gray-800 shadow-lg">
                        <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
                            <Heart className="text-red-500 fill-red-500" size={24} />
                            <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                                YOU MAY ALSO LIKE
                            </h3>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {recommendations.map(item => (
                                <MangaCard key={item._id} manga={item} />
                            ))}
                        </div>
                    </section>
                 )}

             </div>

             {/* === SIDEBAR KANAN === */}
             <aside className="space-y-8">
                 <div className="bg-card p-6 rounded-xl border border-gray-800 text-center shadow-lg sticky top-24">
                     <h3 className="text-white font-bold mb-2 text-lg">Dukung {manga.metadata?.author || 'Author'}!</h3>
                     <p className="text-sm text-gray-400 mb-6">Jangan lupa beli karya aslinya.</p>
                     <div className="space-y-2">
                         <button className="w-full bg-[#1877F2] hover:bg-blue-700 text-white text-sm font-bold py-2.5 rounded-lg transition">Facebook</button>
                         <button className="w-full bg-[#1DA1F2] hover:bg-sky-500 text-white text-sm font-bold py-2.5 rounded-lg transition">Twitter</button>
                         <button className="w-full bg-[#25D366] hover:bg-green-600 text-white text-sm font-bold py-2.5 rounded-lg transition">WhatsApp</button>
                     </div>
                 </div>
             </aside>

         </div>
      </div>
    </main>
  );
}