'use client';

import * as React from 'react';
import { useState } from 'react';
import styles from "./styles.css";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Logo from '../images/mplogooo.png';
import { motion } from 'framer-motion';

function Profile() {
    const [companyName, setCompanyName] = useState("");

    const handleContinue = () => {
        console.log("Company Name:", companyName);
        
    };

    return (
        <React.Fragment>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                //backgroundColor: '#16405B',
                padding: '2rem'
            }}>
                <img 
                    className="logo"
                    src={Logo.src} 
                    alt="Logo"
                    style={{ marginBottom: '2rem' }}
                />

                <p className="ubuntu-regular-italic">What is your Company's name?</p>

                <br></br>

                <TextField
                    fullWidth
                    required
                    id="company-name"
                    label="Company Name"
                    variant="outlined"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    sx={{
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        maxWidth: '400px',
                    }}
                />

                <Button 
                    variant="outlined" 
                    sx={{
                        backgroundColor: '#99c1dc',
                        color: '#16405B',
                        fontWeight: 'bold',
                        padding: '0.75rem 2rem',
                        '&:hover': {
                            backgroundColor: '#16405B',
                            color: '#ffffff'
                        }
                    }}
                    onClick={handleContinue}
                >
                    Continue
                </Button>

                
            </Box>
        </React.Fragment>
    );
}

export default Profile;
