const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const IP_LOG_FILE = path.join(__dirname, 'ip_addresses.txt');
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

function getFormattedTimestamp() {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
}

function handleVisitorLogging(clientIp) {
    let logContent = '';
    if (fs.existsSync(IP_LOG_FILE)) {
        logContent = fs.readFileSync(IP_LOG_FILE, 'utf-8');
    }

    const lines = logContent.split('\n');
    let shouldLog = true;
    const nowMs = Date.now();

    for (const line of lines) {
        if (!line || line.startsWith('#')) continue;
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 2) {
            const loggedIp = parts[0];
            const loggedTimeStr = parts[1];
            const loggedMs = new Date(loggedTimeStr).getTime();

            if (loggedIp === clientIp && !isNaN(loggedMs)) {
                if (nowMs - loggedMs < TWENTY_FOUR_HOURS_MS) {
                    shouldLog = false; // Already logged within 24h
                    break;
                }
            }
        }
    }

    if (shouldLog) {
        const timestamp = getFormattedTimestamp();
        const logLine = `${clientIp} | ${timestamp}\n`;
        fs.appendFileSync(IP_LOG_FILE, logLine);
    }

    const loggedIPs = new Set();
    const validLines = fs.readFileSync(IP_LOG_FILE, 'utf-8').split('\n');
    validLines.forEach(l => {
        if (l && !l.startsWith('#')) {
            const ip = l.split('|')[0].trim();
            if (ip) loggedIPs.add(ip);
        }
    });

    return Math.max(1, loggedIPs.size);
}

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const clientIp = rawIp.split(',')[0].trim();

    if (req.url === '/api/visit' || req.url.startsWith('/api/visit')) {
        const uniqueViews = handleVisitorLogging(clientIp);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ success: true, count: uniqueViews, ip: clientIp }));
    }

    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end('File not found');
        }
        res.writeHead(200);
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log(`Portfolio server running on port ${PORT}`);
});
