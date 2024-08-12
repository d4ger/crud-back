// db/db.js

import sqlite3 from 'sqlite3';
import path from 'path';

class DB {
    constructor() {
        // Ruta de la base de datos
        this.dbPath = path.resolve('./db/contacts.db');

        // Conectar la base de datos (Se crea si no existe)
        this.db = new sqlite3.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Error opening database: ', err.message);
            } else {
                console.log('Connected to the database.');

                // Crear la tabla de contactos
                this.db.run(`
                    CREATE TABLE IF NOT EXISTS contacts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        first_name TEXT NOT NULL,
                        last_name TEXT NOT NULL,
                        email TEXT UNIQUE,
                        phone_number TEXT UNIQUE,
                        address TEXT,
                        company TEXT,
                        job_title TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `, (err) => {
                    if (err) {
                        console.error('Error creating table: ', err.message);
                    } else {
                        console.log('Table created successfully');
                    }
                });

                // Crear el trigger para actualizar la fecha de actualización
                this.db.run(`
                    CREATE TRIGGER IF NOT EXISTS update_timestamp
                    AFTER UPDATE ON contacts
                    FOR EACH ROW
                    BEGIN
                        UPDATE contacts SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
                    END;
                `, (err) => {
                    if (err) {
                        console.error('Error creating trigger:', err.message);
                    } else {
                        console.log('Trigger for updated_at field created or already exists.');
                    }
                });
            }
        });
    }

    // Método para CREAR un contacto
    createContact(first_name, last_name, email, phone_number, address, company, job_title) {
        this.db.run(
            'INSERT INTO contacts (first_name, last_name, email, phone_number, address, company, job_title) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone_number, address, company, job_title],
            (err) => {
                if (err) {
                    console.error('Error inserting contact:', err.message);
                } else {
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                }
            }
        )
    }

    //Metodo para leer contactos
    getContacts(id) {
        this.db.get(
            `SELECT * FROM contacts WHERE id = ?
            `, [id], (err, row) => {
                if (err) {
                    console.error('Error reading contact:', err.message);
                } else {
                    console.log(row);
                }
            }
        );
    }

    //Actualizar un contacto
    updateContact(id, first_name, last_name, email, phone_number, address, company, job_title) {
        this.db.run(
            'UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ?, company = ?, job_title = ? WHERE id = ?',
            [first_name, last_name, email, phone_number, address, company, job_title, id],
            (err) => {
                if (err) {
                    console.error('Error updating contact:', err.message);
                } else {
                    console.log(`A row has been updated with rowid ${this.lastID}`);
                }
            }
        );
    }

    // Eliminar un contacto
    deleteContact(id) {
        this.db.run(
            'DELETE FROM contacts WHERE id = ?',
            [id],
            (err) => {
                if (err) {
                    console.error('Error deleting contact:', err.message);
                } else {
                    console.log(`A row has been deleted with rowid ${this.lastID}`);
                }
            }
        );
    }

    // Método para obtener todos los contactos
    getAllContacts() {
        this.db.all(
            `SELECT * FROM contacts`,
            (err, rows) => {
                if (err) {
                    console.error('Error retrieving contacts:', err.message);
                } else {
                    console.log(rows);
                }
            }
        );
    }

    // Método para cerrar la conexión a la base de datos
    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database: ', err.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    }
}

// Exportar la clase como default
export default DB;
