"use client";

import { ErrorBanner } from "@/components/common/ErrorBanner";

export default function ErrorPage() {
  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="mb-4 text-2xl font-bold text-gray-100">Server Error</h1>
      <ErrorBanner message="The server could not complete this request." />
    </div>
  );
}
