import React from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const MetricCard = ({ label, value, color = '#2c3e50' }) => (
  <Box className="metric-card">
    <Typography className="metric-label" variant="body2">
      {label}
    </Typography>
    <Typography className="metric-value" style={{ color }} variant="h4">
      {typeof value === 'number' ? value.toFixed(4) : value}
    </Typography>
  </Box>
);

const ResultsDisplay = ({ results }) => {
  // Format for single disease results
  const SingleDiseaseResults = ({ disease, results }) => (
    <Box mb={4}>
      <Typography variant="h6" gutterBottom>
        {disease}
      </Typography>
      
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Algorithm</TableCell>
              <TableCell align="right">Accuracy</TableCell>
              <TableCell align="right">Precision</TableCell>
              <TableCell align="right">Recall</TableCell>
              <TableCell align="right">F1 Score</TableCell>
              <TableCell align="right">ROC AUC</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.algorithm}>
                <TableCell component="th" scope="row">
                  {result.algorithm_name}
                </TableCell>
                <TableCell align="right">{result.metrics.accuracy.toFixed(4)}</TableCell>
                <TableCell align="right">{result.metrics.precision.toFixed(4)}</TableCell>
                <TableCell align="right">{result.metrics.recall.toFixed(4)}</TableCell>
                <TableCell align="right">{result.metrics.f1_score.toFixed(4)}</TableCell>
                <TableCell align="right">
                  {result.metrics.roc_auc ? result.metrics.roc_auc.toFixed(4) : 'N/A'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Best Performing Model: Detailed Metrics
      </Typography>
      
      {results.length > 0 && (
        <Box>
          {/* Find the best model based on F1 score */}
          {(() => {
            const bestModel = [...results].sort((a, b) => b.metrics.f1_score - a.metrics.f1_score)[0];
            return (
              <Box>
                <Typography variant="h6" gutterBottom color="primary">
                  {bestModel.algorithm_name}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={4} md={2}>
                    <MetricCard 
                      label="Accuracy" 
                      value={bestModel.metrics.accuracy} 
                      color="#3498db"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <MetricCard 
                      label="Precision" 
                      value={bestModel.metrics.precision} 
                      color="#2ecc71"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <MetricCard 
                      label="Recall" 
                      value={bestModel.metrics.recall} 
                      color="#e74c3c"
                    />
                  </Grid>
                  <Grid item xs={6} sm={4} md={2}>
                    <MetricCard 
                      label="F1 Score" 
                      value={bestModel.metrics.f1_score} 
                      color="#9b59b6"
                    />
                  </Grid>
                  {bestModel.metrics.roc_auc && (
                    <Grid item xs={6} sm={4} md={2}>
                      <MetricCard 
                        label="ROC AUC" 
                        value={bestModel.metrics.roc_auc} 
                        color="#f39c12"
                      />
                    </Grid>
                  )}
                </Grid>
                
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Confusion Matrix
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxWidth: 400 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell align="center">Predicted Negative</TableCell>
                          <TableCell align="center">Predicted Positive</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">Actual Negative</TableCell>
                          <TableCell align="center" sx={{ backgroundColor: '#e8f5e9' }}>
                            {bestModel.metrics.confusion_matrix.true_negative}
                          </TableCell>
                          <TableCell align="center" sx={{ backgroundColor: '#ffebee' }}>
                            {bestModel.metrics.confusion_matrix.false_positive}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Actual Positive</TableCell>
                          <TableCell align="center" sx={{ backgroundColor: '#ffebee' }}>
                            {bestModel.metrics.confusion_matrix.false_negative}
                          </TableCell>
                          <TableCell align="center" sx={{ backgroundColor: '#e8f5e9' }}>
                            {bestModel.metrics.confusion_matrix.true_positive}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Box>
            );
          })()}
        </Box>
      )}
    </Box>
  );

  // Handle multiple disease comparison
  if (results && typeof results === 'object' && !results.disease && !results.results) {
    // Multiple diseases in the format: { disease1: { ... }, disease2: { ... } }
    return (
      <Box>
        {Object.keys(results).map(diseaseKey => (
          <SingleDiseaseResults 
            key={diseaseKey}
            disease={results[diseaseKey].disease_name || diseaseKey}
            results={results[diseaseKey].results}
          />
        ))}
      </Box>
    );
  } else if (results && results.results) {
    // Single disease in the format: { disease: '...', results: [...] }
    return (
      <SingleDiseaseResults 
        disease={results.disease_name}
        results={results.results}
      />
    );
  }

  return (
    <Box textAlign="center" py={3}>
      <Typography color="textSecondary">
        No results available. Please run the comparison first.
      </Typography>
    </Box>
  );
};

export default ResultsDisplay; 