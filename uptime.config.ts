import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  // 状态页标题
  title: "MoeFurina's 状态页面",
  // 状态页头部显示的链接，可设置 `highlight` 为 `true` 来高亮显示
  links: [
    { link: 'https://github.com/moefurina', label: 'GitHub' },
    { link: 'https://www.focalors.ltd/', label: 'Blog' },
    { link: 'mailto:me@focalors.ltd', label: 'Email Me', highlight: true },
  ],
  // [可选] 监控项分组配置
  // 如果不指定，所有监控项将显示在同一个列表中
  // 如果指定，监控项将按分组显示，未列出的监控项将被隐藏（但仍会被监控）
  group: {
    '🌐 公开服务': ['foo_monitor', 'bar_monitor', 'more monitor ids...'],
    '🔐 私有服务': ['test_tcp_monitor'],
  },
}

const workerConfig: WorkerConfig = {
  // 状态未变化时，KV存储最多每3分钟写入一次
  kvWriteCooldownMinutes: 3,
  // 取消下面行的注释可为状态页和API启用HTTP基础认证，格式为`<用户名>:<密码>`
  // passwordProtection: 'username:password',
  // 在此定义所有监控项
  monitors: [
    // HTTP监控示例
    {
      // `id` 必须唯一，保持相同id可以保留历史记录
      id: 'indexpage',
      // `name` 用于状态页和回调消息
      name: '个人主页',
      // `method` 应为有效的HTTP方法
      method: 'POST',
      // `target` 应为有效的URL
      target: 'https://www.focalors.ltd',
      // [可选] `tooltip` 仅在状态页显示提示信息
      tooltip: '我的个人主页',
      // [可选] `statusPageLink` 仅在状态页提供可点击链接
      statusPageLink: 'https://www.focalors.ltd',
      // [可选] `hideLatencyChart` 设为true可隐藏状态页的延迟图表
      hideLatencyChart: false,
      // [可选] `expectedCodes` 是可接受的HTTP响应码数组，未指定时默认为2xx
      expectedCodes: [200],
      // [可选] `timeout` 超时时间(毫秒)，未指定时默认为10000
      timeout: 10000,
      // [可选] 请求头设置
      headers: {
        'User-Agent': 'Uptimeflare',
        Authorization: 'Bearer YOUR_TOKEN_HERE',
      },
      // [可选] 请求体内容
      body: 'Hello, world!',
      // [可选] 如果指定，响应必须包含该关键词才被视为正常运行
      responseKeyword: 'success',
      // [可选] 如果指定，响应不得包含该关键词才被视为正常运行
      responseForbiddenKeyword: 'bad gateway',
      // [可选] 如果指定，将通过检查代理来检查监控项，主要用于地理位置特定检查
      // 设置前请参考文档 https://github.com/lyc8503/UptimeFlare/wiki/Check-proxy-setup
      // 当前支持 `worker://` 和 `http(s)://` 代理
      checkProxy: 'https://xxx.example.com OR worker://weur',
      // [可选] 如果为true，当指定代理不可用时将回退到本地检查
      checkProxyFallback: true,
    },
    // TCP监控示例
    {
      id: 'SPlayer',
      name: '第三方网易云音乐播放器',
      // TCP监控的 `method` 应为 `TCP_PING`
      method: 'TCP_PING',
      // TCP监控的 `target` 应为 `主机:端口` 格式
      target: '1.2.3.4:22',
      tooltip: 'My production server SSH',
      statusPageLink: 'https://example.com',
      timeout: 5000,
    },
  ],
  notification: {
    // [可选] apprise API服务器URL
    // 如果不指定，将不会发送通知
    appriseApiServer: 'https://apprise.example.com/notify',
    // [可选] apprise的接收者URL，参考 https://github.com/caronc/apprise
    // 如果不指定，将不会发送通知
    recipientUrl: 'tgram://bottoken/ChatID',
    // [可选] 通知消息使用的时区，默认为"Etc/GMT"
    timeZone: 'Asia/Shanghai',
    // [可选] 发送通知前的宽限期(分钟)
    // 只有在监控项连续N次检查失败后才会发送通知
    // 如果不指定，监控失败时将立即发送通知
    gracePeriod: 5,
    // [可选] 跳过指定id监控项的通知
    skipNotificationIds: ['foo_monitor', 'bar_monitor'],
  },
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // 当任何监控项状态变化时调用此回调
      // 在此处编写任意Typescript代码
      // 此回调不受宽限期设置影响，状态变化时将立即调用
      // 如需实现宽限期，需要手动处理
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // 当任何监控项处于故障状态时，每分钟调用一次此回调
      // 在此处编写任意Typescript代码
    },
  },
}

// 可在此定义多个维护计划
// 维护期间，状态页将显示警告信息
// 相关故障通知将被跳过(如有)
// 如果不需要此功能，可留空
// const maintenances: MaintenanceConfig[] = []
const maintenances: MaintenanceConfig[] = [
  {
    // [可选] 受此维护影响的监控项ID
    monitors: ['foo_monitor', 'bar_monitor'],
    // [可选] 未指定时默认为"Scheduled Maintenance"
    title: 'Test Maintenance',
    // 维护描述，将显示在状态页
    body: 'This is a test maintenance, server software upgrade',
    // 维护开始时间，UNIX时间戳或ISO 8601格式
    start: '2025-04-27T00:00:00+08:00',
    // [可选] 维护结束时间，UNIX时间戳或ISO 8601格式
    // 如果不指定，维护将被视为正在进行中
    end: '2025-04-30T00:00:00+08:00',
    // [可选] 状态页维护警告的颜色，默认为"yellow"
    color: 'blue',
  },
]

// 不要忘记导出，否则编译会失败
export { pageConfig, workerConfig, maintenances }
