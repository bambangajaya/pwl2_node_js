//const express = require('express');
import fetch from 'node-fetch';
import express from 'express';
import ejs, { name } from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import bcrypt from 'bcrypt';
//const path =require('path');
const app = express();
const PORT = 3000;
// tentukan __filename dan _dirname secara manual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
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

app.get('/users/create', (req, res) => {
    res.render('user_create');
})

app.get('/users/:id', async (req, res) => {
    try {
        const response = await fetch(`http://localhost:8000/api/users/${req.params.id}`);

        const user = await response.json();
        res.render('user_show', { user: user });
    } catch (error) {
        console.error('Error fetching user;', error);
        res.status(500).send('error fetching user');
    }
});

app.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

       const response = await fetch('http://localhost:8000/api/users', {
            method: 'POST',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: req.body.name, 
                email: req.body.email,
                password: hashedPassword
            })
       });
        res.redirect('users');
    } catch (error) {
        console.error('Error creating user;', error);
        res.status(500).send('error creating user');
    }
});

app.get('/users/:id/edit', async (req, res) => {
    try {
        const response = await fetch(`http://localhost:8000/api/users/${req.params.id}`);

        const user = await response.json();
        res.render('user_update', { user: user });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('error fetching user');
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const dataToUpdate = {
            name: req.body.name,
            email: req.body.email
        };

        if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            dataToUpdate.password = hashedPassword;
        }

       await fetch(`http://localhost:8000/api/users/${req.params.id}`, {
            method: 'PUT',
            headers: {
                'content-Type': 'application/json'
            },
            body: JSON.stringify(dataToUpdate)
        });
        res.redirect('/users');
    } catch (error) {
        console.error('Error updating user;', error);
        res.status(500).send('error updating user');
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        await fetch(`http://localhost:8000/api/users/${req.params.id}`, {
            method: 'DELETE',
            
        });
        res.redirect('/users');
    } catch (error) {
        console.error('Error deleting users;', error);
        res.status(500).send('error deleting usersd');
    }
});