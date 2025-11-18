export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <main className="w-full max-w-md">{children}</main>
    </div>
  );
}
