import fs from 'node:fs'
import path from 'node:path'

import JSZip from 'jszip'

async function makeValidDocx(outPath: string) {
  const zip = new JSZip()
  zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`)
  zip.folder('_rels')?.file('.rels', `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="/word/document.xml"/>
</Relationships>`)
  zip.folder('word')?.file('document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Minimal DOCX</w:t></w:r></w:p>
  </w:body>
</w:document>`)
  const buf = await zip.generateAsync({ type: 'nodebuffer' })
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, buf)
}

function makeTextFile(outPath: string, content: string) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, content)
}

async function globalSetup() {
  const base = path.join(process.cwd(), 'e2e', 'samples')
  await makeValidDocx(path.join(base, 'min.docx'))
  // 简易 EPS 与 AI（AI 兼容 EPS 语法，便于 Inkscape 读取）
  makeTextFile(path.join(base, 'min.eps'), '%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 10 10\nnewpath 0 0 moveto 10 0 lineto 10 10 lineto 0 10 lineto closepath stroke')
  makeTextFile(path.join(base, 'min.ai'), '%!PS-Adobe-3.0\n%%Creator: Adobe Illustrator\n%%AI8_CreateOutline')
}

export default globalSetup
