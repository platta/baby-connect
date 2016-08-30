var login = require('./login');

/**
 * Records the e-mail and password and loads the list of Child Ids for future
 * reference.
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
function initialize(email, password, callback) {
    // Record e-mail and password.
    this.email = email;
    this.password = password;
    
    // Save reference to this so we can use it inside a callback.
    var _this = this;

    login(email, password, function(error, data) {
        if (error) {
            callback(error);
        } else {
            // Scrape child Ids from web page.
            data.evaluate(function() {
                var children = {};

                var items = document.querySelectorAll('#kid_select_row li');
                items.forEach(function(item) {
                    if (item.id !== 'kid0') {
                        // Remove 'kid' from the beginning of the id.
                        children[item.getElementsByTagName('span')[0].innerHTML.toUpperCase()] = item.id.substring(3);
                    }
                });

                return children;
            })
            .end()

            // Receive results.
            .then(function(results) {
                // Retrieve results scraped from the page and store them.
                _this.children = results;

                // Invoke callback.
                callback(null, _this);
            })

            // Error handling.
            .catch(function(error) {
                callback(error);
            });
        }
    });
}

module.exports = initialize;