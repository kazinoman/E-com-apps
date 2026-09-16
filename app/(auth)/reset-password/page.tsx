import ResetPasswordComponent from "@/features/Auth/ResetPasswordComponent";

/*
 * The backend's flow is a 6-digit code, not a tokenised link, so nothing
 * required arrives in the URL. `?email=` is only carried over from
 * /forgot-password to prefill the field; the page works without it.
 */
const ResetPasswordPage = async ({ searchParams }: { searchParams: Promise<{ email?: string }> }) => {
  const { email } = await searchParams;

  return (
    <div>
      <ResetPasswordComponent defaultEmail={email ?? ""} />
    </div>
  );
};

export default ResetPasswordPage;
