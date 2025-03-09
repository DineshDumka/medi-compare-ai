import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import Header from './components/Header';
import DiseaseSelection from './components/DiseaseSelection';
import AlgorithmSelection from './components/AlgorithmSelection';
import ResultsDisplay from './components/ResultsDisplay';
import ComparisonChart from './components/ComparisonChart';
import Footer from './components/Footer';
import { fetchDiseases, fetchAlgorithms, trainModels, compareModels } from './services/api';

function App() {
  const [diseases, setDiseases] = useState([]);
  const [algorithms, setAlgorithms] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available diseases and algorithms on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const diseasesData = await fetchDiseases();
        const algorithmsData = await fetchAlgorithms();
        
        setDiseases(diseasesData.diseases);
        setAlgorithms(algorithmsData.algorithms);
        
        // Set defaults
        if (diseasesData.diseases.length > 0) {
          setSelectedDiseases([diseasesData.diseases[0].id]);
        }
        if (algorithmsData.algorithms.length > 0) {
          setSelectedAlgorithms(algorithmsData.algorithms.map(algo => algo.id));
        }
      } catch (err) {
        setError('Failed to load initial data. Please try again later.');
        console.error('Error loading initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const handleDiseaseChange = (selected) => {
    setSelectedDiseases(selected);
  };

  const handleAlgorithmChange = (selected) => {
    setSelectedAlgorithms(selected);
  };

  const handleCompare = async () => {
    if (selectedDiseases.length === 0 || selectedAlgorithms.length === 0) {
      setError('Please select at least one disease and one algorithm');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResults(null);
      
      let resultsData;
      
      if (selectedDiseases.length === 1) {
        // Single disease - use train endpoint
        resultsData = await trainModels(selectedDiseases[0], selectedAlgorithms);
      } else {
        // Multiple diseases - use compare endpoint
        resultsData = await compareModels(selectedDiseases, selectedAlgorithms);
      }
      
      setResults(resultsData);
    } catch (err) {
      setError('An error occurred while comparing models. Please try again.');
      console.error('Error comparing models:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Header />
      <Container maxWidth="lg">
        <Box my={4}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Disease Classification ML Comparison
          </Typography>
          
          <Box mb={4}>
            <Typography variant="body1" align="center" color="textSecondary" paragraph>
              Compare multiple machine learning algorithms on different disease datasets to find the best performing models.
            </Typography>
          </Box>
          
          {loading && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          )}
          
          {error && (
            <Box bgcolor="#ffebee" p={2} my={2} borderRadius={1}>
              <Typography color="error">{error}</Typography>
            </Box>
          )}
          
          <Box className="card" mb={3}>
            <Typography variant="h5" component="h2" gutterBottom>
              Select Disease Datasets
            </Typography>
            <DiseaseSelection 
              diseases={diseases} 
              selectedDiseases={selectedDiseases} 
              onChange={handleDiseaseChange} 
            />
          </Box>
          
          <Box className="card" mb={3}>
            <Typography variant="h5" component="h2" gutterBottom>
              Select Algorithms
            </Typography>
            <AlgorithmSelection 
              algorithms={algorithms} 
              selectedAlgorithms={selectedAlgorithms} 
              onChange={handleAlgorithmChange} 
            />
          </Box>
          
          <Box display="flex" justifyContent="center" my={3}>
            <button 
              className="btn btn-primary" 
              onClick={handleCompare}
              disabled={loading || selectedDiseases.length === 0 || selectedAlgorithms.length === 0}
            >
              {loading ? 'Processing...' : 'Train & Compare Models'}
            </button>
          </Box>
          
          {results && (
            <Box className="results-container">
              <Typography variant="h5" component="h2" gutterBottom align="center">
                Model Comparison Results
              </Typography>
              
              <ComparisonChart results={results} />
              
              <ResultsDisplay results={results} />
            </Box>
          )}
        </Box>
      </Container>
      <Footer />
    </div>
  );
}

export default App; 