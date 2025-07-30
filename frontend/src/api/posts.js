const API_URL = import.meta.env.VITE_API_PORT + '/api/posts'; // Or replace with deployed backend

export async function fetchPosts() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return await res.json();
}

export async function createPost(postData) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!res.ok) throw new Error('Failed to create post');
  return await res.json();
}

