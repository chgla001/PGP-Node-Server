const sqlite3 = require('sqlite3').verbose();

/**
 * @param DATABASE_TABLES includes all database Tables for this application
 * @param DATABASE_TABLES.USER_TABLE includes all row names for the database named 'users'
 * @param DATABASE_TABLES.USER_TABLE includes all row names for the database named 'messages'
 */

const DATABASE_TABLES = {
    USER_TABLE = {
        ID: 'id',
        NAME: 'name',
        EMAIL: 'email',
        PASSWORD: 'password',
        PGP_KEY: 'pgpKey'
    },
    MESSAGE_TABLE = {
        ID = 'id',
        TEXT = 'text',
        TIMESTAMP = 'timestamp',
        READ = 'read',
        FROM_USER_ID = 'fromUserId',
        TO_USER_ID = 'toUserId'
    }
}

class Database {

    constructor() {
        this.db = new sqlite3.Database('./test.db');
        /*this.db.on('trace', (sql) => {
            console.log(sql);
        });*/
    }

    init() {
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS users (${DATABASE_TABLES.USER_TABLE.ID} INTEGER PRIMARY KEY AUTOINCREMENT, ${DATABASE_TABLES.USER_TABLE.NAME}, ${DATABASE_TABLES.USER_TABLE.EMAIL}, ${DATABASE_TABLES.USER_TABLE.PASSWORD}, ${DATABASE_TABLES.USER_TABLE.PGP_KEY})`);
            // this.db.run(`CREATE TABLE IF NOT EXISTS preKeys (registrationId, keyId, pubPreKey)`);
            // this.db.run(`CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, recipientRegistrationId, ciphertext)`);
        });
    }

    createUser(data) {
        const stmt = this.db.prepare(`INSERT INTO users (${DATABASE_TABLES.USER_TABLE.NAME}, ${DATABASE_TABLES.USER_TABLE.EMAIL}, ${DATABASE_TABLES.USER_TABLE.PASSWORD}, ${DATABASE_TABLES.USER_TABLE.PGP_KEY}) VALUES ($name, $email, $password, $pgpKey)`);
        return new Promise((resolve, reject) => {
            stmt.run({
                $name: data.username,
                $email: data.email,
                $password: data.password,
                $pgpKey: data.pgpKey
            }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
            stmt.finalize();
        });
    }

    /**
     * @param id the user id
     * @returns the full data for a user according to the id
     */
    getUserById(id) {
        const stmt = this.db.prepare(`SELECT * FROM users WHERE id = $id`);
        return new Promise((resolve, reject) => {
            stmt.get({
                $id: id
            }, (err, row) => {
                if (!err && row) {
                    resolve(row);
                } else {
                    reject(err);
                }
            });
            stmt.finalize();
        });
    }

    /**
     * @description This Methods returns all users from the database 'users' by a given name
     * @param name the username
     * @returns the full data for a user according to the name of the user from the database 'users'
     */
    getUserByName(name) {
        const stmt = this.db.prepare(`SELECT * FROM users WHERE name = $name`);
        return new Promise((resolve, reject) => {
            stmt.get({
                $name: name
            }, (err, row) => {
                if (!err && row) {
                    resolve(row);
                } else {
                    reject(err);
                }
            });
            stmt.finalize();
        });
    }

    /**
     * @description This Method returns all Users
     * @return all Data from all users in the Database 'users'
     */
    getAllUsers() {
        const stmt = this.db.prepare(`SELECT * FROM users`);
        return new Promise((resolve, reject) => {
            stmt.all({}, (err, row) => {
                if (!err && row) {
                    resolve(row);
                } else {
                    reject(err);
                }
            });
            stmt.finalize();
        });
    }

    
    /**
     * @description This Method saves a new Message in the database 'messages'
     * @return
     * @param data contains all data for a new message
     */
    createMessage(data) {
        const stmt = this.db.prepare(`INSERT INTO messages (recipientRegistrationId, ciphertext) VALUES ($recipientRegistrationId, $ciphertext)`);
        return new Promise((resolve, reject) => {
            stmt.run({
                $recipientRegistrationId: data.recipientRegistrationId,
                $ciphertext: data.ciphertext
            }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
            stmt.finalize();
        });
    }

    getAllMessagesByRegistrationId(registrationId) {
        const stmt = this.db.prepare(`SELECT * FROM messages WHERE recipientRegistrationId = $registrationId`);
        return new Promise((resolve, reject) => {
            stmt.all({
                $registrationId: registrationId
            }, (err, rows) => {
                if (!err && rows) {
                    resolve(rows);
                } else {
                    reject(err);
                }
            });
            stmt.finalize();
        });
    }

}

const instance = new Database();
instance.init();
module.exports = instance;