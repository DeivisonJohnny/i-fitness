"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthPage from "./auth/[form]";
import Storage from "@/utils/Storage";
import { TOKEN_KEY } from "@/utils/Constant";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function LoadPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spin indicator={<LoadingOutlined spin />} size="large" />
    </div>
  );
}

export default function Initial() {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Storage.get(TOKEN_KEY, false);

    if (token) {
      router.replace("/dashboard");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return <LoadPage />;
  return <AuthPage />;
}
