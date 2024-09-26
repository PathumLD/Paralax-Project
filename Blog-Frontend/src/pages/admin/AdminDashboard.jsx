import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../utils/API';

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPublishedPosts, setTotalPublishedPosts] = useState(0);
  const [totalDraftedPosts, setTotalDraftedPosts] = useState(0);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const postsResponse = await API.get('/public');
        const postsData = postsResponse.data;

        const publishedPosts = postsData.filter(
          post => post.status === 'published' && post.postStatus === 1
        ).length;
        const draftedPosts = postsData.filter(
          post => post.status === 'draft'
        ).length;

        setTotalPublishedPosts(publishedPosts);
        setTotalDraftedPosts(draftedPosts);
        setPosts(postsData);
        setFilteredPosts(postsData);

        const usersResponse = await API.get('/user-count');
        setTotalUsers(usersResponse.data.user_count);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === 'all') {
      setFilteredPosts(posts);
    } else if (status === 'published') {
      setFilteredPosts(posts.filter(post => post.status === 'published' && post.postStatus === 1));
    } else if (status === 'draft') {
      setFilteredPosts(posts.filter(post => post.status === 'draft'));
    }
  };

  const stripHtmlTags = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, "");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold">Total Users</h2>
          <p className="text-xl">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold">Published Posts</h2>
          <p className="text-xl">{totalPublishedPosts}</p>
        </div>
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold">Drafted Posts</h2>
          <p className="text-xl">{totalDraftedPosts}</p>
        </div>
      </div>

      <div className="mb-4">
        <button 
          className={`px-4 py-2 mr-2 ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`} 
          onClick={() => handleFilterChange('all')}
        >
          All Posts
        </button>
        <button 
          className={`px-4 py-2 mr-2 ${filter === 'published' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`} 
          onClick={() => handleFilterChange('published')}
        >
          Published Posts
        </button>
        <button 
          className={`px-4 py-2 ${filter === 'draft' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`} 
          onClick={() => handleFilterChange('draft')}
        >
          Drafted Posts
        </button>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">All Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white px-4 py-2 rounded-lg hover:shadow hover:shadow-xl cursor-pointer transition relative" 
              onClick={() => navigate(`/show-admin/${post.id}`)} // Navigate to post detail
            >
              <h3 className="text-xl font-bold text-blue-900">{post.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {stripHtmlTags(post.body).substring(0, 40)} <span className='text-xs text-gray-400'>see more...</span>
              </p>
              <p className="text-gray-400 text-sm">Posted on: {new Date(post.created_at).toLocaleDateString()}</p>
              <p className="text-gray-400 text-xs">Comments: {post.comments_count}</p>

              {post.status === 'draft' && (
                <div className="flex gap-6 justify-center">
                  <div className="bottom-2 font-semibold text-yellow-600 text-xs">
                    Post is drafted
                  </div>
                </div>
              )}

              {post.postStatus === 0 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 font-semibold text-red-600 text-xs text-center">
                  Author has deleted this post
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
