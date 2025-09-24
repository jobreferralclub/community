import { createComment, getComments, updateComment, deleteComment } from './models/commentController.js';

async function testComments() {
  // Create
  const newId = await createComment({
    postId: '689adc0a7aa4cd846658922f',
    userId: '689adc6f7aa4cd8466589253',
    content: 'This is a test comment',
    author: 'Archak Nath',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  });
  console.log('Created comment with ID:', newId);

  // Read
  const comments = await getComments();
  console.log('All comments:', comments);

  // Update
  const updated = await updateComment(newId, { content: 'Updated comment content' });
  console.log('Number of comments updated:', updated);

  // Delete
  const deleted = await deleteComment(newId);
  console.log('Number of comments deleted:', deleted);
}

testComments().catch(console.error);
