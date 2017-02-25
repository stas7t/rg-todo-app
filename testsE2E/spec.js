//During the test the env variable is set to 'test'
process.env.NODE_ENV = 'test';

// mongoose
let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let User = require('../models/Users');

let server = require('../server');

//Before test empty the users database
User.remove({}, function (err) { 
        
}); 

//Open app in browser
browser.get('http://localhost:8081/');

describe('RG TODO App', function() {
    var registerMenuLink = element(by.id('registerMenuLink'));
    var logInMenuLink = element(by.id('logInMenuLink'));
    var logOutMenuLink = element(by.id('logOutMenuLink'));

    /*before(function() {
        
    });*/

    beforeEach(function() {
        
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('TODO');
    });

    it('should have a url .../login', function() {
        expect(browser.getCurrentUrl())
            .toBe('http://localhost:8081/#/login');
    });

    it('should go to `register` view', function() {

        registerMenuLink.click();
        expect(browser.getCurrentUrl())
            .toBe('http://localhost:8081/#/register');
    });

    it('should register new user', function() {

        registerMenuLink.click();

        var register_form = element(by.id('register'));
        var username = element(by.model('user.username'));
        var password = element(by.model('user.password'));

        username.sendKeys('testuser_e2e');
        password.sendKeys('testusere2e123456');

        register_form.submit();

        expect(browser.getCurrentUrl())
            .toBe('http://localhost:8081/#/todolist');
    }); 

    it('should log out', function() {

        logOutMenuLink.click();

        expect(browser.getCurrentUrl())
            .toBe('http://localhost:8081/#/login');
    }); 

    it('should NOT register new user if username not specified', function() {

        registerMenuLink.click();

        var register_form = element(by.id('register'));
        var username = element(by.model('user.username'));
        var password = element(by.model('user.password'));
        var error_msg = browser.findElement(by.className('error'));

        username.sendKeys('');
        password.sendKeys('testusere2e123456');

        register_form.submit();

        expect(browser.getCurrentUrl()).toBe('http://localhost:8081/#/register');
        expect(error_msg.getText()).toBe('Please fill out all fields');
    }); 

    it('should NOT register new user if password not specified', function() {

        registerMenuLink.click();

        var register_form = element(by.id('register'));
        var username = element(by.model('user.username'));
        var password = element(by.model('user.password'));
        var error_msg = browser.findElement(by.className('error'));

        username.sendKeys('testuser_e2e');
        password.clear();

        register_form.submit();

        expect(browser.getCurrentUrl()).toBe('http://localhost:8081/#/register');
        expect(error_msg.getText()).toBe('Please fill out all fields');
    }); 

    it('should NOT register new user if password length < 6 chars', function() {

        registerMenuLink.click();

        var register_form = element(by.id('register'));
        var username = element(by.model('user.username'));
        var password = element(by.model('user.password'));
        var error_msg = browser.findElement(by.className('error'));

        username.sendKeys('testuser_e2e');
        password.sendKeys('12345');

        register_form.submit();

        expect(browser.getCurrentUrl()).toBe('http://localhost:8081/#/register');
    }); 

    it('should log in user', function() {

        //logOutMenuLink.click();

        logInMenuLink.click();

        var login_form = element(by.id('login'));
        var username = element(by.model('user.username'));
        var password = element(by.model('user.password'));

        username.sendKeys('testuser_e2e');
        password.sendKeys('testusere2e123456');

        login_form.submit();

        expect(browser.getCurrentUrl())
            .toBe('http://localhost:8081/#/todolist');
    });   

});