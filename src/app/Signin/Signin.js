'use client';

import * as React from 'react';
import styles from "./styles.css";
import Box from '@mui/material/Box';
import Logo from "/images/mplogooo.png";
import cart from "/images/cartt.png";
import CssBaseline from '@mui/material/CssBaseline';
import swish from '/images/swish.png';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { motion } from 'framer-motion';

function Signin() {
    
    function handleSignIn() {
    }
    
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

                <img 
                  className="logo"
                  src={Logo.src} 
                />

              <Box 
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  maxWidth: '500px',
                  maxHeight: '400px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  padding: '2rem',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  className="customTextField"
                  InputLabelProps={{
                    style: { color: 'white' }
                  }}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  className="customTextField"
                  InputLabelProps={{
                    style: { color: 'white' }
                  }}
                />
                <Button 
                  variant="outlined" 
                  onClick={handleSignIn}
                  className="customButton"
                >
                  Sign In
                </Button>
              </Box>
            
          </Box>
          
          <img src={swish.src} class="swishDes"></img>

          <motion.div
            initial={{ opacity: 1, x: '110vw'}}
            animate={{ opacity: 1, x: '60vw'}}
            transition={{ duration: 1.75 }}
          >
            <img src={cart.src} class="cartimg"></img>
          </motion.div>
          
        </React.Fragment>
    );
}

export default Signin;
