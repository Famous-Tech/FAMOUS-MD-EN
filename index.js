const fs = require("fs").promises;
const path = require("path");
const config = require("./config");
const connect = require("./lib/connection");
const io = require("socket.io-client");
const { getandRequirePlugins } = require("./assets/database/plugins");
const { parsePhoneNumber } = require("libphonenumber-js");
const readline = require("readline");

global.__basedir = __dirname; // Set the base directory for the project

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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

async function requestPhoneNumber() {
  return new Promise((resolve) => {
    rl.question("Please enter your WhatsApp number (e.g., +2348108395270): ", (number) => {
      resolve(number);
    });
  });
}

async function getUserPhoneNumber() {
  let phoneNumber = config.Usernumber || process.env.Usernumber;

  if (!phoneNumber) {
    phoneNumber = await requestPhoneNumber();
  }

  const parsedNumber = parsePhoneNumber(phoneNumber);
  if (!parsedNumber.isValid()) {
    console.error("Invalid phone number. Please ensure it includes the country code.");
    process.exit(1);
  }

  return parsedNumber.number;
}

async function initialize() {
  console.log("Starting FAMOUS-MD");
  try {
    const userPhoneNumber = await getUserPhoneNumber();

    // Here we request a pairing code for the user number
    const pairingCode = await connect.requestPairingCode(userPhoneNumber);
    console.log(`Your Pairing Code: ${pairingCode.match(/.{1,4}/g).join('-')}`);

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
    return await connect();
  } catch (error) {
    console.error("Initialization error:", error);
    return process.exit(1); // Exit with error status
  } finally {
    rl.close();
  }
}

initialize();
