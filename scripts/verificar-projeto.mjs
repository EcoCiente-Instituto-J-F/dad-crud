import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const problemas = [];
function arquivos(pasta) {
  return fs.readdirSync(pasta, { withFileTypes: true }).flatMap((item) => {
    const caminho = path.join(pasta, item.name).split(path.sep).join('/');
    return item.isDirectory() ? arquivos(caminho) : [caminho];
  });
}
const fontes = arquivos('src');
for (const caminho of fontes) {
  if (/\.jsx?$/.test(caminho)) problemas.push(`${caminho}: JavaScript dentro de src.`);
  if (!/\.tsx?$/.test(caminho)) continue;
  const texto = fs.readFileSync(caminho, 'utf8');
  const fonte = ts.createSourceFile(caminho, texto, ts.ScriptTarget.Latest, true);
  function visitar(no) {
    if (no.kind === ts.SyntaxKind.AnyKeyword) problemas.push(`${caminho}: tipo any.`);
    if (ts.isInterfaceDeclaration(no) && !caminho.startsWith('src/types/') && !caminho.endsWith('.d.ts')) problemas.push(`${caminho}: interface fora de src/types.`);
    if (ts.isCallExpression(no)) {
      if ((no.expression.getText(fonte) === 'fetch' || no.expression.getText(fonte) === 'window.fetch') && !caminho.startsWith('src/services/')) problemas.push(`${caminho}: fetch fora de services.`);
      if (no.expression.getText(fonte) === 'useEffect' && (!no.arguments[1] || !ts.isArrayLiteralExpression(no.arguments[1]))) problemas.push(`${caminho}: useEffect sem dependências explícitas.`);
    }
    if (ts.isBinaryExpression(no) && no.left.getText(fonte) === 'window.location.href') problemas.push(`${caminho}: navegação por window.location.href.`);
    if (ts.isJsxAttribute(no) && no.name.getText(fonte) === 'dangerouslySetInnerHTML') problemas.push(`${caminho}: HTML dinâmico não permitido.`);
    if ((caminho.startsWith('src/components/') || caminho.startsWith('src/pages/')) && ts.isImportDeclaration(no) && /\/services\//.test(no.moduleSpecifier.text)) problemas.push(`${caminho}: importe um hook em vez de um service.`);
    ts.forEachChild(no, visitar);
  }
  visitar(fonte);
  if ((caminho.startsWith('src/components/') || caminho.startsWith('src/pages/')) && caminho.endsWith('.tsx') && path.basename(caminho) !== 'index.tsx') problemas.push(`${caminho}: componente/página sem index.tsx.`);
}
const app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('path="*"')) problemas.push('App: rota curinga ausente.');
if (!app.includes('lazy(') || !app.includes('<Suspense')) problemas.push('App: lazy/Suspense ausentes.');
if (!fs.existsSync('public/login-fundo.png')) problemas.push('Imagem de login ausente.');
if (problemas.length) {
  for (const problema of problemas) console.error(problema);
  process.exitCode = 1;
} else console.log(`Estrutura verificada em ${fontes.length} arquivos. Acessibilidade, publicação, histórico e APIs ao vivo exigem verificação separada.`);
