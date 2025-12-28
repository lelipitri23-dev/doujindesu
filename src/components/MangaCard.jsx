import Link from 'next/link';
import Image from 'next/image';

export default function MangaCard({ manga }) {
  const thumb = manga.thumb || '/placeholder.jpg';
  
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 border border-gray-800">
        <Link href={`/manga/${manga.slug}`}>
            <div className="relative aspect-[3/4] overflow-hidden">
                <Image 
                    src={thumb} 
                    alt={manga.title || 'Manga'} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <span className="absolute top-2 left-2 bg-primary text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase shadow-md">
                    {manga.metadata?.type || 'Manga'}
                </span>
                
                <span className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-bold px-1.5 rounded">
                    ★ {manga.metadata?.rating || '?'}
                </span>
            </div>
        </Link>

        <div className="p-3">
            <Link href={`/manga/${manga.slug}`}>
                <h3 className="text-white text-sm font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {manga.title}
                </h3>
            </Link>
            
            <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                <span>
                   {manga.latestChapter ? `Ch. ${manga.latestChapter.chapter_index}` : 'Unknown'}
                </span>
            </div>
        </div>
    </div>
  );
}