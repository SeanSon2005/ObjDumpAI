import React, { useState } from 'react';
import axios from './axiosConfig';
import './DatasetSearch.css';

const DatasetSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/datasets/search/', {
                params: { query },
            });
            setResults(response.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error.response) {
                setError(`Error: ${error.response.data.detail || 'There was an error fetching the search results.'}`);
            } else if (error.request) {
                setError('No response received from the server.');
            } else {
                setError('Error: Unable to fetch search results.');
            }
            console.error(error);
        }
    };

    return (
        <center>
            <div className="grid" id="dataset-search">
                <h2>Search Datasets</h2>
                <form onSubmit={handleSearch}>
                    <label>
                        <input
                            type="text"
                            placeholder="Search for datasets..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </label>
                    <br/>
                    <button type="submit">Search</button>
                </form>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <br />
                {results.length > 0 ? (
                    <ul>
                        {results.map((dataset) => (
                            <li key={dataset.id}>
                                <h2>{dataset.name}</h2>
                                <p>{dataset.description}</p>
                                <p>Public: {dataset.public ? 'Yes' : 'No'}</p>
                                <p>Relevance Score: {dataset.relevance_score}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </center>
    );
};

export default DatasetSearch;
