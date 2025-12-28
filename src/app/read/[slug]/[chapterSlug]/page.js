import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, List, Home, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';
import ChapterMenu from '@/components/ChapterMenu'; // <--- IMPORT BARU

// --- FETCH DATA ---

async function getChapterData(slug, chapterSlug) {
  try {
    const res = await fetch(`${SITE_CONFIG.apiBaseUrl}/read/${slug}/${chapterSlug}`, { 
      cache: 'no-store' 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

async function getMangaDetail(slug) {
  try {
    const res = await fetch(`${SITE_CONFIG.apiBaseUrl}/manga/${slug}`, { 
        cache: 'no-store',
        next: { revalidate: 60 } 
    });
    if (!res.ok) return null;
    return res.json();
  } catch (e) {
    return null;
  }
}

// --- GENERATE METADATA ---
export async function generateMetadata({ params }) {
  const { slug, chapterSlug } = await params;
  const res = await getChapterData(slug, chapterSlug);

  if (!res || !res.success || !res.data) {
    return { title: 'Chapter Tidak Ditemukan' };
  }

  const { title, manga } = res.data;

  return {
    title: `Baca ${manga.title} Chapter ${title} Bahasa Indonesia`,
    description: `Baca online ${manga.title} chapter ${title} sub indo kualitas HD.`,
    canonical: `${SITE_CONFIG.baseUrl}/read/${slug}/${chapterSlug}`,
    openGraph: {
      title: `${manga.title} Chapter ${title}`,
      url: `${SITE_CONFIG.baseUrl}/read/${slug}/${chapterSlug}`,
      images: [{ url: manga.thumb }],
    },
  };
}

// --- KOMPONEN: NAVIGASI ---
const ChapterNavigation = ({ prev, next, mangaSlug }) => (
  <div className="bg-card p-4 rounded-lg border border-gray-800 flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-6 shadow-lg">
      <Link 
        href={`/manga/${mangaSlug}`} 
        className="bg-darker hover:bg-gray-700 border border-gray-700 text-white px-5 py-2.5 rounded font-bold flex items-center gap-2 transition w-full md:w-auto justify-center"
      >
         <List size={20}/> <span className="text-sm">Info Manga</span>
      </Link>

      <div className="flex items-center gap-2 w-full md:w-auto justify-center">
          {prev ? (
             <Link 
               href={`/read/${mangaSlug}/${prev}`} 
               className="bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2.5 rounded font-bold flex items-center gap-1 transition shadow-md flex-1 md:flex-none justify-center"
             >
                <ChevronLeft size={20}/> Prev
             </Link>
          ) : (
             <button disabled className="bg-gray-700 text-gray-400 px-6 py-2.5 rounded font-bold flex items-center gap-1 cursor-not-allowed opacity-50 flex-1 md:flex-none justify-center">
                <ChevronLeft size={20}/> Prev
             </button>
          )}

          {next ? (
             <Link 
               href={`/read/${mangaSlug}/${next}`} 
               className="bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2.5 rounded font-bold flex items-center gap-1 transition shadow-md flex-1 md:flex-none justify-center"
             >
                Next <ChevronRight size={20}/>
             </Link>
          ) : (
             <button disabled className="bg-gray-700 text-gray-400 px-6 py-2.5 rounded font-bold flex items-center gap-1 cursor-not-allowed opacity-50 flex-1 md:flex-none justify-center">
                Next <ChevronRight size={20}/>
             </button>
          )}
      </div>
  </div>
);

// --- MAIN PAGE ---
export default async function ReadPage({ params }) {
  const { slug, chapterSlug } = await params;
  
  const [chapterRes, mangaRes] = await Promise.all([
    getChapterData(slug, chapterSlug),
    getMangaDetail(slug)
  ]);
  
  if (!chapterRes || !chapterRes.success || !chapterRes.data) {
    return (
      <main className="min-h-screen bg-dark">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <AlertCircle size={64} className="mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-white">Chapter Tidak Ditemukan</h1>
          <Link href="/" className="bg-primary text-white px-6 py-3 rounded mt-6 inline-block">Kembali ke Home</Link>
        </div>
      </main>
    );
  }
  
  const data = chapterRes.data;
  const allChapters = mangaRes?.data?.chapters || []; 
  const { prev_slug, next_slug } = data.navigation;

  return (
    <main className="min-h-screen bg-[#111] pb-20 font-sans">
      <Navbar />

      {/* HEADER */}
      <div className="bg-card border-b border-gray-800 py-6 mb-6 shadow-md relative z-10">
          <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2 uppercase">
                  <Link href="/" className="hover:text-primary"><Home size={12}/></Link> /
                  <Link href={`/manga/${slug}`} className="hover:text-primary line-clamp-1">{data.manga.title}</Link> /
                  <span className="text-primary font-bold">Chapter {data.title}</span>
              </div>
              <h1 className="text-lg md:text-2xl font-bold text-white leading-tight">
                  {data.manga.title} <span className="text-primary">Chapter {data.title}</span>
              </h1>
          </div>
      </div>

      {/* CONTAINER */}
      <div className="container mx-auto px-0 lg:px-4 flex justify-center lg:justify-between gap-6 relative">
          
          {/* === KOLOM KIRI (READER) === */}
          <div className="w-full lg:w-[calc(100%-340px)] min-w-0">
            
            <div className="px-4 lg:px-0">
                <ChapterNavigation prev={prev_slug} next={next_slug} mangaSlug={slug} />
            </div>

            {/* GAMBAR */}
            <div className="bg-black shadow-2xl min-h-screen w-full mx-auto rounded-none lg:rounded-xl overflow-hidden border-y lg:border border-gray-800/50">
                {data.images && data.images.map((imgUrl, index) => (
                    <div key={index} className="w-full">
                        <img 
                            src={imgUrl} 
                            alt={`${data.title} - ${index + 1}`} 
                            className="w-full h-auto block mx-auto md:max-w-4xl"
                            loading="lazy" 
                        />
                    </div>
                ))}
            </div>

            <div className="mt-8 px-4 lg:px-0">
                <ChapterNavigation prev={prev_slug} next={next_slug} mangaSlug={slug} />
            </div>
          </div>

          {/* === KOLOM KANAN (MENU DINAMIS) === */}
          {/* Komponen ini menangani Sidebar Desktop DAN Menu Mobile */}
          <ChapterMenu 
              chapters={allChapters} 
              currentSlug={chapterSlug}
              mangaSlug={slug}
          />

      </div>
    </main>
  );
}