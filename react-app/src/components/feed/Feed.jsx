import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Post from '../post/Post';
import CreatePost from '../post/CreatePost';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('recent');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/posts/');
                setPosts(response.data);
            } catch (err) {
                setError("Impossible de charger les posts pour le moment");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Erreur: {error}
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <CreatePost onPostCreated={() => setLoading(true)} />
            
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Fil d'actualité</h2>
                <select 
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-white border rounded-lg px-4 py-2"
                >
                    <option value="recent">Plus récents</option>
                    <option value="popular">Plus populaires</option>
                </select>
            </div>

            <div className="space-y-6">
                {posts.length === 0 ? (
                    <div className="text-center text-gray-500">
                        Aucun post à afficher pour le moment
                    </div>
                ) : (
                    posts.map(post => (
                        <Post key={post.id} post={post} onPostUpdated={() => setLoading(true)} />
                    ))
                )}
            </div>
        </div>
    );
};

export default Feed;