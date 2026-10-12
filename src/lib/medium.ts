export const MEDIUM_PROFILE_URL = 'https://medium.com/@dityath';
const MEDIUM_RSS_URL = 'https://medium.com/feed/@dityath';

export interface MediumPost {
  title: string;
  url: string;
  excerpt: string;
  publishedAt: Date | null;
}

export interface MediumFeedResult {
  posts: MediumPost[];
  failed: boolean;
}

interface XmlElement {
  name: string;
  attributes: Record<string, string>;
  children: Array<XmlElement | string>;
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

function isCodePoint(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 0x10ffff;
}

function decodeEntities(value: string): string {
  return value.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, token: string) => {
    const normalized = token.toLowerCase();
    if (normalized.startsWith('#x')) {
      const codePoint = Number.parseInt(normalized.slice(2), 16);
      return isCodePoint(codePoint) ? String.fromCodePoint(codePoint) : entity;
    }
    if (normalized.startsWith('#')) {
      const codePoint = Number.parseInt(normalized.slice(1), 10);
      return isCodePoint(codePoint) ? String.fromCodePoint(codePoint) : entity;
    }
    return NAMED_ENTITIES[normalized] ?? entity;
  });
}

function tagEnd(xml: string, start: number): number {
  let quote = '';
  for (let index = start; index < xml.length; index += 1) {
    const character = xml[index] ?? '';
    if (quote) {
      if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '>') {
      return index;
    }
  }
  return -1;
}

function parseAttributes(source: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  for (const match of source.matchAll(pattern)) {
    const name = match[1]?.toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? '';
    if (name) attributes[name] = decodeEntities(value);
  }
  return attributes;
}

/**
 * Small, dependency-free XML reader for the limited feed shape used here. It
 * handles quoted attributes, comments, CDATA, declarations, nested elements,
 * and XML entities without treating feed HTML as page markup.
 */
function parseXml(xml: string): XmlElement {
  const root: XmlElement = { name: '#document', attributes: {}, children: [] };
  const stack: XmlElement[] = [root];
  let cursor = 0;

  const appendText = (text: string): void => {
    if (!text) return;
    const parent = stack[stack.length - 1];
    if (parent) parent.children.push(decodeEntities(text));
  };

  while (cursor < xml.length) {
    const tagStart = xml.indexOf('<', cursor);
    if (tagStart === -1) {
      appendText(xml.slice(cursor));
      break;
    }
    appendText(xml.slice(cursor, tagStart));

    if (xml.startsWith('<!--', tagStart)) {
      const end = xml.indexOf('-->', tagStart + 4);
      cursor = end === -1 ? xml.length : end + 3;
      continue;
    }
    if (xml.startsWith('<![CDATA[', tagStart)) {
      const end = xml.indexOf(']]>', tagStart + 9);
      const raw = xml.slice(tagStart + 9, end === -1 ? xml.length : end);
      const parent = stack[stack.length - 1];
      if (raw && parent) parent.children.push({ name: '#cdata', attributes: {}, children: [raw] });
      cursor = end === -1 ? xml.length : end + 3;
      continue;
    }
    if (xml.startsWith('<?', tagStart)) {
      const end = xml.indexOf('?>', tagStart + 2);
      cursor = end === -1 ? xml.length : end + 2;
      continue;
    }
    if (xml.startsWith('<!', tagStart)) {
      const end = tagEnd(xml, tagStart + 2);
      cursor = end === -1 ? xml.length : end + 1;
      continue;
    }

    const end = tagEnd(xml, tagStart + 1);
    if (end === -1) break;
    const rawTag = xml.slice(tagStart + 1, end).trim();
    cursor = end + 1;

    if (rawTag.startsWith('/')) {
      const closingName = rawTag.slice(1).trim().toLowerCase();
      for (let index = stack.length - 1; index > 0; index -= 1) {
        if (stack[index]?.name === closingName) {
          stack.length = index;
          break;
        }
      }
      continue;
    }

    const nameMatch = rawTag.match(/^([^\s/>]+)/);
    const name = nameMatch?.[1]?.toLowerCase();
    if (!name) continue;
    const parent = stack[stack.length - 1];
    if (!parent) continue;
    const element: XmlElement = {
      name,
      attributes: parseAttributes(rawTag.slice(name.length)),
      children: [],
    };
    parent.children.push(element);
    if (!/\/\s*$/.test(rawTag)) stack.push(element);
  }

  return root;
}

function child(element: XmlElement, names: string[]): XmlElement | undefined {
  return element.children.find(
    (node): node is XmlElement => typeof node !== 'string' && names.includes(node.name),
  );
}

function children(element: XmlElement, name: string): XmlElement[] {
  return element.children.filter(
    (node): node is XmlElement => typeof node !== 'string' && node.name === name,
  );
}

function textContent(element: XmlElement | undefined): string {
  if (!element) return '';
  return element.children
    .map((node) => (typeof node === 'string' ? node : textContent(node)))
    .join('')
    .trim();
}

function stripHtml(value: string): string {
  const stripped = value
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ');
  return decodeEntities(stripped);
}

/**
 * Whether an element's content is HTML (tags to strip, entities to decode once
 * more) or plain text. Atom's `summary` / `content` declare it with `type`
 * (default `text`); RSS `description` and `content:encoded` carry HTML.
 */
function isHtmlBody(element: XmlElement): boolean {
  if (element.name !== 'summary' && element.name !== 'content') return true;
  const type = element.attributes.type?.trim().toLowerCase() ?? 'text';
  return type === 'html' || type === 'text/html';
}

/**
 * Plain reading text of an element, with each encoding layer decoded exactly
 * once. Text nodes were XML-decoded by the parser; CDATA is kept raw. Only in
 * HTML bodies is the result then treated as markup: tags stripped and HTML
 * entities decoded. Plain-text content (titles, Atom `type="text"`) is kept
 * literally, so "&amp;" written in an article stays "&amp;".
 */
function plainText(element: XmlElement | undefined, html = false): string {
  if (!element) return '';
  return element.children
    .map((node) => {
      if (typeof node === 'string') return html ? stripHtml(node) : node;
      if (node.name === '#cdata') {
        const raw = node.children.join('');
        return html ? stripHtml(raw) : raw;
      }
      return plainText(node, html);
    })
    .join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function excerpt(value: string, maxLength = 220): string {
  if (value.length <= maxLength) return value;
  const boundary = value.lastIndexOf(' ', maxLength - 1);
  return `${value.slice(0, boundary > 0 ? boundary : maxLength).trim()}…`;
}

function normalizeUrl(value: string): string {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_/i.test(key) || key === 'source') url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return '';
  }
}

function toDate(value: string): Date | null {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readEntries(document: XmlElement): MediumPost[] {
  const rss = child(document, ['rss', 'rdf:rdf']);
  const channel = rss ? child(rss, ['channel']) : child(document, ['channel']);
  const entries = channel
    ? children(channel, 'item')
    : children(child(document, ['feed']) ?? document, 'entry');

  return entries.flatMap((entry) => {
    const title = plainText(child(entry, ['title']));
    const linkNode = children(entry, 'link').find((node) => {
      const rel = node.attributes.rel?.trim().toLowerCase();
      return !rel || rel === 'alternate';
    });
    const link = normalizeUrl(
      linkNode?.attributes.href || textContent(linkNode) || textContent(child(entry, ['guid'])),
    );
    const bodyNode = child(entry, ['description', 'content:encoded', 'summary', 'content']);
    const body = plainText(bodyNode, bodyNode ? isHtmlBody(bodyNode) : false);
    const date = textContent(child(entry, ['pubdate', 'published', 'updated']));
    if (!title || !link) return [];
    return [{ title, url: link, excerpt: excerpt(body), publishedAt: toDate(date) }];
  });
}

export function parseMediumFeed(xml: string): MediumPost[] {
  const posts = readEntries(parseXml(xml));
  return posts
    .filter((post, index) => posts.findIndex((item) => item.url === post.url) === index)
    .slice(0, 12);
}

async function fetchFeed(): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(MEDIUM_RSS_URL, {
      headers: { Accept: 'application/rss+xml, application/xml, text/xml;q=0.9' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Fetches the feed at build time, with three attempts against Medium's
 * occasional transient failures. If all fail the page renders a plain link to
 * the Medium profile. Set `MEDIUM_REQUIRED=1` to fail the build instead, so a
 * deploy never ships the fallback unnoticed.
 */
export async function getMediumPosts(): Promise<MediumFeedResult> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return { posts: parseMediumFeed(await fetchFeed()), failed: false };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
    }
  }
  const reason = lastError instanceof Error ? lastError.message : 'unknown error';
  if (process.env.MEDIUM_REQUIRED === '1') {
    throw new Error(`[medium] RSS feed unavailable after 3 attempts (${reason}).`);
  }
  console.warn(
    `[medium] Could not load RSS feed after 3 attempts (${reason}). Rendering the profile fallback instead.`,
  );
  return { posts: [], failed: true };
}
