export default function TestPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>✅ 服务器运行正常！</h1>
      <p>当前时间: {new Date().toLocaleString('zh-CN')}</p>
      <p>环境: {process.env.NODE_ENV}</p>
    </div>
  )
}
