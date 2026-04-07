import { useRef } from "react";

interface YouTubePlayerProps {
  videoId: string;
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  function handleWatchOnYouTube() {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
      "https://www.youtube.com"
    );
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="my-4">
      <div className="aspect-video rounded overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="flex justify-end mt-1">
        <button
          onClick={handleWatchOnYouTube}
          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          ▶ Watch on YouTube
        </button>
      </div>
    </div>
  );
}
