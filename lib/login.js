var Nightmare = require('nightmare');

/**
 * Logs into the baby-connect web site and returns a Nightmare object that is
 * primed for further action.
 * 
 * @param {string} email
 *  The e-mail address to use to log in.
 * 
 * @param {string} password
 *  The password to use to log in.
 * 
 * @param {function(Object, Object): void} callback
 *  A callback function to invoke when finished.
 */
function login(email, password, callback) {
    var nightmare = Nightmare()

        // Load page.
        .goto('https://www.baby-connect.com/login')
        .wait('#email')

        // Type in username.
        .type('#email', email)
        .wait(100)
        
        // Type in password.
        .type('#pass', password)
        .wait(100)

        // Click the login button.
        // For some reason this stopped working. Using a different method.
        //.click('#save')
        .evaluate(function () {
            document.querySelector('form.loginbox').submit();
        })
        .wait(500)

        // Wait for page load.
        .wait('#kid_select_row');

    callback(null, nightmare);
}

module.exports = login;