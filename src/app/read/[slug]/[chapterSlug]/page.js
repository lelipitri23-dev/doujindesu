import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, List, Home, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/config';
import ChapterMenu from '@/components/ChapterMenu'; 

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

// --- GENERATE METADATA (SEO OPTIMIZED) ---
export async function generateMetadata({ params }) {
  const { slug, chapterSlug } = await params;
  const res = await getChapterData(slug, chapterSlug);

  if (!res || !res.success || !res.data) {
    return { title: 'Chapter Tidak Ditemukan - 404' };
  }

  const { chapter, manga } = res.data;
  const siteName = SITE_CONFIG.name;
  
  // Format Title SEO Friendly
  const pageTitle = `Baca ${manga.title} Chapter ${chapter.title} Bahasa Indonesia`;
  
  // Format Description sesuai request keyword
  const description = `Baca manga ${manga.title} Chapter ${chapter.title} bahasa Indonesia terbaru di ${siteName}. Manga ${manga.title} bahasa Indonesia selalu update di ${siteName}.`;

  return {
    title: pageTitle,
    description: description,
    keywords: [
      `baca ${manga.title} chapter ${chapter.title}`,
      `${manga.title} chapter ${chapter.title} bahasa indonesia`,
      `baca ${manga.title} sub indo`,
      `komik ${manga.title}`,
      `read ${manga.title}`,
      siteName
    ],
    canonical: `${SITE_CONFIG.baseUrl}/read/${slug}/${chapterSlug}`,
    openGraph: {
      title: pageTitle,
      description: description,
      url: `${SITE_CONFIG.baseUrl}/read/${slug}/${chapterSlug}`,
      images: [{ url: manga.thumb }],
      type: 'article',
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

// --- KOMPONEN: NAVIGASI ---
const ChapterNavigation = ({ prev, next, mangaSlug }) => (
  <div className="bg-card p-3 rounded-lg border border-gray-800 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 mb-6 shadow-lg">
      <Link 
        href={`/manga/${mangaSlug}`} 
        className="bg-darker hover:bg-gray-700 border border-gray-700 text-white px-4 py-2 rounded font-bold flex items-center gap-2 transition w-full md:w-auto justify-center text-xs"
        title="Kembali ke Info Manga"
      >
         <List size={16}/> <span>Info Manga</span>
      </Link>

      <div className="flex items-center gap-2 w-full md:w-auto justify-center">
          {prev ? (
             <Link 
               href={`/read/${mangaSlug}/${prev.slug || prev}`} 
               className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded font-bold flex items-center gap-1 transition shadow-md flex-1 md:flex-none justify-center text-xs"
             >
                <ChevronLeft size={16}/> Prev
             </Link>
          ) : (
             <button disabled className="bg-gray-700 text-gray-400 px-5 py-2 rounded font-bold flex items-center gap-1 cursor-not-allowed opacity-50 flex-1 md:flex-none justify-center text-xs">
                <ChevronLeft size={16}/> Prev
             </button>
          )}

          {next ? (
             <Link 
               href={`/read/${mangaSlug}/${next.slug || next}`} 
               className="bg-[#3b82f6] hover:bg-blue-600 text-white px-5 py-2 rounded font-bold flex items-center gap-1 transition shadow-md flex-1 md:flex-none justify-center text-xs"
             >
                Next <ChevronRight size={16}/>
             </Link>
          ) : (
             <button disabled className="bg-gray-700 text-gray-400 px-5 py-2 rounded font-bold flex items-center gap-1 cursor-not-allowed opacity-50 flex-1 md:flex-none justify-center text-xs">
                Next <ChevronRight size={16}/>
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
  
  // Validasi response
  if (!chapterRes || !chapterRes.success || !chapterRes.data) {
    return (
      <main className="min-h-screen bg-dark">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <AlertCircle size={64} className="mb-4 text-red-500" />
          <h1 className="text-xl font-bold text-white">Chapter Tidak Ditemukan</h1>
          <Link href="/" className="bg-primary text-white px-6 py-2 rounded mt-6 inline-block text-sm">Kembali ke Home</Link>
        </div>
      </main>
    );
  }
  
  const { chapter, manga, navigation } = chapterRes.data;
  const allChapters = mangaRes?.data?.chapters || []; 

  // --- STRUCTURED DATA (Breadcrumbs) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_CONFIG.baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": manga.title,
        "item": `${SITE_CONFIG.baseUrl}/manga/${slug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `Chapter ${chapter.title}`
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#111] pb-20 font-sans">
      <Navbar />

      {/* SEO: Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HEADER */}
      <div className="bg-card border-b border-gray-800 py-4 mb-4 shadow-md relative z-10">
          <div className="w-full px-4 lg:px-8">
              <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-400 mb-1 uppercase">
                  <Link href="/" className="hover:text-primary"><Home size={12}/></Link> /
                  <Link href={`/manga/${slug}`} className="hover:text-primary line-clamp-1">{manga.title}</Link> /
                  <span className="text-primary font-bold">Ch. {chapter.title}</span>
              </div>
              {/* SEO: H1 memuat keyword utama */}
              <h1 className="text-base md:text-lg font-bold text-white leading-tight">
                  Baca {manga.title} <span className="text-primary">Chapter {chapter.title}</span> Bahasa Indonesia
              </h1>
          </div>
      </div>

      {/* WRAPPER UTAMA */}
      <div className="w-full px-0 lg:px-6 flex justify-center lg:justify-between gap-6 relative">
          
          {/* === KOLOM KIRI (READER) === */}
          <div className="w-full lg:w-[calc(100%-300px)] min-w-0">
            
            <div className="px-4 lg:px-0 max-w-5xl mx-auto w-full"> 
                <ChapterNavigation prev={navigation.prev} next={navigation.next} mangaSlug={slug} />
            </div>

            {/* GAMBAR READER */}
            <div className="bg-black shadow-2xl min-h-screen w-full mx-auto rounded-none lg:rounded-xl overflow-hidden border-y lg:border border-gray-800/50">
                {chapter.images && chapter.images.map((imgUrl, index) => (
                    <div key={index} className="w-full flex justify-center bg-[#111]">
                        <img 
                            src={imgUrl} 
                            // SEO: Alt Text yang sangat deskriptif
                            alt={`Baca komik ${manga.title} Chapter ${chapter.title} halaman ${index + 1} bahasa Indonesia`} 
                            className="w-full h-auto block max-w-4xl" 
                            loading="lazy" 
                        />
                    </div>
                ))}
            </div>

            <div className="mt-8 px-4 lg:px-0 max-w-5xl mx-auto w-full">
                <ChapterNavigation prev={navigation.prev} next={navigation.next} mangaSlug={slug} />
                
                {/* --- SEO KEYWORD PARAGRAPH (Permintaan User) --- */}
                <div className="mt-10 mb-8 p-4 bg-card/50 rounded-lg border border-gray-800 text-center">
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Baca manga <strong className="text-gray-300">{manga.title} Chapter {chapter.title}</strong> bahasa Indonesia terbaru di <strong className="text-primary">{SITE_CONFIG.name}</strong>. 
                        Manga {manga.title} bahasa Indonesia selalu update di {SITE_CONFIG.name}. 
                        Jangan lupa membaca update manga lainnya ya. Daftar koleksi manga {SITE_CONFIG.name} ada di menu <Link href="/list" className="text-primary hover:underline" title="Daftar Manga Lengkap">Daftar Manga</Link>.
                    </p>
                </div>
            </div>
          </div>

          {/* === KOLOM KANAN (MENU DINAMIS) === */}
          <div className="hidden lg:block w-[300px] flex-shrink-0">
             <div className="sticky top-24">
                <ChapterMenu 
                    chapters={allChapters} 
                    currentSlug={chapterSlug}
                    mangaSlug={slug}
                />
             </div>
          </div>

      </div>
    </main>
  );
}