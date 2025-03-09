import React from 'react';
import { FormControl, FormGroup, FormControlLabel, Checkbox, Typography, Box, Grid } from '@mui/material';

const AlgorithmSelection = ({ algorithms, selectedAlgorithms, onChange }) => {
  const handleChange = (event) => {
    const algoId = event.target.value;
    const isChecked = event.target.checked;
    
    let newSelected;
    if (isChecked) {
      newSelected = [...selectedAlgorithms, algoId];
    } else {
      newSelected = selectedAlgorithms.filter(id => id !== algoId);
    }
    
    onChange(newSelected);
  };
  
  const getAlgorithmDescription = (algoId) => {
    const descriptions = {
      'logistic_regression': 'A statistical model that uses a logistic function to model binary outcomes.',
      'random_forest': 'An ensemble learning method that builds multiple decision trees during training.',
      'svm': 'A supervised learning model that analyzes data for classification and regression.',
      'neural_network': 'A series of algorithms that attempt to recognize underlying relationships in data through processes that mimic the human brain.'
    };
    
    return descriptions[algoId] || 'A machine learning algorithm for classification';
  };
  
  return (
    <Box>
      {algorithms.length === 0 ? (
        <Typography color="textSecondary">
          Loading available algorithms...
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {algorithms.map((algorithm) => (
            <Grid item xs={12} sm={6} key={algorithm.id}>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedAlgorithms.includes(algorithm.id)}
                      onChange={handleChange}
                      value={algorithm.id}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">{algorithm.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {getAlgorithmDescription(algorithm.id)}
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
      
      {algorithms.length > 0 && selectedAlgorithms.length === 0 && (
        <Typography color="error" sx={{ mt: 1 }}>
          Please select at least one algorithm
        </Typography>
      )}
    </Box>
  );
};

export default AlgorithmSelection; 