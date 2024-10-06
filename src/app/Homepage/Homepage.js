'use client';

import * as React from 'react';
import styles from "./styles.css";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { useContext } from 'react';
import Logo from "/images/mplogooo.png";
import SearchIcon from '@mui/icons-material/Search';
import cart from "/images/cartt.png";
import CssBaseline from '@mui/material/CssBaseline';
import swish from '/images/swish.png';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
//import Cards from '../src/app/Cards/Cards.js';
import PropTypes from 'prop-types';
import Cards from '../Cards/Cards.js';


function Homepage() {
      
    const [ searchWord, setWord ] = useState(""); 

    const searchWrapper = async (searchword) => {
        const data = await search(searchword);
        setData(data);
      }

    return (
        <>
        <Box  sx={{ width: '100%', bgcolor: '#16405B', height: 'auto'}}>
            <Box
               sx={{ height: '2vh'}}
            >
            </Box>

            <img
                 className="logo"
                 src={Logo.src}
            />

            <Box
               sx={{ height: '2vh'}}
            >
            </Box>
            
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center'}}>
        <SearchIcon sx={{ color: '#16405B', marginRight: 1 }} />
            <TextField id="input-with-sx" label="Search" variant="standard" onChange={(e) => { setWord(e.target.value); }}/>
            <Button 
                onClick={() => searchWrapper(searchWord)} 
                sx={{ color: '#16405B', '&:hover': { backgroundColor: '#99c1dc' } }}
                >
                    Search
                </Button>
        </Box>


        </>
       
   
    );
}

export default Homepage;
