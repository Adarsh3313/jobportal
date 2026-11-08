'use strict';
// Minimal multipart/form-data parser (used for resume upload)
const { HttpError } = require('./http');

function parseMultipart(buf, contentType) {
  const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || ''); if (!m) throw new HttpError(400, 'Expected multipart/form-data');
  const boundary = Buffer.from('--' + (m[1] || m[2]));
  const fields = {}; let file = null; let pos = buf.indexOf(boundary);
  while (pos !== -1) {
    const start = pos + boundary.length; if (buf.slice(start, start + 2).toString() === '--') break;
    const next = buf.indexOf(boundary, start); if (next === -1) break;
    const part = buf.slice(start + 2, next - 2); // strip CRLF
    const he = part.indexOf('\r\n\r\n'); if (he !== -1) {
      const headers = part.slice(0, he).toString('utf8'); const content = part.slice(he + 4);
      const name = /name="([^"]*)"/.exec(headers)?.[1]; const fn = /filename="([^"]*)"/.exec(headers)?.[1];
      if (fn !== undefined && name) file = { name, filename: fn, mime: /Content-Type:\s*([^\r\n]+)/i.exec(headers)?.[1] || '', data: content };
      else if (name) fields[name] = content.toString('utf8');
    }
    pos = next;
  }
  return { fields, file };
}
const RESUME_TYPES = { '.pdf': 'application/pdf', '.doc': 'application/msword', '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };

module.exports = { parseMultipart, RESUME_TYPES };
