import { useRouter } from "next/router";

export default function Initial() {
  const router = useRouter();

  router.push("/auth/login");

  return;
}
