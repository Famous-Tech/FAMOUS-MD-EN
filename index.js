const fs = require("fs").promises;
const path = require("path");
const config = require("./config");
const connect = require("./lib/connection");
const io = require("socket.io-client");
const { getandRequirePlugins } = require("./assets/database/plugins");
const readline = require('readline');
const { default: makeWASocket, generatePairingCode } = require('@whiskeysockets/baileys');

global.__basedir = __dirname; // Set the base directory for the project

const readAndRequireFiles = async (directory) => {
  try {
    const files = await fs.readdir(directory);
    return Promise.all(
      files
        .filter((file) => path.extname(file).toLowerCase() === ".js")
        .map((file) => require(path.join(directory, file)))
    );
  } catch (error) {
    console.error("Error reading and requiring files:", error);
    throw error;
  }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

async function initialize() {
  console.log("Starting FAMOUS-MD");
  try {
    // Demander le numéro de téléphone de l'utilisateur
    let phoneNumber = await question('Please enter your WhatsApp number (with country code, e.g., +50943782508): ');
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

    if (!phoneNumber.startsWith('+')) {
        console.log('Invalid phone number format. Make sure it starts with the country code.');
        process.exit(1);
    }

    const sock = makeWASocket();
    
    // Générer un code de pairing
    let code = await sock.requestPairingCode(phoneNumber);
    code = code?.match(/.{1,4}/g)?.join("-") || code;
    console.log(`Your Pairing Code: ${code}`);

    await readAndRequireFiles(path.join(__dirname, "/assets/database/"));
    console.log("Syncing Database");

    await config.DATABASE.sync();

    console.log("⬇  Installing Plugins...");
    await readAndRequireFiles(path.join(__dirname, "/assets/plugins/"));
    await getandRequirePlugins();
    console.log("✅ Plugins Installed!");
    const ws = io("https://socket.xasena.me/", { reconnection: true });
    ws.on("connect", () => console.log("Connected to server"));
    ws.on("disconnect", () => console.log("Disconnected from server"));
    
    rl.close();

    return await connect();
  } catch (error) {
    console.error("Initialization error:", error);
    return process.exit(1); // Exit with error status
  }
}

initialize();
