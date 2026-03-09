import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { getBookBySlug } from "@/lib/actions/book.actions";
import { cn } from "@/lib/utils";

interface BookPageProps {
  params: { slug: string };
}

export default async function BookPage({ params }: BookPageProps) {
  // Require authentication
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch book by slug
  const { success, data: book } = await getBookBySlug(params.slug);
  if (!success || !book) {
    redirect("/");
  }

  return (
    <div className="book-page-container flex flex-col items-center py-12 px-2">
      {/* Header Card */}
      <div className="vapi-header-card bg-[#f3e4c7] rounded-xl p-8 flex w-full max-w-4xl mb-8 relative">
        {/* Book Cover + Mic Button */}
        <div className="relative mr-8 shrink-0">
          <Image
            src={book.coverURL}
            alt={book.title}
            width={120}
            height={160}
            className="rounded shadow-lg object-cover"
            priority
          />
          {/* Mic Button (overlapping) */}
          <button
            className="vapi-mic-btn absolute -bottom-4 -right-4 w-15 h-15 bg-white rounded-full flex items-center justify-center shadow-lg border"
            type="button"
            aria-label="Mic off"
          >
            {/* Mic-off icon (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-7 h-7 text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12.75V12a3 3 0 10-6 0v.75m9 0A6.75 6.75 0 016 12.75m9 0v.75a3 3 0 01-6 0v-.75m9 0v.75a6.75 6.75 0 01-13.5 0v-.75m13.5 0V12a6.75 6.75 0 00-13.5 0v.75m13.5 0V12a6.75 6.75 0 00-13.5 0v.75"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 19.5L4.5 4.5"
              />
            </svg>
          </button>
        </div>
        {/* Book Info */}
        <div className="flex flex-col justify-center flex-1 min-w-0">
          <h1 className="font-serif text-3xl font-bold truncate mb-1">
            {book.title}
          </h1>
          <div className="text-lg text-gray-700 mb-4">by {book.author}</div>
          <div className="flex gap-2">
            {/* Status badge */}
            <span className="vapi-status-indicator flex items-center bg-white rounded-full px-3 py-1 text-sm shadow">
              <span className="vapi-status-dot w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
              <span className="vapi-status-text">Ready</span>
            </span>
            {/* Voice badge */}
            <span className="bg-white rounded-full px-3 py-1 text-sm shadow">
              Voice: {book.persona}
            </span>
            {/* Timer badge */}
            <span className="bg-white rounded-full px-3 py-1 text-sm shadow">
              0:00/15:00
            </span>
          </div>
        </div>
      </div>

      {/* Transcript Area */}
      <div className="transcript-container bg-white rounded-xl min-h-100 w-full max-w-4xl flex flex-col items-center justify-center p-12">
        <div className="transcript-empty flex flex-col items-center">
          {/* Mic icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-gray-300 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18.75v2.25m0 0h3m-3 0H9m6-2.25a6 6 0 10-12 0v.75a6 6 0 0012 0v-.75zM15 12.75V12a3 3 0 10-6 0v.75"
            />
          </svg>
          <div className="transcript-empty-text font-bold text-lg mb-2">
            No conversation yet
          </div>
          <div className="transcript-empty-hint text-gray-500">
            Click the mic button above to start talking
          </div>
        </div>
      </div>

      {/* Floating Back Button */}
      <a
        href="/"
        className="back-btn-floating fixed top-24 left-6 w-12 h-12 bg-white border rounded-full shadow flex items-center justify-center z-50"
        aria-label="Back"
      >
        {/* Arrow-left icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-gray-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </a>
    </div>
  );
}
