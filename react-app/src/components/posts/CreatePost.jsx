import React, { useState } from 'react';
import api from '../../services/api';

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [isPosting, setIsPosting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsPosting(true);

        try {
            const formData = new FormData();
            formData.append('content', content);
            if (image) formData.append('image', image);

            await api.post('/posts/', formData);
            setContent('');
            setImage(null);
            onPostCreated();
        } catch (error) {
            console.error('Erreur lors de la création du post:', error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Que voulez-vous partager ?"
                    className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                />
                
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setImage(e.target.files[0])}
                                accept="image/*"
                            />
                            <i className="fas fa-image text-gray-500 hover:text-blue-500"></i>
                        </label>
                        {image && <span className="text-sm text-gray-500">{image.name}</span>}
                    </div>
                    
                    <button
                        type="submit"
                        disabled={!content.trim() || isPosting}
                        className={`px-4 py-2 rounded-lg ${
                            !content.trim() || isPosting
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        {isPosting ? 'Publication...' : 'Publier'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreatePost;