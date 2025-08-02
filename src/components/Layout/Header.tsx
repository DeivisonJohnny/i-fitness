import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "../ui/them-toggle";

export default function Header() {
  const pathname = usePathname();

  const initialPage = pathname === "/";
  const isLoginPage = pathname === "/auth/login";
  const isSignupPage = pathname === "/auth/signup";

  const showSidebar = !initialPage && !isLoginPage && !isSignupPage;

  return (
    <>
      {showSidebar && (
        <header className="flex h-[66px] shrink-0 items-center gap-2 border-b px-4 sticky top-0 z-10 bg-white dark:bg-background ">
          <SidebarTrigger className="-ml-1 text-black dark:text-white" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold text-black dark:text-white ">
              Dashboard
            </h1>
            <ThemeToggle />
          </div>
        </header>
      )}
    </>
  );
}

const ContainerHeader = styled.header`
  width: 85%;
  margin: auto;
  position: sticky;
  top: 20px;
  border-radius: 75px;
  background-color: #1a1a1a6a;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(100px);
  box-shadow: 0px 5px 15px #00000088;
  border: none;
  z-index: 100;
`;
