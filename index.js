import express from 'express';
import bodyParser from 'body-parser';
import DB from './db/db.js';

const app = express();
const port = 3007;

// Iniciar la base de datos
const db = new DB();

// Middleware para analizar cuerpos JSON
app.use(bodyParser.json());

// Ruta para crear un contacto
app.post('/contacts', (req, res) => {
    const { first_name, last_name, email, phone_number, address, company, job_title } = req.body;

    db.createContact(first_name, last_name, email, phone_number, address, company, job_title, (err, id) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id });
        }
    });
});

// Ruta para obtener un contacto por ID
app.get('/contacts/:id', (req, res) => {
    const id = req.params.id;

    db.getContacts(id, (err, contact) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (!contact) {
            res.status(404).json({ error: 'Contact not found' });
        } else {
            res.json(contact);
        }
    });
});

// Ruta para obtener todos los contactos
app.get('/contacts', (req, res) => {
    db.getAllContacts((err, contacts) => {
       if (err) {
           res.status(500).json({ error: err.message });
       } else {
           res.json(contacts);
       }
    });
});

// Ruta para actualizar un contacto
app.put('/contacts/:id', (req, res) => {
    const id = req.params.id;
    const { first_name, last_name, email, phone_number, address, company, job_title } = req.body;

    db.updateContact(id, first_name, last_name, email, phone_number, address, company, job_title, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: 'Contact updated successfully' });
        }
    });
});

// Ruta para eliminar un contacto
app.delete('/contacts/:id', (req, res) => {
    const id = req.params.id;

    db.deleteContact(id, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json({ message: 'Contact deleted successfully' });
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
