/**
 * The standard exit codes from `sysexits.h` are used by msmtp.
 * Converting them into Javascript errors.
 *
 * @see https://www.freebsd.org/cgi/man.cgi?query=sysexits&manpath=FreeBSD+4.3-RELEASE
 */

module.exports = code => {
    switch (code) {
        case 64:
            return new Error("EX_USAGE");
        case 65:
            return new Error("EX_DATAERR");
        case 66:
            return new Error("EX_NOINPUT");
        case 67:
            return new Error("EX_NOUSER");
        case 68:
            return new Error("EX_NOHOST");
        case 69:
            return new Error("EX_UNAVAILABLE");
        case 70:
            return new Error("EX_SOFTWARE");
        case 71:
            return new Error("EX_OSERR");
        case 72:
            return new Error("EX_OSFILE");
        case 73:
            return new Error("EX_CANTCREAT");
        case 74:
            return new Error("EX_IOERR");
        case 75:
            return new Error("EX_TEMPFAIL");
        case 76:
            return new Error("EX_PROTOCOL");
        case 77:
            return new Error("EX_NOPERM");
        case 78:
            return new Error("EX_CONFIG");
    }
};
