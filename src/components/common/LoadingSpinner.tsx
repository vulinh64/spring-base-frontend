export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-700 border-t-blue-500" />
    </div>
  );
}
