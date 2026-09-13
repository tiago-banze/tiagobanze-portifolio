// Conversor Markdown → HTML simples, escrito à mão (sem biblioteca externa).
// Cobre o que os artigos do blog usam: títulos, negrito/itálico, links,
// código (inline e blocos), listas, citações e tabelas básicas.

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineMd(text) {
  let t = escapeHtml(text);
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  return t;
}

function markdownToHtml(md) {
  if (!md) return '';
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let i = 0;
  let inList = null; // 'ul' | 'ol'
  let inTable = false;

  function closeList() {
    if (inList) { html += `</${inList}>`; inList = null; }
  }

  while (i < lines.length) {
    const line = lines[i];

    // Blocos de código
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3);
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) { codeLines.push(lines[i]); i++; }
      i++;
      closeList();
      html += `<pre><code class="language-${escapeHtml(lang)}">${escapeHtml(codeLines.join('\n'))}</code></pre>`;
      continue;
    }

    // Cabeçalhos
    const h = line.match(/^(#{2,3})\s+(.*)$/);
    if (h) {
      closeList();
      const level = h[1].length;
      html += `<h${level}>${inlineMd(h[2])}</h${level}>`;
      i++; continue;
    }

    // Citação
    if (line.trim().startsWith('>')) {
      closeList();
      const quoteLines = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      html += `<blockquote>${inlineMd(quoteLines.join(' '))}</blockquote>`;
      continue;
    }

    // Tabelas (formato GFM simples)
    if (line.trim().startsWith('|') && lines[i + 1] && /^\s*\|?[\s:-]+\|/.test(lines[i + 1])) {
      const headerCells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(lines[i].trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
        i++;
      }
      closeList();
      html += '<table><thead><tr>' + headerCells.map((c) => `<th>${inlineMd(c)}</th>`).join('') + '</tr></thead><tbody>';
      rows.forEach((r) => { html += '<tr>' + r.map((c) => `<td>${inlineMd(c)}</td>`).join('') + '</tr>'; });
      html += '</tbody></table>';
      continue;
    }

    // Listas
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    if (ol || ul) {
      const tag = ol ? 'ol' : 'ul';
      if (inList !== tag) { closeList(); html += `<${tag}>`; inList = tag; }
      html += `<li>${inlineMd((ol || ul)[1])}</li>`;
      i++; continue;
    }

    closeList();

    // Linha vazia
    if (!line.trim()) { i++; continue; }

    // Parágrafo (junta linhas seguidas sem separação até linha vazia)
    const paraLines = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|```|>|\s*[-*]\s|\s*\d+\.\s|\|)/.test(lines[i])) {
      paraLines.push(lines[i]); i++;
    }
    html += `<p>${inlineMd(paraLines.join(' '))}</p>`;
  }
  closeList();
  return html;
}
