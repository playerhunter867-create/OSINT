(() => {
  const configured = (localStorage.getItem('osint_api') || '').trim().replace(/\/$/, '');
  const sameOrigin = location.protocol.startsWith('http') ? location.origin : '';
  const apiBases = [...new Set([configured, sameOrigin].filter(Boolean))];

  async function fetchJson(url, timeout = 15000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
      const text = await response.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (_) {}
      if (!response.ok) {
        const detail = data && (data.detail || data.message);
        throw new Error(detail || `HTTP ${response.status}`);
      }
      if (data === null) throw new Error('Server did not return JSON');
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  async function api(path, timeout = 20000) {
    let lastError = new Error('No API endpoint is configured.');
    for (const base of apiBases) {
      try { return await fetchJson(`${base}${path}`, timeout); }
      catch (error) { lastError = error; }
    }
    throw lastError;
  }

  async function catalog() {
    try { return await api('/api/catalog', 12000); }
    catch (_) {
      const tree = await fetchJson('osint-framework/public/arf.json', 20000);
      return tree;
    }
  }

  async function publicUsernameLinks(username, limit = 120) {
    const data = await fetchJson('sherlock-data.json', 12000);
    const items = [];
    for (const [site, info] of Object.entries(data)) {
      if (!info || typeof info !== 'object' || !info.url || typeof info.url !== 'string') continue;
      if (info.regexCheck) {
        try { if (!(new RegExp(info.regexCheck)).test(username)) continue; } catch (_) {}
      }
      const url = info.url.replace(/\{\}/g, encodeURIComponent(username));
      if (!/^https?:\/\//i.test(url)) continue;
      items.push({ site, url });
      if (items.length >= limit) break;
    }
    return items;
  }

  window.OSINTHub = { api, catalog, publicUsernameLinks, apiConfigured: !!configured };
})();
