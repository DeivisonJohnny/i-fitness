import { ReactNode, Suspense } from "react";
import Header from "./Header";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import { SidebarDashboard } from "../dashboard/SideBar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { ThemeProvider } from "../theme/ThemeProvider";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const pathname = usePathname();

  const isLandingPage = pathname === "/";
  const isLoginPage = pathname === "/form/login";
  const isSignupPage = pathname === "/form/signup";

  const showSidebar = !isLandingPage && !isLoginPage && !isSignupPage;

  function LoadPage() {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }
  return (
    <Container className="dark:bg-background bg-[#f3f3f3]">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          {showSidebar ? (
            <>
              <Suspense fallback={<LoadPage />}>
                <SidebarDashboard />
                <SidebarInset>
                  <Header />
                  <Content className=" z-[1]">{children}</Content>
                </SidebarInset>
              </Suspense>
            </>
          ) : (
            <Suspense fallback={<LoadPage />}>
              <Header />
              <Content>{children}</Content>
            </Suspense>
          )}
        </SidebarProvider>
      </ThemeProvider>
    </Container>
  );
}

const Container = styled.main`
  position: relative;
  width: 100%;
  min-height: 100vh;
  height: 100%;
  overflow-x: hidden;
`;

const Content = styled.section`
  width: 100%;

  z-index: 1;
  overflow-x: hidden;
`;
