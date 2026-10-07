const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getThreads = async (chapter = "all", search = "", sort = "recent", page = 1) => {
  const res = await fetch(`${API_URL}/forum/threads?chapter=${chapter}&search=${search}&sort=${sort}&page=${page}`);
  if (!res.ok) {
    throw new Error("Failed to fetch threads");
  }
  return res.json();
};

export const createThread = async (token, threadData) => {
  const res = await fetch(`${API_URL}/forum/threads/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(threadData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create thread");
  }
  return res.json();
};

export const getThread = async (id) => {
  const res = await fetch(`${API_URL}/forum/threads/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch thread");
  }
  return res.json();
};

export const addReply = async (token, threadId, content) => {
  const res = await fetch(`${API_URL}/forum/threads/${threadId}/replies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to add reply");
  }
  return res.json();
};

export const solveThread = async (token, threadId) => {
  const res = await fetch(`${API_URL}/forum/threads/${threadId}/solve`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to solve thread");
  }
  return res.json();
};

export const markReplyAsSolution = async (token, threadId, replyId) => {
  const res = await fetch(`${API_URL}/forum/threads/${threadId}/replies/${replyId}/solution`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to mark solution");
  }
  return res.json();
};

export const upvoteThread = async (token, threadId) => {
  const res = await fetch(`${API_URL}/forum/threads/${threadId}/upvote`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to upvote thread')
  }
  return res.json()
}

export const upvoteReply = async (token, threadId, replyId) => {
  const res = await fetch(`${API_URL}/forum/threads/${threadId}/replies/${replyId}/upvote`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to upvote reply')
  }
  return res.json()
}