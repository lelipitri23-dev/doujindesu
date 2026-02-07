import Link from 'next/link';
import { Eye, Clock } from 'lucide-react';

export default function ChapterList({ chapters, slug }) {
  if (!chapters || chapters.length === 0) {
    return <div className="p-4 text-center text-gray-500">Belum ada chapter.</div>;
  }

  return (
    <div className="bg-card rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-800 bg-darker">
        <h3 className="font-bold text-white">Daftar Chapter</h3>
      </div>
      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {chapters.map((chapter) => (
          <Link 
            key={chapter._id} 
            href={`/read/${slug}/${chapter.slug}`}
            className="flex items-center justify-between p-3 hover:bg-gray-800 border-b border-gray-800/50 last:border-0 transition group"
          >
            <div className="flex items-center gap-3">
              <span className="bg-gray-800 text-gray-400 group-hover:bg-primary group-hover:text-white px-3 py-1 rounded text-xs font-bold transition">
                Ch. {chapter.chapter_index}
              </span>
              <span className="text-sm text-gray-300 group-hover:text-white font-medium line-clamp-1">
                {chapter.title || `Chapter ${chapter.chapter_index}`}
              </span>
            </div>
            <div className="text-[10px] text-gray-500 flex flex-col items-end">
               <span className="flex items-center gap-1"><Clock size={10}/> {new Date(chapter.createdAt).toLocaleDateString('id-ID')}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}