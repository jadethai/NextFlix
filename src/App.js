import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import { data } from './data.js';
import SelectSearch from 'react-select-search';
import 'react-select-search/style.css'
import './index.css';

async function getRecommendations(movieName) {
  const res = await fetch("http://127.0.0.1:8000/search?q=" + movieName)
  const data = await res.json();
  return data;
}

function App() {
  const [selectedOption, setSelectedOption] = useState('');
  const [result, setResult] = useState([]);
  const [showHeader, setShowHeader] = useState(false);

  const options = data.map((item) => {
    return { name: item.title, value: item.title };
  });

  const handleFormSubmit = async (input) => {
    const movieRecs = await getRecommendations(encodeURIComponent(input.toLowerCase())); 
    setSelectedOption(input);
    setShowHeader(true);
    setResult(movieRecs);
  };

  return (
    <div id="root" className="flex flex-col min-h-screen bg-gradient-to-r from-red-700 to-stone-900">
      <Container>
        <img src={process.env.PUBLIC_URL + '/logo.png'} alt="NextFlix Logo" class="w-40 h-17 mt-4" />
        <h1 className="text-white text-center text-3xl font-mono font-medium pt-12"> Wondering what to watch NEXT? Get recommendations for your favorite Netflix Movie or TV Show! </h1>
        {/* <h3 className='text-white text-center text-1xl font-mono mt-3'>Wondering what to watch NEXT? Get recommendations for your favorite Netflix Movie or TV Show!</h3> */}
        <div className="flex justify-center mt-5">
          <SelectSearch 
            onChange = {handleFormSubmit}
            options={options} 
            value={selectedOption}
            name="movie" 
            placeholder="Choose your Movie/TV Show!" 
            search={true}
          />
        </div>
        
        <div className="flex justify-center mt-4 pb-8">
          <table className="bg-gray-400 bg-opacity-50 border border-separated border-spacing-2 border-gray-500">
            {result.map((item, index) => (
              <tbody key={index}>
                <tr>
                  <td className="px-4 py-2 text-white border font-sans border-gray-500">{item.Title}</td>
                  <td className="px-4 py-2 text-white border font-sans border-gray-500">{item.Genre}</td>
                  <td className="px-4 py-2 text-white border font-sans border-gray-500">{item.Description}</td>
                </tr>
              </tbody>
            ))}
            
            {showHeader && (
              <thead>
                <tr>
                  <th className="px-4 py-2 text-white font-sans">Movie/TV Show Title</th>
                  <th className="px-4 py-2 text-white font-sans">Genre</th>
                  <th className="px-4 py-2 text-white font-sans">Description</th>
                </tr>
              </thead>
            )}
          </table>
        </div>
        
        <footer className="text-white font-sans flex justify-center mt-auto">Made by DS Club Members at UCSB </footer>
      </Container>
    </div>
  );
}

export default App;

