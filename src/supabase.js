// supabase.js
const SUPABASE_URL = "https://kjxpfppyyvegpibuhyjn.supabase.co"
const SUPABASE_KEY = "sb_publishable_eyleLOuTPuM9Rsj0I33rKw_QbhLCDzy"

async function supaFetch(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const db = {
  // USERS
  async getUsers() {
    return supaFetch("users?select=*&order=uid.asc");
  },
  async upsertUser(user) {
    return supaFetch("users", {
      method: "POST",
      prefer: "return=representation,resolution=merge-duplicates",
      headers: { "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(user),
    });
  },
  async deleteUser(id) {
    return supaFetch(`users?id=eq.${id}`, { method: "DELETE", prefer: "" });
  },
  // PLANS
  async getPlans() {
    return supaFetch("plans?select=*&order=id.asc");
  },
  async upsertPlan(plan) {
    return supaFetch("plans", {
      method: "POST",
      prefer: "return=representation,resolution=merge-duplicates",
      headers: { "Prefer": "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(plan),
    });
  },
  // GYM INFO
  async getGymInfo() {
    const rows = await supaFetch("gym_info?id=eq.1");
    return rows && rows[0] ? rows[0].data : null;
  },
  async updateGymInfo(data) {
    return supaFetch("gym_info?id=eq.1", {
      method: "PATCH",
      prefer: "",
      body: JSON.stringify({ data }),
    });
  },
};
