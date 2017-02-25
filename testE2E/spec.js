//During the test the env variable is set to 'test'
process.env.NODE_ENV = 'test';

// mongoose
let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let User = require('../models/Users');

// Load test server
let server = require('../server');

//Before test empty the users database
User.remove({}, function (err) { 
        
}); 

//Open app in browser
browser.get('http://localhost:8081/');

describe('Register, Log In, Log Out', function() {
    var registerMenuLink = element(by.id('registerMenuLink'));
    var logInMenuLink = element(by.id('logInMenuLink'));
    var logOutMenuLink = element(by.id('logOutMenuLink'));

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

    it('should NOT log in user whith incorrect username', function() {
        logOutMenuLink.click();

        var login_form = element(by.id('login'));
        var username = element(by.model('user.username'));
        var password = element(by.model('user.password'));
        var error_msg = browser.findElement(by.className('error'));

        username.clear();
        password.clear();

        username.sendKeys('incorrect_username');
        password.sendKeys('testusere2e123456');

        login_form.submit();

        expect(browser.getCurrentUrl()).toBe('http://localhost:8081/#/login');
        expect(error_msg.getText()).toBe('Incorrect username.');
    }); 

    it('should NOT log in user whith incorrect password', function() {
        var login_form = element(by.id('login'));
        var username = element(by.model('user.username'));
        var password = element(by.model('user.password'));
        var error_msg = browser.findElement(by.className('error'));

        username.clear();
        password.clear();

        username.sendKeys('testuser_e2e');
        password.sendKeys('incorrect_password');

        login_form.submit();

        expect(browser.getCurrentUrl()).toBe('http://localhost:8081/#/login');
        expect(error_msg.getText()).toBe('Incorrect password.');
    }); 

});

describe('TODOlist', function() {
    var registerMenuLink = element(by.id('registerMenuLink'));
    var logInMenuLink = element(by.id('logInMenuLink'));
    var logOutMenuLink = element(by.id('logOutMenuLink'));

    it('should have user logged in', function() {
        browser.navigate().refresh();
        //Log In user
        var login_form = element(by.id('login'));
        var username = element(by.model('user.username'));
        var password = element(by.model('user.password'));

        username.sendKeys('testuser_e2e');
        password.sendKeys('testusere2e123456');

        login_form.submit();

        expect(browser.getCurrentUrl())
            .toBe('http://localhost:8081/#/todolist');
    });   

    it('should add new project #1', function () {             
        browser.sleep(500);

        browser.actions().
            mouseMove( element(by.id('btnAddTODO')) ).
            click().
            perform();
        
        browser.sleep(500); //wait for modal window

        element(by.model('$parent.formDataProject.name')).sendKeys('Project 1').submit();

        expect(element.all(by.repeater('project in project')).count()).toEqual(1);
    }); 

    it('should add 7 new tasks to project #1', function () { 
        for (var i = 1; i < 8; i++) {
            element(by.model('formDataTask[project.id].name')).sendKeys('Task '+ i)
            .then(function(){
                element(by.name('AddTask')).submit();
            });             
        }
        expect(element.all(by.repeater('task in tasks')).count()).toEqual(7);
    });  

    it('should edit project #1', function () {
        browser.actions().
            mouseMove( element(by.id('Project')) ).
            mouseMove( element(by.id('editProject')) ).
            click().
            perform();
        
        browser.sleep(500); //wait for modal window

        element(by.model('$parent.editedProject.name')).sendKeys(' - Renamed').submit();

        expect(element(by.id('Project')).getText()).toEqual('Project 1 - Renamed');
    });  

    it('should mark task #1 as completed', function () {
        browser.sleep(500);

        element.all(by.css('.ui.checkbox')).first().click().then(function(){
            expect(element.all(by.css('.completed')).count()).toEqual(1);
        });
    });  

    it('should increase priority of task #2 to 3', function () {
        browser.sleep(500);

        browser.actions().
            mouseMove( element.all(by.id('Task-buttons')).first() ).
            mouseMove( element.all(by.css('.caret.up.link.icon')).first() ).
            click().
            click().
            click().
            mouseMove( element.all(by.id('Project')).first() ).
            perform();

        expect(element.all(by.css('.ui.mini.horizontal.orange.label')).first().getText()).toEqual('3');    
    });
    
    it('should decrease priority of task #2 to 2', function () {
        browser.sleep(500);

        browser.actions().
            mouseMove( element.all(by.id('Task-buttons')).first() ).
            mouseMove( element.all(by.css('.caret.down.link.icon')).first() ).
            click().
            mouseMove( element.all(by.id('Project')).first() ).
            perform();

        expect(element.all(by.css('.ui.mini.horizontal.orange.label')).first().getText()).toEqual('2');    
    });

    it('should remame task #2', function () {
        browser.sleep(500);

        browser.actions().
            mouseMove( element.all(by.id('Task-buttons')).first() ).
            mouseMove( element.all(by.id('editTask')).first() ).
            click().
            perform();

        browser.sleep(500);  //wait for modal window

        element(by.model('$parent.editedTask.name')).sendKeys(' - Renamed').submit();

        expect(element.all(by.id('TaskName')).first().getText()).toEqual('Task 2 - Renamed');
    });

    it('should set deadline to task #2', function () {
        browser.sleep(500);

        browser.actions().
            mouseMove( element.all(by.id('Task-buttons')).first() ).
            mouseMove( element.all(by.id('editTask')).first() ).
            click().
            perform();

        browser.sleep(1000);  //wait for modal window

        element.all(by.model('$parent.editedTask.enableDeadlineInput')).first().click()
        .then(function(){
            element.all(by.name('taskDeadlineDate')).first().sendKeys('01.03.2018')
        })
        .then(function(){
            element.all(by.name('taskDeadlineTime')).first().sendKeys('00:30').submit()
        });

        expect(element.all(by.id('Deadline')).first().getText()).toEqual('2018 Mar 1, 0:30');
    });

    it('should remove deadline from task #2', function () {
        browser.sleep(500);

        browser.actions().
            mouseMove( element.all(by.id('Task-buttons')).first() ).
            mouseMove( element.all(by.id('editTask')).first() ).
            click().
            perform();

        browser.sleep(1000); //wait for modal window

        element.all(by.css('.ui.orange.fluid.button')).first().click().submit();

        expect(element.all(by.id('Deadline')).first().isDisplayed()).toBe(false);
    });

    it('should set priority of task #2 to 7 in EditTask dialog', function () {
        browser.sleep(500);

        browser.actions().
            mouseMove( element.all(by.id('Task-buttons')).first() ).
            mouseMove( element.all(by.id('editTask')).first() ).
            click().
            perform();

        browser.sleep(500); //wait for modal window

        element(by.model('$parent.editedTask.priority')).clear().sendKeys('7').submit();

        expect(element.all(by.css('.ui.mini.horizontal.orange.label')).first().getText()).toEqual('7');
    });

    it('should delete task #2', function () {
        browser.sleep(500);

        browser.actions().
            mouseMove( element.all(by.id('Task-buttons')).first() ).
            mouseMove( element.all(by.id('delTask')).first() ).
            click().
            perform();

        browser.sleep(500);

        expect(element.all(by.repeater('task in tasks')).count()).toEqual(6);
    });

    it('should delete project #1', function () {
        browser.sleep(500);

        browser.actions().
            mouseMove( element.all(by.id('Project')).first() ).
            mouseMove( element.all(by.id('delProject')).first() ).
            click().
            perform();

        browser.sleep(1000);

        expect(element.all(by.repeater('project in project')).count()).toEqual(0);
    });

});