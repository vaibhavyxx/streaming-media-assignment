const fs = require('fs');
const { request } = require('http');
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const second = fs.readFileSync(`${__dirname}/../client/client2.html`);
const third = fs.readFileSync(`${__dirname}/../client/client3.html`);

function loadPage(response, pageType){
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(pageType);
    response.end();
}

const getIndex = (request, response) => {
    loadPage(response, index);
};

const getSecond = (request, response) => {
    loadPage(response, second);
};

const getThird = (request, response) => {
    loadPage(response, third);
};

module.exports.getIndex = getIndex;
module.exports.getSecond = getSecond;
module.exports.getThird = getThird;