import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/API';

function Dashboard() {
  const [posts, setPosts] = useState([]); // Initial state for posts
  const [uniqueAuthors, setUniqueAuthors] = useState([]); // State for unique authors
  const [selectedAuthor, setSelectedAuthor] = useState(''); // State for selected author
  const [titleFilter, setTitleFilter] = useState(''); // State for title filter
  const [filteredPosts, setFilteredPosts] = useState([]); // State for filtered posts
  const [user, setUser] = useState(null); // State for user info
  const navigate = useNavigate();

  // Fetch user information (assuming you have a function to get the logged-in user)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await API.get('/user'); // Example endpoint for fetching current user
        setUser(response.data); // Assuming the user's data includes their name
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUser();
  }, []);

  // Fetch all blog posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get('/posts'); // Fetch posts from API
        if (Array.isArray(response.data)) {
          const filteredPosts = response.data.filter(post => post.postStatus === 1); // Filter by postStatus
          setPosts(filteredPosts);
          setFilteredPosts(filteredPosts); // Initialize filteredPosts with filtered posts

          // Extract unique authors from the fetched posts
          const authorsMap = {};
          filteredPosts.forEach(post => {
            const authorId = post.user.id; // Assuming user.id is the unique identifier
            const authorName = post.user.name;

            if (!authorsMap[authorId]) {
              authorsMap[authorId] = authorName; // Store author names in an object for uniqueness
            }
          });

          // Convert authorsMap back to an array
          const uniqueAuthors = Object.keys(authorsMap).map(id => ({
            id,
            name: authorsMap[id],
          }));

          setUniqueAuthors(uniqueAuthors); // Set unique authors state
        } else {
          console.error('Unexpected response structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on author and title input
  useEffect(() => {
    const applyFilters = () => {
      let filtered = posts;

      // Filter by author
      if (selectedAuthor) {
        filtered = filtered.filter(post => post.user?.id === parseInt(selectedAuthor)); // Adjust user.id based on your data structure
      }

      // Filter by title
      if (titleFilter) {
        filtered = filtered.filter(post =>
          post.title.toLowerCase().includes(titleFilter.toLowerCase())
        );
      }

      setFilteredPosts(filtered); // Update filtered posts
    };

    applyFilters();
  }, [selectedAuthor, titleFilter, posts]); // Re-run when filters change

  // Strip HTML tags using a regular expression
  const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, ""); // Regex to remove HTML tags
  };

  // Navigate to blog details page on click
  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="h-full bg-gray-100 p-8">
      {/* Greeting Message */}
      {user && <h2 className="text-xl font-semibold mb-4">Hello, {user.name}!</h2>} {/* Display user name */}

      <h1 className="text-3xl font-bold text-center mb-8">Blog Posts</h1>

      {/* Filter Section */}
      <div className="flex justify-center space-x-4 mb-4">
        <select
          className="mr-2 p-2 border border-gray-300 rounded"
          value={selectedAuthor}
          onChange={(e) => setSelectedAuthor(e.target.value)}
        >
          <option value="">Select Author</option>
          {uniqueAuthors.map(author => (
            <option key={author.id} value={author.id}>{author.name}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Filter by title"
          className="mr-2 p-2 border border-gray-300 rounded"
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white px-4 py-2 rounded-lg hover:stroke shadow hover:shadow-xl cursor-pointer transition"
            onClick={() => handlePostClick(post.id)}
          >
            <h2 className="text-xl font-bold text-blue-900">{post.title}</h2>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {/* Strip HTML tags */}
              {stripHtmlTags(post.body).substring(0, 40)} <span className='text-xs text-gray-400'>see more...</span>
            </p>
            <p className="text-gray-400 text-sm">Author: {post.user?.name}</p>
            <p className="text-gray-400 text-sm">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
            <p className="text-gray-400 text-xs">Comments: {post.comments_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
