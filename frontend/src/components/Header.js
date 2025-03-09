import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          ML Disease Classification
        </Typography>
        <Box>
          <Typography variant="body2" component="div">
            ML Algorithm Comparison Tool
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 