module.exports = (function executor(cmd, retries, tries) {
    retries = retries || 0;
    tries = tries || 0;
    const exec = require('child_process').exec;
    let p = new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            ++tries;
            if (error) {
                console.error(stderr);
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
    return p.catch((error) => {
        if(tries < retries) {
            console.log('retry', tries);
            return executor(cmd, retries, tries);
        } else {
            console.error(error);
            throw new Error('Failed after ' + retries + ' retries');
        }
    });
});