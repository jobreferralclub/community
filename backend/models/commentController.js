import { ObjectId } from 'mongodb';
import connectDB from './db.js';

// Create a new comment
export async function createComment(data) {
  const db = await connectDB();

  const comment = {
    postId: ObjectId(data.postId),
    userId: ObjectId(data.userId),
    content: data.content,
    author: data.author,
    avatar: data.avatar,
    imageUrl: data.imageUrl || null,
    createdAt: new Date()
  };

  const result = await db.collection('comments').insertOne(comment);
  return result.insertedId;
}

// Get all comments or filter by postId
export async function getComments(postId) {
  const db = await connectDB();
  const query = postId ? { postId: ObjectId(postId) } : {};
  const comments = await db.collection('comments').find(query).toArray();
  return comments;
}

// Update a comment by commentId
export async function updateComment(commentId, updateData) {
  const db = await connectDB();
  const filter = { _id: ObjectId(commentId) };
  const update = { $set: updateData };
  const result = await db.collection('comments').updateOne(filter, update);
  return result.modifiedCount;
}

// Delete a comment by commentId
export async function deleteComment(commentId) {
  const db = await connectDB();
  const filter = { _id: ObjectId(commentId) };
  const result = await db.collection('comments').deleteOne(filter);
  return result.deletedCount;
}
