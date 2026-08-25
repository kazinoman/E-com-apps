import dynamic from "next/dynamic";
const LoginComponent = dynamic(() => import("@/features/Auth/LoginComponent"), { ssr: true });

const LoginPage = () => {
  return (
    <div>
      <LoginComponent />
    </div>
  );
};

export default LoginPage;
