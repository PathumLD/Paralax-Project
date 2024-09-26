import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../utils/API';


function AdminBlogView() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/admin/posts/${postId}`);
        setPost(response.data);
        setComments(response.data.comments || []);
      } catch (error) {
        console.error('Error fetching post:', error.message || error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return <p className='mt-4'>Loading...</p>;
  }

  return (
    <div className="min-h-full bg-gray-100 p-8">
      <div className="bg-white p-6 rounded-xl shadow-lg mx-auto relative">
        {post.postStatus === 0 && (
          <div className="absolute top-2 right-2 text-red-600 text-sm font-semibold">
            Deleted
          </div>
        )}
        <div className='max-w-4xl mx-auto'>
          <h1 className="text-3xl font-bold text-center mb-4">{post.title}</h1>
          <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: post.body }} />
          <p className="text-gray-500 text-sm">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
          <p className="text-gray-500 text-sm">Author: {post.user?.name || 'Unknown'}</p>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>

            {comments.length > 0 ? (
              <ul className="space-y-2">
                {comments.map((comment) => (
                  <li key={comment.id} className="bg-gray-100 rounded shadow-sm py-1 px-3 relative">
                    <p>{comment.body}</p>
                    <p className="text-gray-500 text-sm mt-1">
                      By {comment.user?.name || 'Unknown'} on {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
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

export default AdminBlogView;
