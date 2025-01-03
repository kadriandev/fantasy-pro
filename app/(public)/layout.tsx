import Navbar from "@/components/sidebar/navbar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="mt-14 min-h-screen flex flex-col items-center">
        {children}
      </main>
    </>
  );
}
