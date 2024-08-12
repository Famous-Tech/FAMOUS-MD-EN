const { command, isPrivate } = require("../../lib/");

command({
  pattern: "hack", // Command pattern
  fromMe: isPrivate, // Need to respond for everyone's message? true: only from sudo numbers, false: from everyone, isPrivate: same as false but will be considered as true if worktype is private
  desc: "hacking Prank", // Description of the command
  type: "user", // Command type
}, async (message, match) => {
  const {
    smd,
    prefix, 
    Config ,
    sleep
     } = require('../lib')







smd({
    cmdname: "hack",    
    type: "fun",    
    info: "hacking prank",    
    filename: __filename,

},

async(citel) => {    
await citel.send("Injecting Malware")   
await sleep(2000)    
await citel.send(" 😈█ 10%")    
await sleep(1000)    
await citel.send(" 😈 █ █ 20%")    
await sleep(1000)    
await citel.send(" 😈█ █ █ 30%")    
await sleep(1000)    
await citel.send(" 😈█ █ █ █ 40%")    
await sleep(1000)    
await citel.send(" 😈█ █ █ █ █ 50%")    
await sleep(1000)    
await citel.send(" 😈█ █ █ █ █ █ 60%")    
await sleep(1000)    
await citel.send(" 😈█ █ █ █ █ █ █ 70%")    
await sleep(1000)    
await citel.send(" 😈█ █ █ █ █ █ █ █ 80%")    
await sleep(1000)    
await citel.send(" 😈█ █ █ █ █ █ █ █ █ 90%")    
await sleep(1000)    
await citel.send(" 😈█ █ █ █ █ █ █ █ █ █ 100%")    
await sleep(1000)    
await citel.send(" 😈🗿System hacking on process.. \n Conecting to Server error to find 404 ")    
await sleep(1000)    
await citel.send("Device successfully connected... \n Receiving data...")    
await sleep(1000)    
await citel.send("Data hacked from divice 100% completed \n killing all evidence killing all malwares...")
await sleep(1000)    
await citel.send(" HACKING COMPLETED ")    
await sleep(2000)    
await citel.send(" SENDING LOG DOCUMENTS...")    
await sleep(1000)
await citel.send(" SUCCESSFULLY SENT DATA AND Connection disconnected")    
await sleep(1000)

    return await citel.send('BACKLOGS CLEARED');

}


});
