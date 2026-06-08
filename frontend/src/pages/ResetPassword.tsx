import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomInput from "../components/Login/CustomInput";
import Button from "../components/UI/Button";
// @ts-ignore
import officeBg from "../assets/Login/backgroundimage.png";
// @ts-ignore
import lockIcon from "../assets/Login/password.svg";
import axios from "axios";

const API = (import.meta as any).env.VITE_API_BASE_URL;

const Shell = ({ children, user, }: { children: React.ReactNode, user: any }) => (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
            className="absolute inset-0 bg-cover bg-center blur-[1.5px] scale-105"
            style={{ backgroundImage: `url(${officeBg})` }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl grid md:grid-cols-[50%_50%]">
            {/* Left panel */}
            <div className="bg-[#d6d4d4] p-8 flex flex-col relative overflow-hidden">
                <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-black/5" />
                <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-black/5" />
                <div className="flex items-center gap-3">
                    <div className="bg-black text-white w-9 h-9 rounded-lg flex items-center justify-center font-bold text-base shadow-md">
                        N
                    </div>
                    <div>
                        <h1 className="font-bold text-lg text-black leading-tight">Netltool_FMS</h1>
                        <p className="text-xs text-gray-500 font-medium">Founder Management System</p>
                    </div>
                </div>
                <div className="mt-10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                        Account recovery
                    </p>
                    <h3 className="text-3xl font-black text-gray-800 leading-tight">
                        Reset your<br />password
                    </h3>
                    <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                        {user && (
                            <span className="text-gray-800 font-semibold block mb-1">
                                Hey, {user.first_name} {user.last_name}!
                            </span>
                        )}
                        Don't worry, you can reset<br />your password here.
                    </p>
                </div>
                <div className="mt-auto pt-8 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-black/8 flex items-center justify-center text-4xl">
                        🔑
                    </div>
                </div>
            </div>
            {/* Right panel */}
            <div className="p-10 flex flex-col justify-center bg-white min-h-[420px]">
                {children}
            </div>
        </div>
    </div>
);

function ResetPassword() {


    const [password1, setPassword1] = useState("");
    const [confirmPassword1, setConfirmPassword1] = useState("");
    const [done, setDone] = useState(false);
    const [validationError, setValidationError] = useState("");

    // Token check states
    const [user, setUser] = useState<any>(null);
    const [checking, setChecking] = useState(false);
    const [tokenError, setTokenError] = useState("");

    // Submit state
    const [changing, setChanging] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("reset-token") || "";

    // ── Token validation on mount ──────────────────────────────────────────────
    useEffect(() => {
        if (!token) {
            setChecking(false);
            setTokenError("No reset token found. Please request a new password reset link.");
            return;
        }
        console.log("this is running")
        checkInvitation();
    }, []);

    async function checkInvitation() {
        try {
            setChecking(true);
            setTokenError("");
            const response = await axios.get(`${API}/auth/check-invitation-token`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data.user);
        } catch (err: any) {
            const msg =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "This reset link is invalid or has expired. Please request a new one.";
            setTokenError(msg);
        } finally {
            setChecking(false);
        }
    }

    // ── Submit ─────────────────────────────────────────────────────────────────
    async function handleReset() {
        setValidationError("");
        setSubmitError("");

        if (!password1 || !confirmPassword1) {
            setValidationError("Please fill in both fields.");
            return;
        }
        if (password1.length < 8) {
            setValidationError("Password must be at least 8 characters.");
            return;
        }
        if (password1 !== confirmPassword1) {
            setValidationError("Passwords do not match.");
            return;
        }

        const newFormData = new FormData()

        newFormData.append("new_password" , confirmPassword1)
    

        try {
            setChanging(true);
            await axios.post(
                `${API}/auth/reset-password`,
                newFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            setDone(true);
        } catch (err: any) {
            const msg =
                err?.response?.data?.detail ||
                err?.response?.data?.message ||
                "Failed to reset password. The link may have expired.";
            setSubmitError(msg);
        } finally {
            setChanging(false);
        }
    }

    console.log(submitError)

    // ── Shared shell ───────────────────────────────────────────────────────────


    // ── Loading state ──────────────────────────────────────────────────────────
    if (checking) {
        return (
            <Shell user={user}>
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <div className="w-10 h-10 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
                    <p className="text-sm text-gray-400">Verifying your reset link…</p>
                </div>
            </Shell>
        );
    }

    // ── Invalid / expired token ────────────────────────────────────────────────
    if (tokenError) {
        return (
            <Shell user={user}>
                <div className="flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-2xl">
                        ✕
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Link Invalid</h2>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{tokenError}</p>
                    <button
                        onClick={() => navigate("/forgot-password")}
                        className="mt-2 text-sm font-semibold text-black hover:underline underline-offset-2 transition-all"
                    >
                        Request a new link →
                    </button>
                </div>
            </Shell>
        );
    }


    // ── Main form / success ────────────────────────────────────────────────────
    return (
        <Shell user={user}>
            {!done ? (
                <>
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            Create new password
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Enter and confirm your new password below
                        </p>
                    </div>

                    <div className="flex flex-col gap-1 mb-5">
                        <CustomInput

                            label="Enter New Password"
                            name="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            value={password1}
                            onChange={(e) => setPassword1(e.target.value)}
                            icon={lockIcon}
                        />

                        <CustomInput
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword1}
                            onChange={(e) => setConfirmPassword1(e.target.value)}
                            icon={lockIcon}
                        />

                        {/* Validation error */}
                        {validationError && (
                            <p className="text-xs text-red-500 mt-1 font-medium">{validationError.toString()}</p>
                        )}

                        {/* API / submit error */}
                        {submitError && (
                            <div className="flex items-start gap-2 mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                <span className="text-red-400 text-sm mt-0.5">⚠</span>
                                <p className="text-xs text-red-600 font-medium leading-relaxed">{(submitError[0] as any).msg || submitError.toString()}</p>
                            </div>
                        )}
                    </div>

                    <Button
                        text="Reset Password"
                        variant="long"
                        onClick={handleReset}
                        isLoading={changing}
                        disabled={changing}
                    />

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
                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-2xl">
                            ✓
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Password updated!</h2>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Your password has been reset successfully.<br />You can now log in with your new password.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="mt-6 text-sm font-semibold text-black hover:underline underline-offset-2 transition-all"
                        >
                            Go to Login →
                        </button>
                    </div>

                    <div className="flex items-center gap-3 mt-8">
                        <div className="flex-1 h-px bg-gray-100" />
                        <p className="text-xs text-gray-300 whitespace-nowrap">Secured with 256-bit SSL</p>
                        <div className="flex-1 h-px bg-gray-100" />
                    </div>
                </>
            )}
        </Shell>
    );
}

export default ResetPassword;