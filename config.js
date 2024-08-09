const { Sequelize } = require("sequelize");
const fs = require("fs");
require("dotenv").config();
const toBool = (x) => x === "true";
const DATABASE_URL = process.env.DATABASE_URL || "./assets/database.db";

module.exports = {
  ANTILINK: toBool(process.env.ANTI_LINK) || false,
  LOGS: toBool(process.env.LOGS) || true,
  ANTILINK_ACTION: process.env.ANTI_LINK || "delete",
  SESSION_ID: process.env.SESSION_ID || "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZUgvdklXUXRxQ3gxUW01Tmtub1BUeUZSRXgraDRPeW9UeEtzSThqa2sxaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZGp0WldJWlFFWFd1TmV4dUlUQzNITjNiYWZUL3VSRE9VMWo1WjhJUWdVST0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJzRGdaQnZBcEdDQ3dYNVZNL242bjhqKyszaUhmdGVRQS9ySVFIQWhxRDA4PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJzT1JwbUFvRmxxcUJjcFlKZElWRkRTU28yWXpWYjJ4RlVzcGVDRFROV0EwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldDR3lKTmNVOW1tVS9Da2pBb29HenI4U3lWL1pvdzBzUWFtR0Z0dVVtSG89In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdPVHJwY25SelZVTDAzSGFERGgrdGhGZnlLOTBPYXVuVGRPSi9LbkI2MG89In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoibUh3czRzeWI1QjNyY0xweWlDY1lZN1QyVERLeXl4cHB0L3hJVHg5SzBVaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZ2RlR2FpMWJFQ0dFYmtBSENaYUY0dWhXUEdndWUvV1I1V1RlR2wzRUlqQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImNITGxCeGx3NmtnaFFyL01aZHZ5aFkwVWUrRkNXTVVQcHlyRU5XZDNNeTBxUElJZlg0N09oOXhXWFYwaFpTY3ZFSVdzSkRQYTlBMVlYdURCTDBucUN3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MzEsImFkdlNlY3JldEtleSI6IkFaUjhpN3dld3R2R0Vnam0yZjB6NGpGdURCYVVlMGx5YWhzWnZvb2FDenc9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6Ikw4dDFSUVZKUUItYlF2WjA2MmxfdXciLCJwaG9uZUlkIjoiMWQ2NGQxYTAtN2ExOC00NGRjLWJmZjctZTQzMmQ1ZTc0NDZkIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik1RT25QQ0o0dHBtbjYyaWJTWFVsQXB4eTZzcz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ5WVgyOFVsSlZSTVJ0aCsxYU84cE9jZE9QZTA9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiREUzRFpMV00iLCJtZSI6eyJpZCI6IjUwOTQzNzgyNTA4Ojk0QHMud2hhdHNhcHAubmV0In0sImFjY291bnQiOnsiZGV0YWlscyI6IkNJbmw2L2dCRUoveDFiVUdHQWdnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJQNFliRnRTWnpGVFBwUTNzSHlsTHZucjNSQWdCUW5pZjVJZ3dZOGZQaTJNPSIsImFjY291bnRTaWduYXR1cmUiOiJhUGdPZ3dXRW1rNURqU3h1L1k3OG5oaHhudkdBQlE3eVBoT0FoU3lmYVVKaWpnOHIvOGI1c2xwcTZDOXJEV3RIUlh2REozNGc5OTl5NnU2SFB0eExEZz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiS2I1S2ZrL3FhUm8zaTVxLzRZV2ZGR2YxSDNDQkY1Q2JTc1hkaDR6R20xUFNRUmNhVzQrU0dGelY5MjIzeWhlRDAvUEYxSzN3SnpUVWpiY2kvOVhMQ0E9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI1MDk0Mzc4MjUwODo5NEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJUK0dHeGJVbWN4VXo2VU43QjhwUzc1NjkwUUlBVUo0bitTSU1HUEh6NHRqIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzIzMTY4OTQxfQ==",
  LANG: process.env.LANG || "EN",
  AUTH_TOKEN: "",
  HANDLERS:
    process.env.HANDLER === "false" || process.env.HANDLER === "null"
      ? "^"
      : "[#]",
  RMBG_KEY: process.env.RMBG_KEY || false,
  BRANCH: "main",
  WARN_COUNT: 3,
  PACKNAME: process.env.PACKNAME || "FAMOUS-MD",
  WELCOME_MSG: process.env.WELCOME_MSG || "*✰📍 FAMOUS ✮͢  MD📍✰* \n┗━━━━━✦❘༻👑༺❘✦━━━━ ━┛         \n🎗️ Welcome the new member(s)\n║ *New Member(s):*\n║ @user\n🎗️ Welcome to @gname\n╚════🎗️🎗️🎗️═════╝",
  GOODBYE_MSG: process.env.GOODBYE_MSG || "Bye @user\nGOODBYE ",
  AUTHOR: process.env.AUTHOR || "FAMOUS-TECH",
  SUDO:
    process.env.SUDO || "50943782508",
  HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || "",
  HEROKU_API_KEY: process.env.HEROKU_API_KEY || "",
  OWNER_NAME: process.env.OWNER_NAME || "FAMOUS-TECH",
  HEROKU: toBool(process.env.HEROKU) || false,
  BOT_NAME: process.env.BOT_NAME || "FAMOUS-MD",
  AUTO_READ: toBool(process.env.AUTO_READ) || false,
  AUTO_STATUS_READ: toBool(process.env.AUTO_STATUS_READ) || false,
  PROCESSNAME: process.env.PROCESSNAME || "FAMOUS-MD",
  WORK_TYPE: process.env.WORK_TYPE || "private",
  SESSION_URL: process.env.SESSION_URL || "",
  DELETED_LOG: toBool(process.env.DELETED_LOG) || false,
  DELETED_LOG_CHAT: process.env.DELETED_LOG_CHAT || false,
  REMOVEBG: process.env.REMOVEBG || false,
  DATABASE_URL: DATABASE_URL,
  STATUS_SAVER: toBool(process.env.STATUS_SAVER) || true,
  DATABASE:
    DATABASE_URL === "./assets/database.db"
      ? new Sequelize({
          dialect: "sqlite",
          storage: DATABASE_URL,
          logging: false,
        })
      : new Sequelize(DATABASE_URL, {
          dialect: "postgres",
          ssl: true,
          protocol: "postgres",
          dialectOptions: {
            native: true,
            ssl: { require: true, rejectUnauthorized: false },
          },
          logging: false,
        }),
};
