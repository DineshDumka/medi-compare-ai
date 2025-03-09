import React, { useState, useEffect } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler 
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler,
  Title, 
  Tooltip, 
  Legend
);

const ComparisonChart = ({ results }) => {
  const [chartType, setChartType] = useState('bar');
  const [metric, setMetric] = useState('f1_score');
  const [chartData, setChartData] = useState(null);
  
  // Generate colors for algorithms
  const algorithmColors = [
    'rgba(54, 162, 235, 0.7)',   // Blue
    'rgba(255, 99, 132, 0.7)',   // Red
    'rgba(75, 192, 192, 0.7)',   // Green
    'rgba(255, 159, 64, 0.7)',   // Orange
    'rgba(153, 102, 255, 0.7)',  // Purple
    'rgba(255, 205, 86, 0.7)',   // Yellow
    'rgba(201, 203, 207, 0.7)'   // Grey
  ];
  
  // Process data for chart
  useEffect(() => {
    if (!results) return;
    
    const processData = () => {
      // For multiple diseases
      if (typeof results === 'object' && !results.disease && !results.results) {
        const diseases = Object.keys(results);
        const allAlgorithms = [];
        
        // Collect all unique algorithms
        diseases.forEach(disease => {
          results[disease].results.forEach(result => {
            if (!allAlgorithms.includes(result.algorithm)) {
              allAlgorithms.push(result.algorithm);
            }
          });
        });
        
        // Prepare data for each algorithm across diseases
        const datasets = allAlgorithms.map((algorithm, index) => {
          const data = diseases.map(disease => {
            const algorithmResult = results[disease].results.find(result => result.algorithm === algorithm);
            return algorithmResult ? algorithmResult.metrics[metric] : 0;
          });
          
          return {
            label: algorithm.replace('_', ' ').toUpperCase(),
            data,
            backgroundColor: algorithmColors[index % algorithmColors.length],
            borderColor: algorithmColors[index % algorithmColors.length].replace('0.7', '1'),
            borderWidth: 1
          };
        });
        
        // Return chart data
        return {
          labels: diseases.map(disease => results[disease].disease_name || disease),
          datasets
        };
      } 
      // For single disease
      else if (results && results.results) {
        const metrics = ['accuracy', 'precision', 'recall', 'f1_score'];
        if (results.results[0].metrics.roc_auc) {
          metrics.push('roc_auc');
        }
        
        if (chartType === 'radar') {
          // Radar chart for algorithm comparison across metrics
          const datasets = results.results.map((result, index) => {
            return {
              label: result.algorithm_name,
              data: metrics.map(m => result.metrics[m] || 0),
              backgroundColor: algorithmColors[index % algorithmColors.length].replace('0.7', '0.2'),
              borderColor: algorithmColors[index % algorithmColors.length].replace('0.7', '1'),
              borderWidth: 2,
              pointBackgroundColor: algorithmColors[index % algorithmColors.length].replace('0.7', '1'),
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: algorithmColors[index % algorithmColors.length].replace('0.7', '1')
            };
          });
          
          return {
            labels: metrics.map(m => m.replace('_', ' ').toUpperCase()),
            datasets
          };
        } else {
          // Bar chart for single metric comparison
          return {
            labels: results.results.map(result => result.algorithm_name),
            datasets: [{
              label: metric.replace('_', ' ').toUpperCase(),
              data: results.results.map(result => result.metrics[metric]),
              backgroundColor: results.results.map((_, index) => algorithmColors[index % algorithmColors.length]),
              borderColor: results.results.map((_, index) => algorithmColors[index % algorithmColors.length].replace('0.7', '1')),
              borderWidth: 1
            }]
          };
        }
      }
      
      return null;
    };
    
    setChartData(processData());
  }, [results, chartType, metric]);
  
  if (!results) {
    return null;
  }
  
  return (
    <Box className="chart-container" mb={4}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Chart Type</InputLabel>
          <Select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            label="Chart Type"
          >
            <MenuItem value="bar">Bar Chart</MenuItem>
            <MenuItem value="radar">Radar Chart</MenuItem>
          </Select>
        </FormControl>
        
        {chartType === 'bar' && (
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Metric</InputLabel>
            <Select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              label="Metric"
            >
              <MenuItem value="accuracy">Accuracy</MenuItem>
              <MenuItem value="precision">Precision</MenuItem>
              <MenuItem value="recall">Recall</MenuItem>
              <MenuItem value="f1_score">F1 Score</MenuItem>
              {(results.results && results.results[0]?.metrics?.roc_auc) || 
               (typeof results === 'object' && Object.values(results)[0]?.results[0]?.metrics?.roc_auc) ? (
                <MenuItem value="roc_auc">ROC AUC</MenuItem>
              ) : null}
            </Select>
          </FormControl>
        )}
      </Box>
      
      {chartData ? (
        <Box height={400}>
          {chartType === 'bar' ? (
            <Bar 
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Model Performance Comparison',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 1,
                  }
                }
              }}
            />
          ) : (
            <Radar 
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Algorithm Performance Across Metrics',
                  },
                },
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                      stepSize: 0.2
                    }
                  }
                }
              }}
            />
          )}
        </Box>
      ) : (
        <Typography color="textSecondary" align="center">
          Chart data not available
        </Typography>
      )}
    </Box>
  );
};

export default ComparisonChart; 