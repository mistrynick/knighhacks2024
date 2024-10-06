'use client';

import * as React from 'react';
import styles from "./styles.css";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { useContext } from 'react';
import Logo from "../images/mplogooo.png";
import SearchIcon from '@mui/icons-material/Search';
import cart from "../images/cartt.png";
import CssBaseline from '@mui/material/CssBaseline';
import swish from '../images/swish.png';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
//import Cards from '../src/app/Cards/Cards.js';
import PropTypes from 'prop-types';
import { AuthContext } from '/src/app/AuthContext.js';
import Cards from '../Cards/Cards.js';
import Image from 'next/image';


function Homepage() {
    var bp = require('/src/app/Path.js');
    const [ searchWord, setWord ] = useState(""); 
    const [ results, setResults ] = useState([]);
    let { token, setToken } = useContext(AuthContext);

    const refreshToken = async () => {
      
        const response = await fetch(bp.buildPath('api/refresh'), {
            method: 'POST',
            credentials: 'include',
            headers: { "Content-Type": "application/json"},
        });
  
        if (response.ok) {
            const data = await response.json();
            setToken(data.accessToken);
            return data.accessToken;
        } else {
            return null;
        }
    };
    
    async function search(term) {
        if (!token) {
            token = await refreshToken();
        }
        try {
            var obj = {
                "prompt":term
            }
            let js = JSON.stringify(obj);
            const response = await fetch(bp.buildPath('api/query'), {
                    method:'POST',
                    body: js,
                    headers:{
                        'Content-Type': 'application/json',
                        "authorization": token,
                    }
                });
                
                var txt = await response.text();
                var res = JSON.parse(txt);
                var _results = res.results.ret;
                console.log(_results[0]);
                
                if (typeof _results != undefined) {
                    setResults(_results);
                }

               
          } catch (error) {
            console.log(error);
          }
    }

    const searchWrapper = async (searchword) => {
        await search(searchword);
      }

    return (
        <>
        <Box  sx={{ width: '100%', bgcolor: '#16405B', height: 'auto'}}>
            <Box
               sx={{ height: '2vh'}}
            >
            </Box>

            <Image
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
            <TextField sx={{ width: '50vw'}} id="input-with-sx" label="Type a prompt" variant="standard" onChange={(e) => { setWord(e.target.value); }}/>
            <Button 
                onClick={() => searchWrapper(searchWord)} 
                sx={{ color: '#16405B', '&:hover': { backgroundColor: '#99c1dc' } }}
                >
                    Enter
                </Button>
        
        </Box>

        <Box sx={{ width: '100%', bgcolor: '#FFFFFF', marginTop: '5vh', padding: '2vh', textAlign: 'center' }}>
            {results.map((item) => (
                <Cards
                    key={item.id}
                    productName={item.Name}
                    productDescription={item.Description}
                    productImage={item.images}
                    productType={item.Category}
                />
            ))}
            
        </Box>
        


        </>
       
   
    );
}

export default Homepage;
