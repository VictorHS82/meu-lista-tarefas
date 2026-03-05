import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'task.db';
let database: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase>{
    if(database) {
        return database;
    }

    database = await SQLite.openDatabaseAsync(DATABASE_NAME);
    await runMigrations(database);
    return database;
}

async function runMigrations(database: SQLite.SQLiteDatabase){
    await database.execAsync(
        `PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            completed INTEGER NOT NULL,
            createdAT TEXT NOT NULL
        );`,
    )
}