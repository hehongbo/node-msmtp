# node-msmtp

![npm version](https://img.shields.io/npm/v/node-msmtp)

A simple msmtp wrapper for node. 

## Usage

- Install `node-msmtp`.

  ```shell
  npm install node-msmtp
  ```

- Also, `msmtp` binary should exist on the system. You may want to install one with your package manager.

  ```shell
  apt-get install msmtp # Debian/Ubuntu
  apk add msmtp # Alpine Linux
  brew install msmtp # Homebrew on macOS
  ```

- Create an object out of this library. This will spawn an `msmtp` process, which waits for your composed email.

  ```javascript
  const Msmtp = require("node-msmtp");
  let msmtp = new Msmtp({
      smtpHost: "smtp.example.com",
      smtpPort: 465,
      security: "tls",
      username: "yourname@example.com",
      password: "yourpassword",
  });
  ```
  
  To use STARTTLS, start the instance with `security: "starttls"`, or omit it if you want to use unencrypted SMTP.

- Compose your mail and send with the `sendmail()` method. `msmtp` process will read recipients from the mail's header.

  ```javascript
  let mail = "";
  
  // Mail header starts here.
  mail += "From: YourName <yourname@example.com>\r\n";
  mail += "To: Someone <someone@example.com>\r\n";
  mail += "Subject: Greetings\r\n";
  mail += "\r\n";
  // Mail body starts here.
  mail += "It's a nice day!";
  
  msmtp.sendMail(mail).then(() => {
      console.log("Send successfully.");
  }).catch(e => {
      console.log("Failed to send.");
  });
  ```

  `msmtp` uses exit codes defined by `sysexits(3)`. Exit codes other than `0` will be thrown as a Javascript error.
  
  Typically, you will receive an `EX_NOHOST` if the host is not reachable (either a wrong input or a broken connection 
  is possible), or `EX_NOPERM` if the username/password combination is not correct. 
 
  See [sysexits](https://www.freebsd.org/cgi/man.cgi?query=sysexits&manpath=FreeBSD+4.3-RELEASE) for more information. 