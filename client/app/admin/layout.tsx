export const metadata = {
  title: 'Admin Dashboard - Thadam',
  description: 'Fleet management and monitoring dashboard',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
