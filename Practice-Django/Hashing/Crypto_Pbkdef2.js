var Promise = require('bluebird');
var crypto = Promise.promisifyAll(require("crypto"));

// http://security.stackexchange.com/questions/110084/parameters-for-pbkdf2-for-password-hashing
var config = {
  hashBytes  : 64,          // size of the generated hash (to be chosen accordint the the chosen algo)
  saltBytes  : 16,          // sise of the salt : larger salt means hashed passwords are more resistant to rainbow table
  iterations : 500000,      // tune so that hashing the password takes about 1 second
  algo       :'sha512',
  encoding   : 'base64'     // hex is readable but base64 is shorter
};

/**
 * Hash a password using Node's asynchronous pbkdf2 (key derivation) function.
 *
 * Returns promise with a self-contained buffer encoded with config.encoding
 * that contains all the data needed to verify a password:
       -----------------------
       | SaltLen |     4     |
       -----------------------
       | Salt    | saltBytes |
       -----------------------
       | HashLen |     4     |
       -----------------------
       | Salt    | hashBytes |
       - ---------------------
*/
function hashPassword(password) {
    return crypto.randomBytesAsync(config.saltBytes)
        .then(function(vsalt) {
            salt = vsalt;
            return crypto.pbkdf2Async(password, salt, config.iterations, config.hashBytes, config.algo)
        })
        .then(function(hash) {
            var array = new ArrayBuffer(hash.length + salt.length + 8);
            var hashframe = Buffer.from(array);
            // extract parameters from buffer
            hashframe.writeUInt32BE(salt.length, 0, true);
            hashframe.writeUInt32BE(config.iterations, 4, true);
            salt.copy(hashframe, 8);
            hash.copy(hashframe, salt.length + 8);
            return hashframe.toString(config.encoding);
        });
}



/**
 * Verify a password using Node's asynchronous pbkdf2 (key derivation) function.
 *
 * Accepts a hash and salt generated by hashPassword, and returns whether the
 * hash matched the password (as a resolved promise).
 */
function verifyPassword(password, hashframe) {
    // decode and extract hashing parameters
    hashframe = Buffer.from(hashframe, config.encoding);
    var saltBytes  = hashframe.readUInt32BE(0);
    var hashBytes  = hashframe.length - saltBytes - 8;
    var iterations = hashframe.readUInt32BE(4);
    var salt = hashframe.slice(8, saltBytes + 8);
    var hash = hashframe.slice(8 + saltBytes, saltBytes + hashBytes + 8);
    // verify the salt and hash against the password
    return crypto.pbkdf2Async(password, salt, iterations, hashBytes, config.algo)
        .then(function(verify) {
            if (verify.equals(hash)) return Promise.resolve(true);
            return Promise.reject( new Error("wrong password")) ;
        })
}

exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;

// used for testing
console.time("hash");
hashPassword("abc")
    .then(function(hash) {
        console.log("hashframe", hash.toString(config.encoding));
        console.timeEnd("hash");
        return verifyPassword("bca", hash);
    })
    .then(function()     { console.log("Password is Correct...!!!");})
    .catch(function(err) { console.log("err", err);})
