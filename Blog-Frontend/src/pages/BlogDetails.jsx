/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi';
import API from '../utils/API';

function BlogDetails() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [showCommentField, setShowCommentField] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/posts/${postId}`);
        setPost(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Error fetching post:', error.message || error);
      }
    };

    fetchPost();
  }, [postId]);

  // Function to handle publishing a draft post
  const handlePublishPost = async () => {
    try {
        const response = await API.put(`/posts/${postId}/publish`, { status: 'published' });  // Update status to "published"
        setPost({ ...post, status: 'published' }); // Update the local state if necessary
        window.location.reload(); // Reload the page to reflect the changes
    } catch (error) {
        console.error('Error publishing post:', error.message || error);
    }
};


  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      alert('Comment cannot be empty!');
      return;
    }

    try {
      const response = await API.post(`/posts/${postId}/comments`, { body: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
      setShowCommentField(false);
    } catch (error) {
      console.error('Error adding comment:', error.message || error);
    }
  };

  const handleEditComment = async (commentId) => {
    if (updatedComment.trim() === '') {
      alert('Comment cannot be empty!');
      return;
    }

    try {
      const response = await API.put(`/comments/${commentId}`, { body: updatedComment });
      setComments(comments.map(c => (c.id === commentId ? response.data : c)));
      setEditingCommentId(null);
      setDropdownOpen(null);
      window.location.reload();
    } catch (error) {
      console.error('Error editing comment:', error.message || error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error.message || error);
    }
  };

  const toggleDropdown = (commentId) => {
    setDropdownOpen(dropdownOpen === commentId ? null : commentId);
  };

  if (!post) {
    return <p className='mt-4'>Loading...</p>;
  }

  return (
    <div className="min-h-full bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-xl shadow-lg mx-auto relative">
        {post.status === 'draft' && (
          <div className="absolute top-2 right-2 text-yellow-600 text-sm font-semibold">
            Draft
          </div>
        )}
        {/* {post.status === 'published' && (
          <div className="absolute top-2 right-2 text-green-600 text-sm font-semibold">
            Published
          </div>
        )} */}

        <div className='max-w-4xl mx-auto'>
          <h1 className="text-3xl font-bold text-center mb-4">{post.title}</h1>
          <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: post.body }} />
          <p className="text-gray-500 text-sm">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
          <p className="text-gray-500 text-sm">Author: {post.user?.name || 'Unknown'}</p>

          {/* Conditionally show the Publish button if the post is in draft status */}
          {post.status === 'draft' && ( // Check status instead of postStatus
              <button
                  onClick={handlePublishPost}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                  Publish
              </button>
          )}


          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
            
            {!showCommentField && (
              <button
                onClick={() => setShowCommentField(true)}
                className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 mb-2 rounded"
              >
                Add Comment
              </button>
            )}

            {showCommentField && (
              <div className="mt-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows="2"
                  placeholder="Write your comment..."
                />
                <div className="my-2 flex gap-4">
                  <button onClick={handleAddComment} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                    Done
                  </button>
                  <button onClick={() => { setShowCommentField(false); setNewComment(''); }} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {comments.length > 0 ? (
              <ul className="space-y-2">
                {comments.map((comment) => {
                  const showEditDelete = String(comment.user?.id) === String(loggedInUserId);

                  return (
                    <li key={comment.id} className="bg-gray-100 rounded shadow-sm py-1 px-3 relative">
                      <p>{editingCommentId === comment.id ? (
                        <textarea
                          value={updatedComment}
                          onChange={(e) => setUpdatedComment(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                      ) : comment.body}</p>
                      
                      <p className="text-gray-500 text-sm mt-1">
                        By {comment.user?.name || 'Unknown'} on {new Date(comment.created_at).toLocaleDateString()}
                      </p>

                      {showEditDelete && (
                        <div className="absolute top-2 right-2">
                          <FiMoreVertical onClick={() => toggleDropdown(comment.id)} className="cursor-pointer" />
                          {dropdownOpen === comment.id && (
                            <div className="absolute right-0 mt-2 w-24 z-50 bg-white border border-gray-200 rounded shadow-lg">
                              <ul>
                                <li
                                  onClick={() => { setEditingCommentId(comment.id); setUpdatedComment(comment.body); }}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  Edit
                                </li>
                                <li
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  Delete
                                </li>
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {editingCommentId === comment.id && (
                        <div className="my-2 flex gap-4">
                          <button onClick={() => handleEditComment(comment.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                            Save
                          </button>
                          <button onClick={() => setEditingCommentId(null)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                            Cancel
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
