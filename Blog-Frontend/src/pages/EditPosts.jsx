import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/API'; // Assuming you have this utility for API calls
import { FaX } from "react-icons/fa6";
import ReactQuill from 'react-quill'; // Import React Quill
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS

function EditPost() {
  const { postId } = useParams(); // Retrieve the postId from the URL
  const [post, setPost] = useState({ title: '', body: '', postStatus: 1 }); // Initial state for the post
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch the post data to be edited
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await API.get(`/posts/${postId}`); // Fetch the specific post by ID
        setPost(response.data); // Populate the state with the current post data
        setLoading(false); // Set loading to false after fetching the data
      } catch (error) {
        setError('Error fetching the post.');
        console.error(error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // Handle form input changes for title
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  // Handle ReactQuill input changes for body
  const handleBodyChange = (value) => {
    setPost({ ...post, body: value });
  };

  // Handle form submission to update the post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/posts/${postId}`, post); // Send updated data to the API
      navigate('/myposts'); // Navigate back to MyPosts after successful update
    } catch (error) {
      setError('Error updating the post.');
      console.error(error);
    }
  };

  // Handle post deletion
  const handleDelete = async () => {
    try {
      await API.delete(`/posts/${postId}`); // Update postStatus to 0
      setPost({ ...post, postStatus: 0 }); // Update local state to reflect change
      navigate('/myposts');
    } catch (error) {
      setError('Error deleting the post.');
      console.error(error);
    }
  };

  // Handle reposting the post
  const handleRepost = async () => {
    try {
      await API.put(`/posts/${postId}`, { ...post, postStatus: 1 }); // Update postStatus to 1
      setPost({ ...post, postStatus: 1 }); // Update local state to reflect change
      navigate('/myposts');
    } catch (error) {
      setError('Error reposting the post.');
      console.error(error);
    }
  };

  // Handle cancel button click
  const handleCancel = () => {
    navigate('/myposts'); // Navigate back to MyPosts without saving changes
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="h-full bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-lg relative">
        {/* Cancel Button */}
        <button
          onClick={handleCancel}
          className="absolute top-2 right-2 text-lg text-gray-500 font-bold hover:text-red-500"
        >
          <FaX />
        </button>

        <h1 className="text-3xl font-bold text-center mb-8">Edit Post</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={post.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="body" className="block text-gray-700 text-sm font-bold mb-2">
              Body:
            </label>
            <ReactQuill
              value={post.body} // Set the value of ReactQuill to post.body
              onChange={handleBodyChange} // Handle changes using handleBodyChange
              theme="snow"
              className="w-full h-64"
            />
          </div>

          {/* Buttons Section */}
          <div className="flex justify-between mt-16">
            {/* Conditional Button Render */}
            {post.postStatus === 1 ? (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            ) : (
              <button
                type="button"
                onClick={handleRepost}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Repost
              </button>
            )}

            {/* Update Button */}
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
