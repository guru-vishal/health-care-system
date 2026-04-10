import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Settings({ currentUser, navigate }) {
	const [health, setHealth] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let cancelled = false;
		async function ping() {
			try {
				const data = await api.health();
				if (!cancelled) setHealth(data);
			} catch (err) {
				if (!cancelled) setError(err.message || "Backend not reachable");
			}
		}
		ping();
		return () => {
			cancelled = true;
		};
	}, []);

	return (
		<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
			<div className="flex items-end justify-between gap-4 animate-fade-up">
				<div className="text-left">
					<div className="text-slate-400 text-sm">Settings</div>
					<h1 className="text-3xl sm:text-4xl font-semibold text-white mt-1">Account</h1>
					<p className="text-slate-300 mt-2">View your profile and system status.</p>
				</div>
				<button
					type="button"
					onClick={() => navigate("dashboard")}
					className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all"
				>
					← Back
				</button>
			</div>

			<div className="mt-8 grid gap-4">
				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
					<div className="text-white font-semibold">Signed in</div>
					<div className="mt-3 grid sm:grid-cols-2 gap-4">
						<div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
							<div className="text-slate-400 text-xs">Name</div>
							<div className="text-slate-200 font-semibold mt-1">{currentUser?.name || "—"}</div>
						</div>
						<div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
							<div className="text-slate-400 text-xs">Role</div>
							<div className="text-slate-200 font-semibold mt-1">{currentUser?.role || "—"}</div>
						</div>
					</div>
				</div>

				<div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-left">
					<div className="text-white font-semibold">Backend Status</div>
					<div className="text-slate-400 text-sm mt-2">/api/health</div>
					<div className="mt-3 rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm">
						{error ? (
							<div className="text-red-200">{error}</div>
						) : health ? (
							<div className="text-teal-200">OK — {health.service}</div>
						) : (
							<div className="text-slate-300">Checking…</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

