const sqlite3 = require('sqlite3').verbose();

/**
 * @param DATABASE_TABLES includes all database Tables for this application
 * @param DATABASE_TABLES.USER_TABLE includes all row names for the database named 'users'
 * @param DATABASE_TABLES.MESSAGE_TABLE includes all row names for the database named 'messages'
 */

const DATABASE_TABLES = {
    USER_TABLE: {
        ID: 'id',
        NAME: 'name',
        EMAIL: 'email',
        PASSWORD: 'password',
        PGP_KEY: 'pgpKey'
    },
    MESSAGE_TABLE: {
        ID: 'id',
        TEXT: 'text',
        TIMESTAMP: 'timestamp',
        READ: 'read',
        SENDER_ID: 'senderId',
        RECIPIENT_ID: 'recipientId'
    }
}

class Database {

    constructor() {
        this.db = new sqlite3.Database('./pgp.db');
    }

    init() {
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE IF NOT EXISTS users (
                ${DATABASE_TABLES.USER_TABLE.ID} INTEGER PRIMARY KEY AUTOINCREMENT,
                ${DATABASE_TABLES.USER_TABLE.NAME} TEXT,
                ${DATABASE_TABLES.USER_TABLE.EMAIL} TEXT,
                ${DATABASE_TABLES.USER_TABLE.PASSWORD} TEXT,
                ${DATABASE_TABLES.USER_TABLE.PGP_KEY} TEXT)
            `);
            this.db.run(`CREATE TABLE IF NOT EXISTS messages (
                ${DATABASE_TABLES.MESSAGE_TABLE.ID} INTEGER PRIMARY KEY AUTOINCREMENT,
                ${DATABASE_TABLES.MESSAGE_TABLE.TEXT} TEXT,
                ${DATABASE_TABLES.MESSAGE_TABLE.TIMESTAMP} INTEGER,
                ${DATABASE_TABLES.MESSAGE_TABLE.READ} BOOLEAN,
                ${DATABASE_TABLES.MESSAGE_TABLE.SENDER_ID} INTEGER,
                ${DATABASE_TABLES.MESSAGE_TABLE.RECIPIENT_ID} INTEGER)
            `);
        });
    }

    createUser(data) {
        const stmt = this.db.prepare(`INSERT INTO users (${DATABASE_TABLES.USER_TABLE.NAME}, ${DATABASE_TABLES.USER_TABLE.EMAIL}, ${DATABASE_TABLES.USER_TABLE.PASSWORD}, ${DATABASE_TABLES.USER_TABLE.PGP_KEY}) VALUES ($name, $email, $password, $pgpKey)`);
        return new Promise((resolve, reject) => {
            stmt.run({
                $name: data.name,
                $email: data.email,
                $password: data.password,
                $pgpKey: data.pgpkey
            }, (err) => {
                if (!err) {
                    resolve();
                } else {
                    console.log("db", err);
                    reject(err);
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
        const stmt = this.db.prepare(`SELECT ${DATABASE_TABLES.USER_TABLE.ID}, ${DATABASE_TABLES.USER_TABLE.NAME}, ${DATABASE_TABLES.USER_TABLE.EMAIL}, ${DATABASE_TABLES.USER_TABLE.PGP_KEY} FROM users WHERE ${DATABASE_TABLES.USER_TABLE.ID} = $id`);
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
        const stmt = this.db.prepare(`SELECT * FROM users WHERE ${DATABASE_TABLES.USER_TABLE.NAME} = $name`);
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
     * @description This Method returns all Usernames
     * @return only the usernames from the users in the Database 'users'
     */
    getUser() {
        const stmt = this.db.prepare(`SELECT ${DATABASE_TABLES.USER_TABLE.ID}, ${DATABASE_TABLES.USER_TABLE.NAME} FROM users`);
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

    //@TODO hier weiter
    /**
     * @description This Method saves a new Message in the database 'messages'
     * @return
     * @param data contains all data for a new message
     */
    createMessage(data) {
        const stmt = this.db.prepare(`INSERT INTO messages (${DATABASE_TABLES.MESSAGE_TABLE.TEXT}, ${DATABASE_TABLES.MESSAGE_TABLE.TIMESTAMP}, ${DATABASE_TABLES.MESSAGE_TABLE.READ}, ${DATABASE_TABLES.MESSAGE_TABLE.SENDER_ID}, ${DATABASE_TABLES.MESSAGE_TABLE.RECIPIENT_ID}) VALUES ($text, $timestamp, $read, $senderid, $receiverid)`);
        return new Promise((resolve, reject) => {
            stmt.run({
                $text: data.text,
                $timestamp: data.timestamp,
                $read: data.read,
                $senderid: data.senderid,
                $receiverid: data.receiverid
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

    getLastMessageFromSenderById(senderId) {
        const stmt = this.db.prepare(`SELECT * FROM messages WHERE ${DATABASE_TABLES.MESSAGE_TABLE.SENDER_ID} = $senderId ORDER BY id DESC LIMIT 1`);
        return new Promise((resolve, reject) => {
            stmt.get({
                $senderId: senderId
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

    getMessages(senderId, receiverId) {
        const stmt = this.db.prepare(`SELECT * FROM messages WHERE ${DATABASE_TABLES.MESSAGE_TABLE.SENDER_ID} = $senderId AND ${DATABASE_TABLES.MESSAGE_TABLE.RECIPIENT_ID} = $receiverId AND ${DATABASE_TABLES.MESSAGE_TABLE.READ} = 0`);
        return new Promise((resolve, reject) => {
            stmt.all({
                $senderId: senderId,
                $receiverId: receiverId
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

    updateMessage(messageId) {
        const stmt = this.db.prepare(`UPDATE messages set ${DATABASE_TABLES.MESSAGE_TABLE.READ} = 1 WHERE ${DATABASE_TABLES.MESSAGE_TABLE.ID} = $messageId`);
        return new Promise((resolve, reject) => {
            stmt.run({
                $messageId: messageId
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
}

const instance = new Database();
instance.init();
module.exports = instance;