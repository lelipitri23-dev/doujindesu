import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, List, Home, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config'; // Import Config

// --- FETCH DATA ---
async function getChapterData(slug, chapterSlug) {
  try {
    // Menggunakan API Base URL dari Config
    // Note: Pastikan route di backend benar (misal: /read/{slug}/{chapter})
    const res = await fetch(`${SITE_CONFIG.apiBaseUrl}/read/${slug}/${chapterSlug}`, { 
      cache: 'no-store' 
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    console.error("Gagal mengambil data chapter:", e);
    return null;
  }
}

// --- GENERATE METADATA (SEO) ---
export async function generateMetadata({ params }) {
  const { slug, chapterSlug } = await params;
  const res = await getChapterData(slug, chapterSlug);

  if (!res || !res.success || !res.data) {
    return { title: 'Chapter Tidak Ditemukan' };
  }

  const { title, manga } = res.data;

  return {
    title: `Baca ${manga.title} ${title} Bahasa Indonesia`,
    description: `Baca online ${manga.title} chapter ${title} bahasa Indonesia lengkap di Doujinshi. ${SITE_CONFIG.name}.`,
    canonical: `${SITE_CONFIG.baseUrl}/read/${slug}/${chapterSlug}`,
    openGraph: {
      title: `${manga.title} ${title} - ${SITE_CONFIG.name}`,
      description: `Baca chapter terbaru ${manga.title} bahasa Indonesia.`,
      url: `${SITE_CONFIG.baseUrl}/read/${slug}/${chapterSlug}`,
      siteName: SITE_CONFIG.name,
      locale: 'id_ID',
      type: 'website',
      images: [
        {
            url: manga.thumb,
            width: 600,
            height: 800,
            alt: `${manga.title} Cover`,
        }
      ], 
    },
  };
}

// --- KOMPONEN NAVIGASI (PREV/NEXT) ---
const ChapterNavigation = ({ prev, next, mangaSlug, currentTitle }) => (
  <div className="bg-card p-4 rounded-lg border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
      
      {/* Tombol Kiri (Prev / Daftar) */}
      <div className="flex items-center gap-2 w-full md:w-auto">
          <Link 
            href={`/manga/${mangaSlug}`} 
            className="bg-darker hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition"
          >
             <List size={16}/> Daftar Chapter
          </Link>
          
          {prev ? (
             <Link 
               href={`/read/${mangaSlug}/${prev}`} 
               className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-1 transition"
             >
                <ChevronLeft size={16}/> Prev
             </Link>
          ) : (
             <button disabled className="bg-gray-700 text-gray-500 px-4 py-2 rounded text-sm font-bold flex items-center gap-1 cursor-not-allowed">
                <ChevronLeft size={16}/> Prev
             </button>
          )}
      </div>

      {/* Judul Tengah (Hidden di Mobile biar rapi) */}
      <div className="hidden md:block text-gray-400 text-sm font-medium">
          {currentTitle}
      </div>

      {/* Tombol Kanan (Next) */}
      <div className="w-full md:w-auto flex justify-end">
          {next ? (
             <Link 
               href={`/read/${mangaSlug}/${next}`} 
               className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-1 transition"
             >
                Next <ChevronRight size={16}/>
             </Link>
          ) : (
             <button disabled className="bg-gray-700 text-gray-500 px-4 py-2 rounded text-sm font-bold flex items-center gap-1 cursor-not-allowed">
                Next <ChevronRight size={16}/>
             </button>
          )}
      </div>
  </div>
);

// --- MAIN PAGE ---
export default async function ReadPage({ params }) {
  const { slug, chapterSlug } = await params;
  const res = await getChapterData(slug, chapterSlug);
  
  // Handle Error / Not Found
  if (!res || !res.success || !res.data) {
    return (
      <main className="min-h-screen bg-dark">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <h1 className="text-white text-xl font-bold">Chapter Tidak Ditemukan</h1>
          <p className="text-gray-400 mt-2">Mungkin chapter ini belum rilis atau telah dihapus.</p>
          <Link href="/" className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded mt-6 inline-block transition">
            Kembali ke Home
          </Link>
        </div>
      </main>
    );
  }
  
  const { data } = res;
  const { prev_slug, next_slug } = data.navigation;

  return (
    <main className="min-h-screen bg-darker pb-20 font-sans">
      <Navbar />

      {/* BREADCRUMB & JUDUL */}
      <div className="bg-card border-b border-gray-800 py-6 mb-8">
          <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 uppercase flex-wrap">
                  <Link href="/" className="hover:text-white"><Home size={12}/></Link> 
                  <span>/</span>
                  <Link href={`/manga/${slug}`} className="hover:text-white line-clamp-1 max-w-[150px]">{data.manga.title}</Link>
                  <span>/</span>
                  <span className="text-primary font-bold">{data.title}</span>
              </div>
              <h1 className="text-lg md:text-2xl font-bold text-white">
                  {data.manga.title} {data.title} Bahasa Indonesia
              </h1>
          </div>
      </div>

      <div className="container mx-auto px-0 md:px-4 max-w-5xl">
          
          {/* NAVIGASI ATAS */}
          <div className="px-4 md:px-0">
            <ChapterNavigation 
                prev={prev_slug} 
                next={next_slug} 
                mangaSlug={slug} 
                currentTitle={data.title} 
            />
          </div>

          {/* AREA BACA GAMBAR */}
          <div className="bg-black shadow-2xl min-h-screen border-y md:border border-gray-800 overflow-hidden">
              {data.images && data.images.map((imgUrl, index) => (
                  <div key={index} className="relative w-full">
                      {/* Menggunakan tag img biasa untuk performa reader yang lebih baik (mengurangi layout shift) */}
                      <img 
                        src={imgUrl} 
                        alt={`${data.title} - Halaman ${index + 1}`} 
                        className="w-full h-auto block mx-auto md:max-w-[800px]"
                        loading="lazy" 
                        referrerPolicy="no-referrer"
                      />
                  </div>
              ))}
          </div>

          {/* NAVIGASI BAWAH */}
          <div className="mt-8 px-4 md:px-0">
            <div className="text-center text-gray-400 text-sm mb-4 bg-card p-2 rounded border border-gray-800 inline-block w-full">
                Baru saja membaca <strong>{data.title}</strong>
            </div>
            <ChapterNavigation 
                prev={prev_slug} 
                next={next_slug} 
                mangaSlug={slug} 
                currentTitle="Selesai Membaca" 
            />
          </div>

          {/* KOMENTAR / REPORT */}
          <div className="bg-card p-6 rounded-lg border border-gray-800 mt-8 text-center mx-4 md:mx-0">
              <p className="text-gray-400 text-sm">
                  Jika gambar rusak atau tidak muncul, silakan lapor di Fanspage atau{' '}
                  <a 
                    href={SITE_CONFIG.socials.discord || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-primary hover:underline font-bold"
                  >
                    Discord
                  </a> 
                  {' '}kami.
              </p>
          </div>

      </div>
    </main>
  );
}