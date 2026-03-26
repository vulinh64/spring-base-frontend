import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/auth/AuthProvider";
import { ToastProvider } from "@/components/common/Toast";
import { PageLayout } from "@/components/layout/PageLayout";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { PostDetailPage } from "@/pages/PostDetailPage";
import { PostRevisionsPage } from "@/pages/PostRevisionsPage";
import { PostEditorPage } from "@/pages/PostEditorPage";
import { CategoriesPage } from "@/pages/CategoriesPage";
import { CategoryPostsPage } from "@/pages/CategoryPostsPage";
import { SearchPage } from "@/pages/SearchPage";
import { UserDetailsPage } from "@/pages/UserDetailsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <PageLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/post/:slug" element={<PostDetailPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/category/:slug" element={<CategoryPostsPage />} />

                <Route
                  path="/me"
                  element={
                    <AuthGuard>
                      <UserDetailsPage />
                    </AuthGuard>
                  }
                />

                {/* Auth-guarded routes */}
                <Route
                  path="/post/new"
                  element={
                    <AuthGuard>
                      <PostEditorPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/post/:slug/edit"
                  element={
                    <AuthGuard>
                      <PostEditorPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/post/:slug/revisions"
                  element={
                    <AuthGuard>
                      <PostRevisionsPage />
                    </AuthGuard>
                  }
                />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </PageLayout>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
