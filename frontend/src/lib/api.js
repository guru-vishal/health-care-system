const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

function getToken() {
  return localStorage.getItem("hms_token");
}

function setToken(token) {
  if (!token) localStorage.removeItem("hms_token");
  else localStorage.setItem("hms_token", token);
}

async function request(path, { method = "GET", body, auth = false } = {}) {
  const headers = { ...DEFAULT_HEADERS };

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}

async function requestForm(path, { method = "POST", formData, auth = false } = {}) {
  const headers = {};

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    method,
    headers,
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}

export const api = {
  token: {
    get: getToken,
    set: setToken,
  },

  health: () => request("/api/health"),

  register: async ({ name, email, password, role }) => {
    const data = await request("/api/auth/register", {
      method: "POST",
      body: { name, email, password, role },
    });
    if (data?.token) setToken(data.token);
    return data;
  },

  login: async ({ email, password }) => {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (data?.token) setToken(data.token);
    return data;
  },

  logout: () => {
    setToken(null);
  },

  listWorkers: () => request("/api/workers"),

  getWorker: (workerId) => request(`/api/workers/${encodeURIComponent(workerId)}`),

  createWorker: (worker) =>
    request("/api/workers", {
      method: "POST",
      body: worker,
      auth: true,
    }),

  listWorkerRecords: async (workerId, { page, limit } = {}) => {
    const qs = new URLSearchParams();
    if (page !== undefined) qs.set("page", String(page));
    if (limit !== undefined) qs.set("limit", String(limit));
    const url = `/api/records/${encodeURIComponent(workerId)}${qs.toString() ? `?${qs}` : ""}`;
    const res = await request(url, { auth: true });
    const data = res?.data;
    if (Array.isArray(data)) return data;
    return data?.items ?? [];
  },

  addWorkerRecord: async (workerId, record) => {
    const fd = new FormData();
    fd.append("workerId", workerId);
    if (record?.doctorName) fd.append("doctorName", record.doctorName);
    if (record?.hospitalName) fd.append("hospitalName", record.hospitalName);
    if (record?.diagnosis) fd.append("diagnosis", record.diagnosis);
    if (record?.prescription) fd.append("prescription", record.prescription);
    if (record?.notes) fd.append("notes", record.notes);
    if (record?.visitDate) fd.append("visitDate", record.visitDate);
    if (record?.reportFile) fd.append("reportFile", record.reportFile);

    const res = await requestForm("/api/records", { method: "POST", formData: fd, auth: true });
    return res?.data;
  },

  getRecord: async (id) => {
    const res = await request(`/api/record/${encodeURIComponent(id)}`, { auth: true });
    return res?.data;
  },
};
