// Metadata lives in page.tsx: it depends on ?provider=, which a layout can't read.
export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
   return children;
}
