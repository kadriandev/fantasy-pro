import SignInButtonImage from "@/assets/RoundPrimary_dark.png";
import Link from "next/link";
import Image from "next/image";

export default function SignInButton() {
  return (
    <Link href={"/auth/yahoo"}>
      <Image src={SignInButtonImage} height={40} alt="yahoo sign in button" />
    </Link>
  );
}
