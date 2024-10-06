'use client';

import * as React from 'react';
import styles from "./styles.css";
import Logo from "../images/mplogooo.png";
import Box from '@mui/material/Box';
import cart from "../images/cartt.png";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import swish from '../images/swish.png';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { motion } from 'framer-motion';


console.log(Logo);



function Welcome() {
    
    function SignIn() {
        window.location.href = "/Signin";
    }

    function SignUp(){
        window.location.href = "/Signup";
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
                top: '15vh',   
                transform: 'translateX(-10%)',  
                width: '60vw'  
              }}
          >
            
            
              <img 
                  className="logo"
                  src={Logo.src} 
              />
        
  
              <Box className="textBox">
                  <p className="introText">
                      Welcome to Marketplace, your one-stop destination for tailored products and services that perfectly match your personal or business needs. 
                  </p>
              </Box>


              <ButtonGroup variant="outlined" aria-label="Basic button group">
                <Button onClick= {SignIn} className="customButton">Sign In</Button>
                <Button onClick= {SignUp}className="customButton">Sign Up</Button>
            </ButtonGroup>
              
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

export default Welcome;