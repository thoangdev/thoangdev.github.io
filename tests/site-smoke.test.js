'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function getContentType(filePath) {
    if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
    if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
    if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
    if (filePath.endsWith('.xml')) return 'application/xml; charset=utf-8';
    if (filePath.endsWith('.txt')) return 'text/plain; charset=utf-8';
    return 'application/octet-stream';
}

async function resolveFilePath(requestPath) {
    const relativePath = requestPath === '/' ? '/index.html' : requestPath;
    const normalized = path.resolve(repoRoot, '.' + decodeURIComponent(relativePath));

    if (!normalized.startsWith(repoRoot)) {
        return null;
    }

    const stats = await fs.stat(normalized).catch(function () {
        return null;
    });

    if (!stats) {
        return null;
    }

    if (stats.isDirectory()) {
        const indexPath = path.join(normalized, 'index.html');
        const indexStats = await fs.stat(indexPath).catch(function () {
            return null;
        });
        return indexStats ? indexPath : null;
    }

    return normalized;
}

function startStaticServer() {
    return new Promise(function (resolve) {
        const server = http.createServer(async function (request, response) {
            const url = new URL(request.url, 'http://127.0.0.1');
            const filePath = await resolveFilePath(url.pathname);

            if (!filePath) {
                response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
                response.end('Not found');
                return;
            }

            const body = await fs.readFile(filePath);
            response.writeHead(200, { 'content-type': getContentType(filePath) });
            response.end(body);
        });

        server.listen(0, '127.0.0.1', function () {
            const address = server.address();
            resolve({
                close: function () {
                    return new Promise(function (closeResolve) {
                        server.close(closeResolve);
                    });
                },
                origin: 'http://127.0.0.1:' + address.port
            });
        });
    });
}

let staticServer;

test.before(async function () {
    staticServer = await startStaticServer();
});

test.after(async function () {
    if (staticServer) {
        await staticServer.close();
    }
});

test('homepage smoke check serves core interactive elements and scripts', async function () {
    const response = await fetch(staticServer.origin + '/');
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(html, /<form id="contactForm"/);
    assert.match(html, /id="cf-success"/);
    assert.match(html, /id="moreDrawer"/);
    assert.match(html, /href="#contact-form" class="drawer-link"/);
    assert.match(html, /src="js\/scripts-optimized\.js"/);
    assert.match(html, /src="js\/contact-form\.js"/);
    assert.match(html, /action="https:\/\/formspree\.io\/f\/xnjljodd"/);
    assert.match(html, /<noscript><link rel="stylesheet" href="https:\/\/cdn\.jsdelivr\.net\/npm\/bootstrap@5\.2\.3\/dist\/css\/bootstrap\.min\.css"/);
});

test('pdf generator smoke check serves the resume launcher and module script', async function () {
    const response = await fetch(staticServer.origin + '/assets/pdf-generator.html');
    const html = await response.text();

    assert.equal(response.status, 200);
    assert.match(html, /id="openResumeBtn"/);
    assert.match(html, /<iframe src="resume-pdf\.html"/);
    assert.match(html, /src="\.\.\/js\/pdf-generator\.js"/);
});

test('resume pdf and 404 pages serve their direct-entry scripts and landmarks', async function () {
    const resumeResponse = await fetch(staticServer.origin + '/assets/resume-pdf.html?print=true');
    const resumeHtml = await resumeResponse.text();
    const notFoundResponse = await fetch(staticServer.origin + '/404.html');
    const notFoundHtml = await notFoundResponse.text();

    assert.equal(resumeResponse.status, 200);
    assert.match(resumeHtml, /src="\.\.\/js\/resume-print\.js"/);
    assert.equal(notFoundResponse.status, 200);
    assert.match(notFoundHtml, /<main class="container" id="main-content">/);
    assert.match(notFoundHtml, /href="assets\/favicon\.ico"/);
});

test('script smoke check serves the extracted runtime modules', async function () {
    const urls = [
        '/js/scripts-optimized.js',
        '/js/contact-form.js',
        '/js/pdf-generator.js',
        '/js/resume-print.js'
    ];

    await Promise.all(urls.map(async function (url) {
        const response = await fetch(staticServer.origin + url);
        const body = await response.text();

        assert.equal(response.status, 200);
        assert.ok(body.length > 50);
    }));
});