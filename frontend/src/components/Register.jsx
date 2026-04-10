import { useMemo, useState } from "react";
import { api } from "../lib/api";

export default function Register({ navigate, isWorkerReg = false, addWorker, onRegistered }) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Staff fields
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("staff");

	// Worker fields
	const [workerName, setWorkerName] = useState("");
	const [age, setAge] = useState("");
	const [state, setState] = useState("");
	const [bloodType, setBloodType] = useState("O+");
	const [phone, setPhone] = useState("");
	const [emergencyContact, setEmergencyContact] = useState("");
	const [jobRole, setJobRole] = useState("");

	const title = useMemo(
		() => (isWorkerReg ? "Register Worker" : "Create Staff Account"),
		[isWorkerReg]
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			if (isWorkerReg) {
				const workerData = {
					name: workerName,
					age: age ? Number(age) : undefined,
					state,
					bloodType,
					phone,
					emergency: emergencyContact,
					role: jobRole,
				};
				const created = await addWorker(workerData);
				navigate("profile", created);
			} else {
				const data = await api.register({ name, email, password, role });
				onRegistered?.(data.user);
				navigate("dashboard");
			}
		} catch (err) {
			setError(err.message || "Registration failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-6 py-16">
			<div className="w-full max-w-2xl">
				<div className="rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl animate-fade-up">
					<div className="text-left">
						<div className="text-slate-300 text-sm">Health Monitoring System</div>
						<h2 className="text-2xl font-semibold text-white mt-1">{title}</h2>
						<p className="text-slate-300 text-sm mt-2">
							{isWorkerReg
								? "Add a new worker profile to the registry."
								: "Create an account for clinic/hospital staff."}
						</p>
					</div>

					{error && (
						<div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="mt-6 grid gap-4">
						{!isWorkerReg ? (
							<>
								<div className="grid sm:grid-cols-2 gap-4">
									<label className="text-left grid gap-2">
										<span className="text-slate-200 text-sm font-medium">Full name</span>
										<input
											value={name}
											onChange={(e) => setName(e.target.value)}
											className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
											placeholder="Dr. Anitha Nair"
											required
										/>
									</label>
									<label className="text-left grid gap-2">
										<span className="text-slate-200 text-sm font-medium">Role</span>
										<select
											value={role}
											onChange={(e) => setRole(e.target.value)}
											className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-teal-500/40"
										>
											<option value="staff">Staff</option>
											<option value="doctor">Doctor</option>
											<option value="admin">Admin</option>
										</select>
									</label>
								</div>

								<div className="grid sm:grid-cols-2 gap-4">
									<label className="text-left grid gap-2">
										<span className="text-slate-200 text-sm font-medium">Email</span>
										<input
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											type="email"
											autoComplete="email"
											className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
											placeholder="name@hospital.org"
											required
										/>
									</label>
									<label className="text-left grid gap-2">
										<span className="text-slate-200 text-sm font-medium">Password</span>
										<input
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											type="password"
											autoComplete="new-password"
											className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
											placeholder="Create a strong password"
											required
											minLength={6}
										/>
									</label>
								</div>
							</>
						) : (
							<>
								<div className="grid sm:grid-cols-2 gap-4">
									<label className="text-left grid gap-2">
										<span className="text-slate-200 text-sm font-medium">Worker name</span>
										<input
											value={workerName}
											onChange={(e) => setWorkerName(e.target.value)}
											className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
											placeholder="Rajesh Kumar"
											required
										/>
									</label>
									<label className="text-left grid gap-2">
										<span className="text-slate-200 text-sm font-medium">Age</span>
										<input
											value={age}
											onChange={(e) => setAge(e.target.value)}
											inputMode="numeric"
											className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
											placeholder="34"
										/>
									</label>
								</div>

								<div className="grid sm:grid-cols-3 gap-4">
									<label className="text-left grid gap-2 sm:col-span-2">
										<span className="text-slate-200 text-sm font-medium">Home state</span>
										<input
											value={state}
											onChange={(e) => setState(e.target.value)}
											className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
											placeholder="Uttar Pradesh"
										/>
									</label>
									<label className="text-left grid gap-2">
										<span className="text-slate-200 text-sm font-medium">Blood type</span>
										<select
											value={bloodType}
											onChange={(e) => setBloodType(e.target.value)}
											className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-teal-500/40"
										>
											{[
												"O+",
												"O-",
												"A+",
												"A-",
												"B+",
												"B-",
												"AB+",
												"AB-",
											].map((t) => (
												<option key={t} value={t}>
													{t}
												</option>
											))}
										</select>
									</label>
								</div>

								<div className="grid sm:grid-cols-2 gap-4">
									<label className="text-left grid gap-2">
										<span className="text-slate-200 text-sm font-medium">Phone</span>
										<input
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
											className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
											placeholder="+91 9876543210"
										/>
									</label>
									<label className="text-left grid gap-2">
										<span className="text-slate-200 text-sm font-medium">Emergency contact</span>
										<input
											value={emergencyContact}
											onChange={(e) => setEmergencyContact(e.target.value)}
											className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
											placeholder="Priya Kumar (+91 …)"
										/>
									</label>
								</div>

								<label className="text-left grid gap-2">
									<span className="text-slate-200 text-sm font-medium">Job role</span>
									<input
										value={jobRole}
										onChange={(e) => setJobRole(e.target.value)}
										className="w-full rounded-2xl bg-slate-950/40 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-teal-500/40"
										placeholder="Construction Worker"
									/>
								</label>
							</>
						)}

						<div className="flex flex-col sm:flex-row gap-3 justify-between mt-2">
							<button
								type="button"
								onClick={() => navigate(isWorkerReg ? "dashboard" : "landing")}
								className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white px-6 py-3 font-semibold transition-all"
							>
								← Back
							</button>
							<button
								type="submit"
								disabled={loading}
								className="inline-flex items-center justify-center rounded-2xl bg-teal-500/90 hover:bg-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 px-6 py-3 font-semibold transition-all shadow-lg shadow-teal-500/20"
							>
								{loading ? "Saving…" : isWorkerReg ? "Register Worker" : "Create Account"}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

