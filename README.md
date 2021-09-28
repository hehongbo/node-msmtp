# node-msmtp

A simple msmtp wrapper for node. 

## Usage

Create an object out of this library.

```javascript
const Msmtp = require("node-msmtp");
let msmtp = new Msmtp({
    mailAddress: "bob@example.com",
    smtpHost: "smtp.example.com",
    smtpPort: 465,
    security: "tls",
    username: "bob@example.com",
    password: "yourpassword",
    senderName: "Bob"
});
```

Then call `sendMail()` method to send your mail.

```javascript
msmtp.sendMail({
    to: "alice@example.com",
    recipientName: "Alice",
    subject: "Greetings",
    body: "It's a nice day!"
}).then(() => {
    console.log("Send successfully.");
}).catch(e => {
    console.log("Failed to send.");
});
```
