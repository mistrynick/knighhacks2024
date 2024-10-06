'use client';

import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';

function Cards({productName, productDescription, productType, productLink, productImage}) {
    
    
    return (
        <React.Fragment>
          <CssBaseline />
        
          <Box
              sx = {{
                display: 'flex',
                padding: '2vw',
                flexDirection: 'column',
                alignItems: 'flex-start',  
                justifyContent: 'center',  
                transform: 'translateX(-10%)',  
                width: '40vw',
                marginLeft: '5vw'
              }}
          >
            <p style={{ color: 'black', fontWeight: 'bold', fontSize: '1.2em' }}>{productName}</p>
            <p style={{ color: 'black' }}>{productDescription}</p>
            <img src={productImage} ></img>
            
          </Box>
          
          
        </React.Fragment>
    );
}

export default Cards;
