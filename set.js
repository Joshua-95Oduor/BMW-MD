const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidU4rNkdHaWRxaXdFdHdLZUhiM3FubjRLRi9kOEQ5b2hoVkhQaW5xVCtIVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib3hXOXE5V1BaV0QxYlVsdm9weExtZzBuSUwrdDM2NkhLd1dZbkJ2TzVpcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI2Q1Q3dEZvUXUraDU3bHJnZGRYc0tHY1lPTjVJUGxNLy9aWHE0bXBYRTBvPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ4TXJtQ1YxdnlZS3d3aDJXdEZsRGZkVzlXa2YvWjVlcDdFdUpPT0xySng4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InNIdGRMbVNjUjdaMlVtZjNTZU1IbWN0Z2NCbzFhNStPTGN5bVFCa09ERVU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImZ0eWo0d2xEYlpqMjlyODQybnNnbGNmV3F5VURZRWpUZ2w3a2I0RTdIemc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNEx5NlJVeDVIU2F0SjlYQjNkaS9jTVI3ejErVjBJRXdlQUZMZjhYN3hIdz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ2JNeGZGWXE0bFVuNDkzbTVTdGtRMWs4eG5NMnRDVG1SMGFZbTEwbjFrYz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkhNMGlVKzNtS1F2enZXT0hOS0NHYXgvbnhGeDlzQUJIMHZnVzIyZ0h1VFdhM29ZbDRUMzlQWE5CZC9jcWcrRnVYN3hpUVRWWjBKZWx3UXhVNnpIaENnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTgwLCJhZHZTZWNyZXRLZXkiOiJjNlZQUFlMZlU0cVg3MFprTmo3cVhMTmZqNERoekdlOUZwZEx5MzRiZ3Z3PSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJxLUNRU0o4X1F2bUpFbHo3X0tjZUpBIiwicGhvbmVJZCI6ImRlZGIzNWNhLTFiNTMtNGE3ZS04ZjAzLTNlYjMyMWNkYzhkMyIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJuZ0tiMzhGSlIxYkVDOWdtVEtoQWlrdkJydU09In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiam5LQlJ6QTJBMlFDaDREeVVXS2RKL2JzdnlVPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ikw2SjlER0g2IiwibWUiOnsiaWQiOiIyNTQ3MTcwOTAxOTI6MUBzLndoYXRzYXBwLm5ldCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS09QaVlnRUVLcml4N1VHR0VvZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiaElmNDlud2NTbnM3MTFJc1RYMjh1dDY5NklkNTQzY2c5UXdSc2xaVlBWRT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiNENVVnBZaEV0MDc5cTZONUkyZU5JMC9hNVgzZDVWRDcyVkd0WURadWJYNHFFaFlBeWtWVWRpYm5PQ1pyYnh5NlFlMWwxeTl5bTFEMlZyczFuYVVIRHc9PSIsImRldmljZVNpZ25hdHVyZSI6InhkRUgrU3FxTHhObFdOM3VxbUFscXEyYTlJdnBkTW1FbFRkZzRJRWl4ME9QUlF1ZlAzVm94dDcvMHAzRkNsMHYwZS9iUXFvRHV1TUVETzZGaVBwVEFRPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjU0NzE3MDkwMTkyOjFAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCWVNIK1BaOEhFcDdPOWRTTEUxOXZMcmV2ZWlIZWVOM0lQVU1FYkpXVlQxUiJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyMjkzNzY1NiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFDTWIifQ==',
    PREFIXE: process.env.PREFIX || "!",
    OWNER_NAME: process.env.OWNER_NAME || "Ibrahim Adams",
    NUMERO_OWNER : process.env.NUMERO_OWNER || " Ibrahim Adams",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'BMW_MD',
    URL : process.env.BOT_MENU_LINKS || 'https://telegra.ph/file/17c83719a1b40e02971e4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    CHATBOT : process.env.PM_CHATBOT || 'no',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
