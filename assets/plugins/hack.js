const { command, isPrivate } = require("../../lib/");

command({
  pattern: "hack", // Command pattern
  fromMe: isPrivate, // Need to respond for everyone's message? true: only from sudo numbers, false: from everyone, isPrivate: same as false but will be considered as true if worktype is private
  desc: "hacking Prank", // Description of the command
  type: "user", // Command type
}, async (message, match) => {
  const { sleep } = require('../lib');

  await message.sendMessage("Injecting Malware");   
  await sleep(2000);    
  await message.sendMessage(" 😈█ 10%");    
  await sleep(1000);    
  await message.sendMessage(" 😈 █ █ 20%");    
  await sleep(1000);    
  await message.sendMessage(" 😈█ █ █ 30%");    
  await sleep(1000);    
  await message.sendMessage(" 😈█ █ █ █ 40%");    
  await sleep(1000);    
  await message.sendMessage(" 😈█ █ █ █ █ 50%");    
  await sleep(1000);    
  await message.sendMessage(" 😈█ █ █ █ █ █ 60%");    
  await sleep(1000);    
  await message.sendMessage(" 😈█ █ █ █ █ █ █ 70%");    
  await sleep(1000);    
  await message.sendMessage(" 😈█ █ █ █ █ █ █ █ 80%");    
  await sleep(1000);    
  await message.sendMessage(" 😈█ █ █ █ █ █ █ █ █ 90%");    
  await sleep(1000);    
  await message.sendMessage(" 😈█ █ █ █ █ █ █ █ █ █ 100%");    
  await sleep(1000);    
  await message.sendMessage(" 😈System hacking on process... \n Connecting to Server error to find 404");    
  await sleep(1000);    
  await message.sendMessage("😈Device successfully connected... \n Receiving data...");    
  await sleep(1000);    
  await message.sendMessage("😈Data hacked from device 100% completed \n Killing all evidence killing all malwares...");
  await sleep(1000);    
  await message.sendMessage(" 😈HACKING COMPLETED ");    
  await sleep(2000);    
  await message.sendMessage(" 😈SENDING LOG DOCUMENTS...");    
  await sleep(1000);
  await message.sendMessage(" 😈 *SUCCESSFULLY SENT DATA AND Connection disconnected*");    
  await sleep(1000);

  return await message.sendMessage('*BACKLOGS CLEARED*');
});
