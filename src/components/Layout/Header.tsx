import styled from "styled-components";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";
import { ThemeToggle } from "../ui/them-toggle";

export default function Header() {
  const pathname = usePathname();

  const isLandingPage = pathname === "/";
  const isLoginPage = pathname === "/form/login";
  const isSignupPage = pathname === "/form/signup";
  const isPreviewPageForm = pathname?.startsWith("/preview/") ?? true;

  const showSidebar =
    !isLandingPage && !isLoginPage && !isSignupPage && !isPreviewPageForm;

  return (
    <>
      {showSidebar ? (
        <header className="flex h-[66px] shrink-0 items-center gap-2 border-b px-4 sticky top-0 z-10 bg-white dark:bg-background ">
          <SidebarTrigger className="-ml-1 text-black dark:text-white" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold text-black dark:text-white ">
              Dashboard
            </h1>
            <ThemeToggle />
          </div>
        </header>
      ) : isLandingPage ? (
        <ContainerHeader className="border-b bg-card z-40">
          <div className="flex h-[66px] items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <Image
                src={"/images/logo_letter.png"}
                width={100}
                height={100}
                alt="logo"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center gap-[15px]  bg-[#31313159] pl-[20px] pr-[5px] py-[5px] rounded-[50px] ">
                <Link href={"/form/login"} className="font-medium">
                  <p>Login</p>
                </Link>
                <Link
                  href={"/form/signup"}
                  className=" py-[6px] px-[15px] rounded-[50px] bg-[#0152f8] font-medium "
                >
                  <p>Cadastre-se</p>
                </Link>
              </div>
            </div>
          </div>
        </ContainerHeader>
      ) : null}
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
