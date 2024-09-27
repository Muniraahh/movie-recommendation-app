import React, { useState } from 'react';
import axios from 'axios';
import './app.css'; // Custom styles

const App = () => {
  const [emotion, setEmotion] = useState('Action');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fallbackImage = 'https://images.ctfassets.net/y2ske730sjqp/6bhPChRFLRxc17sR8jgKbe/6fa1c6e6f37acdc97ff635cf16ba6fb3/Logos-Readability-Netflix-logo.png'; // Common image for all movies

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous error

    try {
      const response = await axios.post('http://localhost:5000/get-movies', { emotion });
      // Filter out empty strings from the movies array
      const filteredMovies = response.data.movies.filter(movie => movie !== '');
      // Map the filtered array to objects with title and fallback image
      const moviesWithImages = filteredMovies.map((movie, index) => ({
        title: movie,
        image: fallbackImage // Assign the common fallback image
      }));
      setMovies(moviesWithImages);
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen bg-black text-white">
      <header className="bg-gradient-to-b from-gray-900 to-transparent p-6">
        <h1 className="text-4xl font-bold text-red-600">MOOVIX</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="mb-12">
          <h2 className="text-3xl font-semibold mb-6">What's your mood today?</h2>
          <div className="flex gap-4">
            <select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className="w-[180px] bg-gray-800 border-gray-700 p-2 text-white"
            >
              {['Action', 'Drama', 'Comedy', 'Horror', 'Crime'].map((mood) => (
                <option key={mood} value={mood}>
                  {mood}
                </option>
              ))}
            </select>
            <button type="submit" className="bg-red-600 hover:bg-red-700 p-2">
              Get Recommendations
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
          </div>
        )}

        {movies.length > 0 && !loading && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Recommended for you</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie, index) => (
                <div key={index} className="bg-gray-800 border-gray-700 p-4 rounded-lg overflow-hidden">
                  <img src={movie.image} alt={movie.title} className="w-full h-auto mb-4" />
                  <h3 className="font-semibold">{movie.title}</h3>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
    </div>
  );
};

export default App;
