import { useState } from "react";
import { api } from "../lib/api";

export default function Login({ onLogin, navigate }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			const data = await api.login({ email, password });
			onLogin(data.user);
		} catch (err) {
			setError(err.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-6 py-16">
			<div className="w-full max-w-md">
				<div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl animate-fade-up">
					<div className="text-left">
						<div className="text-slate-300 text-sm">Welcome back</div>
						<h2 className="text-2xl font-semibold text-white mt-1">Staff Login</h2>
						<p className="text-slate-300 text-sm mt-2">
							Sign in to manage workers and medical records.
						</p>
					</div>

					{error && (
						<div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="mt-6 grid gap-4">
						<label className="text-left grid gap-2">
							<span className="text-slate-200 text-sm font-medium">Email</span>
							<input
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								type="email"
								autoComplete="email"
								placeholder="name@hospital.org"
								className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
								required
							/>
						</label>

						<label className="text-left grid gap-2">
							<span className="text-slate-200 text-sm font-medium">Password</span>
							<input
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								type="password"
								autoComplete="current-password"
								placeholder="••••••••"
								className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
								required
							/>
						</label>

						<button
							type="submit"
							disabled={loading}
							className="mt-2 inline-flex items-center justify-center rounded-2xl bg-teal-500/90 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 px-6 py-3 font-semibold transition-all shadow-lg shadow-teal-500/20"
						>
							{loading ? "Signing in…" : "Sign In"}
						</button>
					</form>

					<div className="mt-6 flex items-center justify-between text-sm">
						<button
							type="button"
							onClick={() => navigate("landing")}
							className="text-slate-300 hover:text-white transition"
						>
							← Back
						</button>
						<button
							type="button"
							onClick={() => navigate("register")}
							className="text-teal-200 hover:text-teal-100 transition font-semibold"
						>
							Create account
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

