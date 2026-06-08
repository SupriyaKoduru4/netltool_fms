import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/Login/CustomInput";
import Button from "../components/UI/Button";
// @ts-ignore
import officeBg from "../assets/Login/backgroundimage.png";
// @ts-ignore
import mailIcon from "../assets/Login/mail.svg";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  const handleSend = () => {
    if (email) {
      setSent(true);
    } else {
      alert("Please enter your email");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background — same as SignIn */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[1.5px] scale-105"
        style={{ backgroundImage: `url(${officeBg})` }}
      />
      <div className="absolute inset-0 bg-black/30" />

      {/* Card — same structure as SignIn */}
      <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl grid md:grid-cols-[50%_50%]">

        {/* Left panel — same #d6d4d4 grey */}
        <div className="bg-[#d6d4d4] p-8 flex flex-col relative overflow-hidden">
          <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-black/5" />
          <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-black/5" />

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-black text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base shadow-md">
              N
            </div>
            <div>
              <h1 className="font-bold text-lg text-black leading-tight">Netltool_FMS</h1>
              <p className="text-xs text-gray-500 font-medium">Founder Management System</p>
            </div>
          </div>

          {/* Text */}
          <div className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Account recovery
            </p>
            <h3 className="text-3xl font-black text-gray-800 leading-tight">
              Forgot your<br />password?
            </h3>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              No worries — we'll send you<br />reset instructions to your email.
            </p>
          </div>

          {/* Lock illustration placeholder */}
          <div className="mt-auto pt-8 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-black/8 flex items-center justify-center text-4xl">
              🔒
            </div>
          </div>
        </div>

        {/* Right panel — white */}
        <div className="p-10 flex flex-col justify-center bg-white">
          {!sent ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Reset your password</h2>
                <p className="text-sm text-gray-400 mt-1">Enter your registered email address</p>
              </div>

              <div className="mb-5">
                <CustomInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={mailIcon}
                />
              </div>

              <Button text="Send Reset Mail" variant="long" onClick={handleSend} />

              <div className="mt-5 text-center">
                <button
                  className="text-sm font-semibold text-black hover:underline underline-offset-2 transition-all"
                  onClick={() => navigate("/login")}
                >
                  ← Back to Login
                </button>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <div className="flex-1 h-px bg-gray-100" />
                <p className="text-xs text-gray-300 whitespace-nowrap">Secured with 256-bit SSL</p>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Check your inbox</h2>
                <p className="text-sm text-gray-500 leading-relaxed">We sent a password reset link to</p>
                <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-sm font-medium text-gray-800">
                  {email}
                </span>
                <p className="text-xs text-gray-300 mt-4">Didn't receive it? Check your spam folder.</p>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <div className="flex-1 h-px bg-gray-100" />
                <p className="text-xs text-gray-300 whitespace-nowrap">Secured with 256-bit SSL</p>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;