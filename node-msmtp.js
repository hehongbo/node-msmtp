const child_process = require("child_process");
const sysexitsError = require("./sysexits-errors");

const defaultPort = security => {
    switch (security) {
        case "tls":
            return 465;
        case "starttls":
            return 587;
        default:
            return 25;
    }
}

const mailHeader = (
    {
        to = "",
        recipientName = "",
        subject = "",
        senderMail = "",
        senderName = ""
    }
) =>
    `From: ${
        senderName !== "" ? `"${senderName}" <${senderMail}>` : `${senderMail}`
    }\nTo: ${
        recipientName !== "" ? `"${recipientName}" <${to}>` : `${to}`
    }${
        subject !== "" ? `\nSubject: ${subject}` : ""
    }`;

module.exports = class {
    constructor(
        {
            mailAddress = "",
            smtpHost = "",
            smtpPort = "",
            security = "",
            username = "",
            password = "",
            senderName = ""
        }
    ) {
        if (smtpHost !== "" && mailAddress !== "" && password !== "") {
            this.msmtpInstance = child_process.spawn("msmtp", [
                `-v`,
                `--host=${smtpHost}`,
                `--port=${smtpPort || defaultPort(security)}`,
                "--auth=on",
                `--user=${username !== "" ? username : mailAddress}`,
                `--passwordeval=printf ${password}`,
                `--tls=${security === "tls" || security === "starttls" ? "on" : "off"}`,
                `--tls-starttls=${security === "starttls" ? "on" : "off"}`,
                "--read-envelope-from",
                "--read-recipients"
            ]);
            this.msmtpInstance.on("error", err => {
                if (err.code === "ENOENT") {
                    throw new Error("MSMTP_NOT_INSTALLED");
                } else throw err;
            });
            this.senderName = senderName;
            this.mailAddress = mailAddress;
        } else {
            throw new Error("MISSING_PARAM");
        }
    }

    sendMail(
        {
            to = "",
            recipientName = "",
            subject = "",
            body
        }
    ) {
        return new Promise((resolve, reject) => {
            this.msmtpInstance.on("close", code => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(sysexitsError(code));
                }
            });
            this.msmtpInstance.stdin.write(mailHeader({
                to: to,
                recipientName: recipientName,
                subject: subject,
                senderMail: this.mailAddress,
                senderName: this.senderName
            }));
            this.msmtpInstance.stdin.write("\n\n");
            this.msmtpInstance.stdin.write(body);
            this.msmtpInstance.stdin.end();
        });
    }
}
