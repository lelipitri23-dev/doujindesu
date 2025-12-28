import Navbar from '@/components/Navbar';
import MangaCard from '@/components/MangaCard';

async function searchManga(query) {
  const res = await fetch(`http://localhost:5000/api/manga?q=${query}`, { cache: 'no-store' });
  return res.json();
}

//Generate Metadata
export async function generateMetadata({ searchParams }) {
  const sp = await searchParams;
  const query = sp.q || '';
  const title = query ? `Hasil Pencarian: "${query}"` : 'Pencarian Komik';
  return {
    title: title,
    description: `Hasil pencarian komik untuk "${query}" di database kami.`,
    openGraph: {
      title: title,
      description: `Hasil pencarian komik untuk "${query}" di database kami.`,
      url: `http://localhost:3000/search${query ? `?q=${encodeURIComponent(query)}` : ''}`, // Ganti dengan domain asli saat deploy
    },
  };
}

export default async function SearchPage({ searchParams }) {
  const params = await searchParams;
  const query = params.q || '';
  const { data: mangas } = await searchManga(query);

  return (
    <main className="min-h-screen bg-dark pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-xl font-bold text-white mb-6 border-l-4 border-primary pl-4">
            Hasil: "{query}"
        </h1>
        {mangas?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {mangas.map(m => <MangaCard key={m._id} manga={m} />)}
            </div>
        ) : <p className="text-gray-500">Tidak ditemukan.</p>}
      </div>
    </main>
  );
}