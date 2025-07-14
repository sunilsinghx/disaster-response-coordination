// src/components/PageLayout.jsx
export default function PageLayout({ title, children }) {
  return (
    <div className="w-full max-w-5xl md:mx-auto p-6 space-y-6 pt-12">
      {title && <h1 className="text-3xl font-bold mb-2">{title}</h1>}
      {children}
    </div>
  );
}
