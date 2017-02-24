describe('RG TODO App', function() {
    var registerMenuLink = element(by.id('registerMenuLink'));
    var logInMenuLink = element(by.id('logInMenuLink'));
    var logOutMenuLink = element(by.id('logOutMenuLink'));
    var secondNumber = element(by.model('second'));
    var goButton = element(by.id('gobutton'));
    var latestResult = element(by.binding('latest'));

    beforeEach(function() {
        browser.get('https://rg-todo-app1.herokuapp.com/');
    });

    it('should have a title', function() {
        expect(browser.getTitle()).toEqual('TODO');
    });

    it('should have a url .../login', function() {
        expect(browser.getCurrentUrl())
            .toBe('https://rg-todo-app1.herokuapp.com/#/login');
    });

    it('should go to `register` view', function() {

        registerMenuLink.click();
        expect(browser.getCurrentUrl())
            .toBe('https://rg-todo-app1.herokuapp.com/#/register');
    });

});