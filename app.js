//const express = require('express');
import fetch from 'node-fetch';
import express from 'express';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
//const path =require('path');
const app = express();
const PORT = 3000;
// tentukan __filename dan _dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//set folder 'public' untuk file statis (css, js)
app.use(express.static(path.join(__dirname, 'views')));
// set ejs untuk view
app.set('views', path.join(__dirname, 'views'));
app.engine ('html', ejs.renderFile);
app.set('view engine', 'html');
//route ke halaman utama
app.get('/', (req,res) => {
    res.render(' ');
});
// route untuk mendapatkan dasa user dari laravel API
app.get('/users', async (req, res) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/users');
        const users = await response.json();
        res.render('user', { users: users });
    } catch (error) {
        console.error('Error fetching users;', error);
        res.status(500).send('error fetching users');
    }
});
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});