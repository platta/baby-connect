/**
 * Main class object for the baby-connect module.
 */
function BabyConnect() {
    /**
     *  E-mail address for logging into the baby-connect web site.
     * 
     * @type {string}
     */
    this.email = null;

    /**
     * Password for logging into the baby-connect web site.
     * 
     * @type {string}
     */
    this.password = null;

    /**
     * Object used to map child names to their Ids. 
     * 
     * @type {Object}
     */
    this.children = {};
}

// Attach methods.
BabyConnect.prototype.initialize = require('./initialize');
BabyConnect.prototype.bottle = require('./bottle');
BabyConnect.prototype.diaper = require('./diaper');

module.exports = new BabyConnect();