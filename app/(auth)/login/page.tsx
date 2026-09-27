import { Suspense } from "react";
import dynamic from "next/dynamic";
const LoginComponent = dynamic(() => import("@/features/Auth/LoginComponent"), { ssr: true });

const LoginPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginComponent />
      </Suspense>
    </div>
  );
};

export default LoginPage;
