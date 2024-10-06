'use client';

import * as React from 'react';
import styles from "./styles.css";
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useContext } from 'react';
import Logo from "/images/mplogooo.png";
import cart from "/images/cartt.png";
import CssBaseline from '@mui/material/CssBaseline';
import swish from '/images/swish.png';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function Signup() {
    const router = useRouter();
    const [showError, willShowError] = useState(false); 
    const [message, setMessage] = useState(''); 
    const [isLoading ,setLoading] = useState(false);
    var bp = require('/src/app/Path.js');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const data = new FormData(event.currentTarget);
    
    
        let obj = {
            username: data.get('username'),
            email: data.get('email'),
            password: data.get('password'),
        };
        let js = JSON.stringify(obj);
    
        const response = await fetch(
          bp.buildPath('api/signup'),
          {
            method: 'POST',
            body: js,
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
          }
        );
        console.log(response);
        let res = JSON.parse(await response.text());
        console.log(res);
        /*
        if (res.hasOwnProperty('accessToken')) {
          setToken(res.accessToken);
          await getUsername(res.accessToken);
          setLoading(false);
          router.push('/home');
        }
    
        else {
          setMessage("Incorrect Email or Password");
          willShowError(true);
          console.log("failed login");
        }
        */
        
      };
    
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
                onSubmit={handleSubmit}
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
                  required
                  id="email"
                  name="email"
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
                  required
                  id="username"
                  name="username"
                  label="Username"
                  variant="outlined"
                  margin="normal"
                  className="customTextField"
                  InputLabelProps={{
                    style: { color: 'white' }
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Password"
                  name="password"
                  type="password"
                  id="password"
                  variant="outlined"
                  margin="normal"
                  className="customTextField"
                  InputLabelProps={{
                    style: { color: 'white' }
                  }}
                />
                <Button 
                  variant="outlined" 
                  type="submit"
                  className="customButton"
                >
                  Sign Up
                </Button>
              </Box>
            <Link href="../Signin" sx={{ color: 'white', marginTop: '1vh'}}>
                  Already have an account? Sign in
            </Link>
            
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

export default Signup;
