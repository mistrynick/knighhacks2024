'use client';

import * as React from 'react';
import Box from '@mui/material/Box';

function Cards({productName, productDescription, productType, productLink}) {
    
    
    return (
        <React.Fragment>
          <CssBaseline />
        
          <Box
              sx = {{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',  
                justifyContent: 'center',
                position: 'absolute',
                left: '10vw',  
                top: '8vh',   
                transform: 'translateX(-10%)',  
                width: '60vw'  
              }}
          >
            <p>{productName}</p>
            <p>{productDescription}</p>
                
            
          </Box>
          
          
        </React.Fragment>
    );
}

export default Cards;
