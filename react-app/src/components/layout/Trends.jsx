import React from 'react';

const Trends = () => {
    return (
        <div className="fixed right-0 h-screen w-80 bg-white shadow-lg p-4">
            <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Tendances pour vous</h3>
                <div className="space-y-4">
                    {['#JavaScript', '#React', '#TailwindCSS'].map(trend => (
                        <div key={trend} className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer">
                            <p className="font-medium">{trend}</p>
                            <p className="text-sm text-gray-500">1234 posts</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4">Suggestions</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map(user => (
                        <div key={user} className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg">
                            <img 
                                src={`https://i.pravatar.cc/40?img=${user}`}
                                alt="avatar"
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <p className="font-medium">Utilisateur {user}</p>
                                <p className="text-sm text-gray-500">@user{user}</p>
                            </div>
                            <button className="ml-auto text-blue-500 hover:text-blue-600">
                                Suivre
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Trends;