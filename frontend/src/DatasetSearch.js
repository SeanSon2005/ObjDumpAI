import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosConfig';
import './DatasetSearch.css';

const DatasetSearch = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

	useEffect(() => {
        if (!localStorage.getItem('token') || !localStorage.getItem('username')) {
            navigate('/');
        }
    }, [navigate]);

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
            <h2>Browse Public Datasets</h2>
            <form onSubmit={handleSearch}>
                <div className="search-bar">
                    <label>
                        <input
                            style={{ textAlign: 'center' }}
                            type="text"
                            placeholder="Enter some search terms..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </label>
                    <br />
                </div>
                <button type="submit" className="search-button">Search</button>
            </form>
            <div className="grid" id="dataset-search">
                {loading && <p>oading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <br />
                {results.length > 0 ? (
                    <div className="table-container">
                        <table className="results-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Relevance Score</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((dataset, index) => (
                                    <tr key={dataset.id}>
                                        <td><span className="text-hl">{index + 1}</span></td>
                                        <td><span className="text-hl">{dataset.name}</span></td>
                                        <td><span className="text-hl">{dataset.description}</span></td>
                                        <td><span className="text-hl">{dataset.relevance_score}</span></td>
										<td>
											<button onClick={() => navigate(`/readonly/${dataset.id}`, { state: { name: dataset.name } })} className="view-button">
                                                View
                                            </button>
                                            <button onClick={() => navigate(`/`)} className="owner-button">
                                                Owner
                                            </button>
										</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </center>
    );
};

export default DatasetSearch;
