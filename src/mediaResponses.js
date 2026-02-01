const fs = require('fs');
const path = require('path');

function getChunk(response, start, end, total, type){
    const chunksize = (end - start) + 1;

        response.writeHead(206, {
            'Content-Range' : `bytes ${start}-${end}/${total}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': type,
        });
}

function openFileStream(response, file, start, end){
    const stream = fs.createReadStream(file, {start, end});

        stream.on('open', () => {
            stream.pipe(response);
        });
        stream.on('error', (StreamErr) => {
            response.end(StreamErr);
        });
        return stream;
}

function loadFile(request, response, filename, type){
    const file = path.resolve(__dirname, filename);

    fs.stat(file, (err, stats) => {
        if (err) {
            if (err.code === 'ENOENT') {
                response.writeHead(404);
            }
            return response.end();
        }

        let { range } = request.headers;
        if (!range) {
            range = 'bytes=0-';
        }

        const positions = range.replace(/bytes=/, '').split('-');
        let start = parseInt(positions[0], 10);

        const total = stats.size;
        const end = positions[1]
            ? parseInt(positions[1], 10)
            : total - 1;

        if (start > end) {
            start = end - 1;
        }

        getChunk(response, start, end, total, type);
        openFileStream(response, file, start, end);
    });
}
const getParty = (request, response) => {
    loadFile(request, response,'../client/party.mp4', 'video/mp4');
};
const getBirdy = (request, response) => {
    loadFile(request, response, '../client/bird.mp4', 'video/mp4');
};

const getBling = (request, response) => {
    loadFile(request, response, '../client/bling.mp3', 'audio/mpeg');
};

module.exports.getParty = getParty;
module.exports.getBirdy = getBirdy;
module.exports.getBling = getBling;