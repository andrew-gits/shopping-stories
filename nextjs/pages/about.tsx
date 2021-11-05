import AboutNav from '@components/AboutNav';
import Header from '@components/Header';
import { Paper } from '@mui/material';
import { NextPage } from 'next';
import React from 'react';
import backgrounds from 'styles/backgrounds.module.css';

const AboutPage: NextPage = () => {
    return (
        <>
            <div className={backgrounds.colorBackground}>
                <Header />
                <Paper
                    elevation={3}
                    sx={{
                        backgroundColor: `var(--secondary-bg)`,
                        margin: '3rem',
                        padding: '1rem',
                    }}
                >
                    <h1>About Page</h1>
                </Paper>
                <Paper
                    elevation={3}
                    sx={{
                        backgroundColor: `var(--secondary-bg)`,
                        margin: '3rem',
                        padding: '1rem',
                    }}
                >
                    <AboutNav />
                </Paper>
            </div>
        </>
    );
};

export default AboutPage;
