'use client';
import useBookmark from '@/hooks/useBookmark';
import { Bookmark } from 'lucide-react';

export default function BookmarkButton({ manga }) {
  const { isBookmarked, toggleBookmark } = useBookmark(manga);

  return (
    <button 
      onClick={toggleBookmark}
      className={`w-full font-bold py-3 px-4 rounded mt-4 transition flex items-center justify-center gap-2 ${
        isBookmarked ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:bg-blue-600'
      }`}
    >
      <Bookmark className="w-4 h-4" fill={isBookmarked ? "white" : "none"} />
      {isBookmarked ? 'TERSIMPAN' : 'BOOKMARK'}
    </button>
  );
}