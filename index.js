const fs = require("fs").promises;
const path = require("path");
const config = require("./config");
const connectModule = require("./lib/connection"); // Import the whole module as an object
const io = require("socket.io-client");
const { getandRequirePlugins } = require("./assets/database/plugins");

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

async function initialize() {
  console.log("Starting FAMOUS-MD");
  try {
    // Check if Usernumber is set in config or environment variables
    let usernumber = config.Usernumber || process.env.Usernumber;

    // If Usernumber is not set, prompt the user for it
    if (!usernumber) {
      const readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      usernumber = await new Promise((resolve) => {
        readline.question("Please enter your phone number: ", (answer) => {
          readline.close();
          resolve(answer.trim());
        });
      });
    }

    console.log(`Using phone number: ${usernumber}`);

    // Request pairing code using the provided usernumber
    const { requestPairingCode } = connectModule;
    const pairingCode = await requestPairingCode(usernumber);
    console.log(`Pairing code: ${pairingCode}`);

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

    return await connectModule.connect();
  } catch (error) {
    console.error("Initialization error:", error);
    return process.exit(1); // Exit with error status
  }
}

initialize();
