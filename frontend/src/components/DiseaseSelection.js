import React from 'react';
import { FormControl, FormGroup, FormControlLabel, Checkbox, Typography, Box } from '@mui/material';

const DiseaseSelection = ({ diseases, selectedDiseases, onChange }) => {
  const handleChange = (event) => {
    const diseaseId = event.target.value;
    const isChecked = event.target.checked;
    
    let newSelected;
    if (isChecked) {
      newSelected = [...selectedDiseases, diseaseId];
    } else {
      newSelected = selectedDiseases.filter(id => id !== diseaseId);
    }
    
    onChange(newSelected);
  };
  
  return (
    <Box>
      {diseases.length === 0 ? (
        <Typography color="textSecondary">
          Loading available diseases...
        </Typography>
      ) : (
        <FormControl component="fieldset">
          <FormGroup>
            {diseases.map((disease) => (
              <Box key={disease.id} mb={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedDiseases.includes(disease.id)}
                      onChange={handleChange}
                      value={disease.id}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">{disease.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {disease.description}
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            ))}
          </FormGroup>
        </FormControl>
      )}
      
      {diseases.length > 0 && selectedDiseases.length === 0 && (
        <Typography color="error" sx={{ mt: 1 }}>
          Please select at least one disease dataset
        </Typography>
      )}
    </Box>
  );
};

export default DiseaseSelection; 