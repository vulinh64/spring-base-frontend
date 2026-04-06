interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="rounded-md bg-red-900/30 border border-red-800 p-4 text-red-400">
      {message}
    </div>
  );
}
