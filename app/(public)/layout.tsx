import Navbar from "@/components/sidebar/navbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const supabase = createClient();

  // const {
  // 	data: { user },
  // } = await supabase.auth.getUser();
  //
  // if (user) {
  // 	return redirect("/fantasy");
  // }

  return (
    <>
      <Navbar />
      <main className="mt-14 min-h-screen flex flex-col items-center">
        {children}
      </main>
    </>
  );
}
