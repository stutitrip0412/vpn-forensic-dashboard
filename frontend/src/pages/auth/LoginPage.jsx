import LoginForm from "../../components/auth/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-6">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#06B6D420,transparent_40%)]" />

      <div className="relative w-full max-w-md">

        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 shadow-2xl">

          <div className="text-center mb-10">

            <div className="mx-auto w-20 h-20 rounded-2xl bg-cyan-500/10 flex items-center justify-center">

              <svg
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-cyan-400"
              >
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>

            </div>

            <h1 className="mt-6 text-3xl font-bold">

              VPN Forensic Dashboard

            </h1>

            <p className="mt-3 text-slate-400">

              Secure Investigator Login

            </p>

          </div>

          <LoginForm />

        </div>

      </div>

    </div>
  );
};

export default LoginPage;