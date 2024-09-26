import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/API';
import { FaPenToSquare } from "react-icons/fa6";

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState(''); // State for title filter
  const [status, setStatus] = useState(''); // State for status filter
  const navigate = useNavigate();

  // Fetch user's posts from the API
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const params = { title, status }; // Prepare params for the API call
        const response = await API.get('/my-posts', { params }); // Include params in the API call
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts();
  }, [title, status]); // Run effect when title or status changes

  const handleEditClick = (postId) => {
    navigate(`/posts/edit/${postId}`);
  };

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <div className="h-full bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Blog Posts</h1>
      
      {/* Filter Section */}
      <div className="mb-4 flex justify-center space-x-4">
        <input
          type="text"
          placeholder="Filter by Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)} // Update title state
          className="border rounded px-2 py-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)} // Update status state
          className="border rounded px-2 py-1"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white px-4 py-2 rounded-lg hover:shadow hover:shadow-xl cursor-pointer transition relative"
          >
            <div onClick={() => handlePostClick(post.id)}>
              <h2 className="text-xl font-bold text-blue-900">{post.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {stripHtmlTags(post.body).substring(0, 40)} <span className='text-xs text-gray-400'>see more...</span>
              </p>
              <p className="text-gray-400 text-sm">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
              <p className="text-gray-400 text-xs">Comments: {post.comments_count}</p>
            </div>

            <button
              className="text-xl text-gray-700 hover:text-gray-950 absolute top-2 right-2"
              onClick={() => handleEditClick(post.id)}
            >
              <FaPenToSquare />
            </button>

            {post.postStatus === 0 && (
              <div className="absolute bottom-2 right-2 text-red-600 text-xs ">
                Deleted
              </div>
            )}

            {post.status === 'draft' && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 font-semibold text-yellow-600 text-xs text-center">
                Post is not yet published
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPosts;
