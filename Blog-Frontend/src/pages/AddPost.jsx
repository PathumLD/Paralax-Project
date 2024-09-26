import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css'; // Import styles for the editor
import ReactQuill from 'react-quill';
import API from '../utils/API';

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Default status and postStatus
        const postData = {
            title,
            body,
            status: 'draft',    // Default status
            postStatus: 1       // Default postStatus
        };

        try {
            const response = await API.post('/posts', postData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
                }
            });
            setSuccess('Post added successfully!');
            console.log(response.data);
            navigate('/myposts'); // Redirect to my posts page
            setError(''); // Clear any previous error
            // Reset form fields
            setTitle('');
            setBody('');
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message); // Set error message from server response
            } else {
                setError('An error occurred while adding the post.'); // Generic error message
            }
            setSuccess(''); // Clear success message
        }
    };

    return (
        <div className="min-h-full bg-gray-100 p-8">
            <div className="bg-white p-6 rounded-xl shadow-lg mx-auto max-w-2xl">
                <h2 className="text-3xl font-bold text-center mb-4">Add New Post</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">{success}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="body" className="block text-gray-700">
                            Body
                        </label>
                        <ReactQuill
                            id="body"
                            value={body}
                            onChange={setBody} // Set directly without accessing e.target.value
                            required
                            theme="snow"
                            className="w-full h-64"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 mt-12 py-2 rounded"
                    >
                        Add Post
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPost;
