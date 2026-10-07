const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getLeaderboard = async (sort = "xp", chapter = "all") => {
  const res = await fetch(`${API_URL}/leaderboard?sort=${sort}&chapter=${chapter}`);
  if (!res.ok) {
    throw new Error("Failed to fetch leaderboard");
  }
  return res.json();
};