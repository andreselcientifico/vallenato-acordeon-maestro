// src/components/LazyHeader.tsx
import { lazy, Suspense } from "react";

const Header = lazy(() => import("./Header"));

export default function LazyHeader() {
  return (
    <Suspense fallback={<div className="h-20" />}>
      <Header />
    </Suspense>
  );
}
