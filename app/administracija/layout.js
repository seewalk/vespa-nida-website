// app/administracija/layout.js
export const metadata = {
  title: 'Administracija | Vespa Nida',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-ivory-white">
      {children}
    </div>
  );
}