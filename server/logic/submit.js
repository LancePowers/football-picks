"use strict";
var newWeek = require('./ranking').newWeek;
var webdriver = require('selenium-webdriver');
var browser = new webdriver.Builder().usingServer().withCapabilities({
    'browserName': 'chrome'
}).build();

function selectTeams(inputs) {
    browser.executeScript("window.scrollBy(0,500)", "");
    for (var i = 0; i < newWeek.games.length; i++) {
        var index = newWeek.games[i].inputIndex;
        inputs[index].click();
    }
}

function addWeights(selections) {
    console.log(selections)
    for (var i = 0; i < selections.length; i++) {
        var weight = newWeek.games[i].weight
        console.log(weight)
        selections[i].sendKeys(weight);
    }
    browser.findElement(webdriver.By.xpath('/html/body/table[2]/tbody/tr/td/table[2]/tbody/tr/td[1]/font/form/table[4]/tbody/tr/td[1]/fieldset/div/a[1]')).click();
}

function closeBrowser() {
    browser.quit();
}

function navigate() {
    browser.get('https://www.poolhost.com');
    browser.findElement(webdriver.By.name('Username')).sendKeys('theshuff');
    browser.findElement(webdriver.By.name('Password')).sendKeys('dr2al56');
    browser.findElement(webdriver.By.id("login_button")).click();
    browser.findElement(webdriver.By.xpath('//*[@id="nav-one"]/li[2]/a')).click();
    browser.findElement(webdriver.By.xpath('/html/body/table[2]/tbody/tr/td/table[2]/tbody/tr/td[1]/div/div[1]/div[1]/div[2]/a[3]')).click();
    browser.findElement(webdriver.By.xpath('//*[@id="nav-pool"]/li[3]')).click();
    browser.findElement(webdriver.By.xpath('//*[@id="nav-pool"]/li[3]/ul/li[2]')).click();
}

module.exports = {
    navigate: navigate
}





////// *** view Standings *** //
//browser.findElement(webdriver.By.xpath('//*[@id="nav-pool"]/li[3]')).click();
//browser.findElement(webdriver.By.xpath('//*[@id="nav-pool"]/li[3]/ul/li[1]/a')).click();
//browser.executeScript("window.scrollBy(0,300)", "");

// * * * make Picks * * * //
//browser.findElement(webdriver.By.xpath('//*[@id= "nav-pool"] / li[2] / ul / li[1] / a ')).click();
//browser.findElements(webdriver.By.tagName('input')).then(selectTeams);
//browser.findElements(webdriver.By.tagName('select')).then(addWeights);