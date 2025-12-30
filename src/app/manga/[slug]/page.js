import Navbar from '@/components/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import BookmarkButton from '@/components/BookmarkButton';
import MangaCard from '@/components/MangaCard';
import ChapterList from '@/components/ChapterList';
import { Calendar, User, BookOpen, Star, AlertCircle, List, Tag, Eye, Heart } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';
import ShareSidebar from '@/components/ShareSidebar';

// --- FETCH DATA ---
async function getMangaDetail(slug) {
  try {
    const res = await fetch(`${SITE_CONFIG.apiBaseUrl}/manga/${slug}`, {
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
    return { title: 'Manga Tidak Ditemukan' };
  }

  const manga = res.data.info || res.data;
  const finalPath = `${SITE_CONFIG.baseUrl}/manga/${slug}`;

  return {
    title: `${manga.title}`,
    description: `Baca ${manga.metadata?.type || 'komik'} ${manga.title} bahasa Indonesia lengkap di Doujinshi. ${manga.synopsis ? manga.synopsis.slice(0, 150) + '...' : ''}`,
    openGraph: {
      title: `${manga.title} - ${SITE_CONFIG.name}`,
      url: finalPath,
      images: [{ url: manga.thumb }],
    },
    alternates: { canonical: finalPath }
  };
}

// --- COMPONENT HELPER ---
// UPDATE: Mengubah text-sm menjadi text-xs dan mengurangi lebar label (w-32 -> w-24)
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-start gap-3 text-xs mb-2 border-b border-gray-800 pb-2 last:border-0">
    <div className="w-24 flex-shrink-0 text-gray-400 flex items-center gap-2 font-semibold">
      {Icon && <Icon size={12} className="text-primary" />}
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
        <div className="w-full mx-auto px-4 py-20 text-center flex flex-col items-center justify-center h-[60vh]">
          <AlertCircle size={64} className="text-red-500 mb-4 opacity-80" />
          <h1 className="text-2xl font-bold text-white mb-2">Komik Tidak Ditemukan</h1>
          <Link href="/" className="mt-8 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold transition text-sm">
            Kembali ke Home
          </Link>
        </div>
      </main>
    );
  }

  // 2. Ambil Data
  const manga = res.data;
  const chapters = manga.chapters || [];
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
          className="object-cover opacity-10 blur-1xl scale-105"
          alt="background"
          unoptimized
        />
      </div>

      <div className="w-full px-4 lg:px-10 -mt-60 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8"> {/* Gap dikurangi sedikit dari 10 ke 8 */}

          {/* === KOLOM KIRI (KONTEN UTAMA) === */}
          <div className="space-y-8"> {/* Space antar section dikurangi */}

            {/* 1. HEADER INFO */}
            <div className="flex flex-col md:flex-row gap-6"> {/* Gap dikurangi */}

              <div className="w-[140px] md:w-[200px] mx-auto md:mx-0 flex-shrink-0 flex flex-col gap-3">
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden shadow-2xl border border-gray-700/50 group">
                  <Image
                    src={manga.thumb}
                    fill
                    className="object-cover"
                    alt={manga.title}
                    unoptimized
                  />
                  <span className="absolute top-2 left-2 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md uppercase">
                    {manga.metadata?.type || 'Manga'}
                  </span>
                </div>
                <BookmarkButton manga={manga} />
              </div>

              <div className="flex-1 pt-1">
                {/* UPDATE: Judul diperkecil (text-2xl md:text-3xl) */}
                <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 leading-tight">
                  {manga.title}
                </h1>
                
                {/* UPDATE: Alt title diperkecil (text-xs) */}
                {manga.alternativeTitle && (
                  <p className="text-gray-400 text-xs mb-5 italic border-l-2 border-primary pl-3">
                    {manga.alternativeTitle}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mb-6">
                  {/* UPDATE: Padding dan text diperkecil */}
                  <div className="bg-card border border-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Star className="text-yellow-500 fill-yellow-500" size={14} />
                    <span className="text-white text-xs font-bold">{manga.metadata?.rating || 'N/A'}</span>
                  </div>
                  <div className="bg-card border border-gray-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Eye className="text-blue-400" size={14} />
                    <span className="text-white text-xs font-bold">{manga.views || 0} Views</span>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold text-xs
                                ${manga.metadata?.status === 'Finished' ? 'bg-green-600/20 text-green-400 border border-green-600/50' : 'bg-blue-600/20 text-blue-400 border border-blue-600/50'}
                              `}>
                    <span className={`w-1.5 h-1.5 rounded-full ${manga.metadata?.status === 'Finished' ? 'bg-green-400' : 'bg-blue-400'}`}></span>
                    {manga.metadata?.status || 'Unknown'}
                  </div>
                </div>

                <div className="bg-card p-4 rounded-xl border border-gray-800 shadow-inner">
                  <InfoRow label="Penulis" value={manga.metadata?.author} icon={User} />
                  <InfoRow label="Rilis" value={manga.metadata?.created} icon={Calendar} />
                  <InfoRow label="Series" value={manga.metadata?.series} icon={BookOpen} />
                  <InfoRow label="Total Chapter" value={chapters?.length} icon={List} />
                </div>
              </div>
            </div>

            {/* 2. SINOPSIS */}
            <div className="bg-card p-5 rounded-xl border border-gray-800 shadow-lg">
              {/* UPDATE: Header text-base */}
              <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
                <BookOpen className="text-primary" size={18} /> SINOPSIS
              </h3>
              
              {/* UPDATE: Isi sinopsis text-xs md:text-sm */}
              <div className="text-gray-300 leading-relaxed mb-4 text-xs md:text-sm">
                {manga.synopsis ? <p>{manga.synopsis}</p> : <p className="italic text-gray-500">Tidak ada sinopsis.</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                {manga.tags && manga.tags.map((tag) => (
                  <Link key={tag} href={`/list?genre=${tag}`} className="px-2.5 py-1 bg-darker hover:bg-primary border border-gray-700 hover:border-primary text-[10px] md:text-xs text-gray-300 hover:text-white rounded-md transition duration-200 flex items-center gap-1">
                    <Tag size={10} /> {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* 3. CHAPTER LIST */}
            <ChapterList
              chapters={chapters}
              slug={manga.slug}
              updatedAt={manga.updatedAt}
            />

            {/* 4. REKOMENDASI */}
            {recommendations.length > 0 && (
              <section className="bg-card p-5 rounded-xl border border-gray-800 shadow-lg">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-800 pb-3">
                  <Heart className="text-red-500 fill-red-500" size={20} />
                  {/* UPDATE: text-lg */}
                  <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                    YOU MAY ALSO LIKE
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
                  {recommendations.map(item => (
                    <MangaCard key={item._id} manga={item} />
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* === SIDEBAR KANAN === */}
          <aside className="space-y-6">
            <ShareSidebar manga={manga} />
          </aside>

        </div>
      </div>
    </main>
  );
}