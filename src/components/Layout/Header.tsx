import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "../ui/them-toggle";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const pathname = usePathname();

  const initialPage = pathname === "/";
  const isLoginPage = pathname === "/auth/login";
  const isSignupPage = pathname === "/auth/signup";
  const isComplet = pathname === "/auth/complet";

  const showSidebar =
    !initialPage && !isLoginPage && !isSignupPage && !isComplet;

  const { logout } = useAuth();

  return (
    <>
      {showSidebar && (
        <header className="flex h-[66px] shrink-0 items-center gap-2 bsorder-b px-4 sticky top-0 z-10 bg-white dark:bg-background ">
          <SidebarTrigger className="-ml-1 text-black dark:text-white" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold text-black dark:text-white ">
              Dashboard
            </h1>
            <div className="flex items-center gap-2.5">
              <Button
                onClick={() => logout()}
                variant={"outline"}
                className="h-9 w-9 bg-white dark:bg-background  text-black dark:text-white  "
              >
                <LogOutIcon />
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}
    </>
  );
}
