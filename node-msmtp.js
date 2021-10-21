const child_process = require("child_process");
const sysexitsError = require("./sysexits-errors");

module.exports = class {
    constructor(
        {
            smtpHost = "",
            smtpPort = "",
            security = "",
            username = "",
            password = "",
        }
    ) {
        if (smtpHost !== "" && smtpPort !== "" && username !== "" && password !== "") {
            this.msmtpInstance = child_process.spawn("msmtp", [
                `-v`,
                `--host=${smtpHost}`,
                `--port=${smtpPort}`,
                "--auth=on",
                `--user=${username}`,
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
        } else {
            throw new Error("MISSING_PARAM");
        }
    }

    sendMail(mail) {
        return new Promise((resolve, reject) => {
            this.msmtpInstance.on("close", code => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(sysexitsError(code));
                }
            });
            this.msmtpInstance.stdin.write(mail);
            this.msmtpInstance.stdin.end();
        });
    }
}
