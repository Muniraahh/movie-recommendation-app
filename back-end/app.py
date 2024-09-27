from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import requests
from bs4 import BeautifulSoup
import re

app = Flask(__name__)
# Enable CORS for all routes
CORS(app, resources={r"/get-movies": {"origins": "http://localhost:5173"}})  # Allow only your frontend URL

# Dictionary to map emotions to IMDb URLs
URLS = {
    "Drama": 'https://www.imdb.com/search/title/?title_type=feature&genres=drama',
    "Action": 'https://www.imdb.com/search/title/?title_type=feature&genres=action',
    "Comedy": 'https://www.imdb.com/search/title/?title_type=feature&genres=comedy',
    "Horror": 'https://www.imdb.com/search/title/?title_type=feature&genres=horror',
    "Crime": 'https://www.imdb.com/search/title/?title_type=feature&genres=crime',
}

def fetch_movie_titles(emotion):
    url = URLS.get(emotion)
    if not url:
        return []

    headers = {
        'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
    except requests.RequestException as e:
        return []

    # Updated to use "html.parser"
    soup = BeautifulSoup(response.text, "html.parser")
    titles = [a.get_text() for a in soup.find_all('a', href=re.compile(r'/title/tt\d+/'))]
    return titles[:14]  # Limit to 14 titles

@app.route('/get-movies', methods=['POST'])
def get_movies():
    data = request.get_json()
    emotion = data.get("emotion")
    if not emotion:
        return jsonify({"error": "No emotion provided."}), 400

    titles = fetch_movie_titles(emotion)
    if not titles:
        return jsonify({"error": "No movies found for the given emotion."}), 404

    return jsonify({"movies": titles})

if __name__ == '__main__':
    app.run(debug=True)
