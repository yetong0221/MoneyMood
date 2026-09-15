import { useState } from "react";

/* ============================================
   我的页面 - 个人设置中心 v2.0
   ============================================ */

interface UserProfile {
  id: string;
  nickname: string;
  avatar: string;
  phone?: string;
  email?: string;
  wechatBound: boolean;
  isLoggedIn: boolean;
}

interface ProfileSettings {
  monthBudget: number;
  saveReminder: boolean;
  dailyReminder: boolean;
  reminderTime: string;
}

type ExportFormat = "csv" | "excel";

export function ProfilePage({ onBack }: { onBack: () => void }) {
  // 用户状态（模拟数据）
  const [user, setUser] = useState<UserProfile>({
    id: "user_001",
    nickname: "叶彤",
    avatar: "🌸",
    phone: "138****1234",
    email: undefined,
    wechatBound: false,
    isLoggedIn: true,
  });

  const [settings, setSettings] = useState<ProfileSettings>({
    monthBudget: 6000,
    saveReminder: true,
    dailyReminder: true,
    reminderTime: "21:00",
  });

  // 弹窗状态
  const [showNicknameEdit, setShowNicknameEdit] = useState(false);
  const [draftNickname, setDraftNickname] = useState(user.nickname);
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);
  const [draftBudget, setDraftBudget] = useState(String(settings.monthBudget));
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  // 导出状态
  const [exportFormat, setExportFormat] = useState<ExportFormat>("excel");
  const [exportRange, setExportRange] = useState("month");
  const [exportOptions, setExportOptions] = useState({
    includeMood: true,
    includePool: true,
    includeNote: true,
  });
  const [exporting, setExporting] = useState(false);

  // 统计数据
  const totalRecords = 128;
  const activeDays = 45;
  const avgMonthlySpend = 4236;
  const saveRate = 28;

  const avatars = ["🌸", "🌷", "🌻", "🍀", "🌙", "⭐", "🐱", "🐶", "🦋", "🌈"];

  // 处理函数
  function handleSaveNickname() {
    if (draftNickname.trim()) {
      setUser({ ...user, nickname: draftNickname.trim() });
      setShowNicknameEdit(false);
    }
  }

  function handleSaveBudget() {
    const budget = Math.round(Number(draftBudget));
    if (!isNaN(budget) && budget > 0) {
      setSettings({ ...settings, monthBudget: budget });
      setShowBudgetEdit(false);
    }
  }

  function handleFeedbackSubmit() {
    if (feedbackText.trim()) {
      setFeedbackSuccess(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackText("");
        setFeedbackSuccess(false);
      }, 1500);
    }
  }

  function handleExport() {
    setExporting(true);
    // 模拟导出过程
    setTimeout(() => {
      setExporting(false);
      setShowExport(false);
      alert(`账单已导出为 ${exportFormat.toUpperCase()} 格式！`);
    }, 1500);
  }

  function handleLogout() {
    if (confirm("确定要退出登录吗？")) {
      setUser({ ...user, isLoggedIn: false });
      setShowAccount(false);
    }
  }

  // 登录状态视图
  if (!user.isLoggedIn) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-8">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[#fff4ee] to-[#ffdce0] text-4xl shadow-md">
          💰
        </div>
        <h2 className="mt-4 text-[18px] font-extrabold text-ink">MoneyMood</h2>
        <p className="mt-1 text-[12px] text-muted">情绪记账 · 轻松理财</p>

        <div className="mt-8 w-full space-y-3">
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(255,140,148,0.35)] active:scale-[0.98]"
          >
            登录 / 注册
          </button>
          <p className="text-center text-[10px] text-muted">
            登录即表示同意《用户协议》和《隐私政策》
          </p>
        </div>

        <div className="mt-8 w-full">
          <p className="mb-3 text-center text-[11px] text-muted">其他登录方式</p>
          <div className="flex justify-center gap-6">
            <button type="button" className="flex flex-col items-center gap-1">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e8f5e9] text-2xl shadow-sm">💬</span>
              <span className="text-[10px] text-muted">微信</span>
            </button>
            <button type="button" className="flex flex-col items-center gap-1">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#fff3ef] text-2xl shadow-sm">📧</span>
              <span className="text-[10px] text-muted">邮箱</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <header className="px-1">
        <div className="mb-1 flex items-center gap-2">
          <button type="button" onClick={onBack} className="text-lg text-[#c49a96]" aria-label="返回">
            ‹
          </button>
          <h1 className="text-[20px] font-extrabold text-ink">我的</h1>
        </div>
      </header>

      {/* 用户信息卡片 */}
      <section className="rounded-3xl bg-gradient-to-br from-[#fff4ee] via-[#ffe8e4] to-[#ffdce0] p-4 shadow-[0_8px_24px_rgba(255,140,148,0.15)]">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setShowAvatarPicker(true)}
            className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white text-3xl shadow-md active:scale-95"
          >
            {user.avatar}
            <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-rose text-[10px] text-white shadow-sm">
              ✏️
            </span>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-[20px] font-extrabold text-ink">{user.nickname}</p>
              <button
                type="button"
                onClick={() => {
                  setDraftNickname(user.nickname);
                  setShowNicknameEdit(true);
                }}
                className="text-[12px] text-[#c49a96]"
              >
                ✏️
              </button>
            </div>
            <p className="mt-1 text-[12px] text-muted">记录 {totalRecords} 笔 · 坚持 {activeDays} 天</p>
          </div>
        </div>
      </section>

      {/* 统计数据 */}
      <section className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white/90 p-3 text-center shadow-sm">
          <p className="text-[22px] font-extrabold text-rose">¥{avgMonthlySpend}</p>
          <p className="mt-1 text-[10px] text-muted">月均消费</p>
        </div>
        <div className="rounded-2xl bg-white/90 p-3 text-center shadow-sm">
          <p className="text-[22px] font-extrabold text-mint-deep">{saveRate}%</p>
          <p className="mt-1 text-[10px] text-muted">存钱率</p>
        </div>
        <div className="rounded-2xl bg-white/90 p-3 text-center shadow-sm">
          <p className="text-[22px] font-extrabold text-lilac">{activeDays}</p>
          <p className="mt-1 text-[10px] text-muted">打卡天数</p>
        </div>
      </section>

      {/* 账号与安全 */}
      <section className="rounded-3xl bg-white/90 p-3 shadow-sm">
        <p className="mb-2 px-1 text-[12px] font-bold text-muted">账号与安全</p>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => setShowAccount(true)}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors active:bg-[#fff9f8]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e3f2fd] text-[16px]">🔐</span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink">账号与绑定</p>
                <p className="text-[11px] text-muted">
                  {user.phone ? `${user.phone} · ` : ""}
                  {user.wechatBound ? "已绑定微信" : "未绑定微信"}
                </p>
              </div>
              <span className="text-[12px] text-muted">›</span>
            </button>
          </li>
        </ul>
      </section>

      {/* 设置列表 */}
      <section className="rounded-3xl bg-white/90 p-3 shadow-sm">
        <p className="mb-2 px-1 text-[12px] font-bold text-muted">设置</p>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => {
                setDraftBudget(String(settings.monthBudget));
                setShowBudgetEdit(true);
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors active:bg-[#fff9f8]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff3ef] text-[16px]">💰</span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink">月度预算</p>
                <p className="text-[11px] text-muted">设置每月可支配金额</p>
              </div>
              <span className="text-[14px] font-bold text-rose">¥{settings.monthBudget.toLocaleString()}</span>
              <span className="text-[12px] text-muted">›</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, saveReminder: !settings.saveReminder })}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors active:bg-[#fff9f8]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e8f5e9] text-[16px]">🔔</span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink">存钱提醒</p>
                <p className="text-[11px] text-muted">月底自动提醒存钱</p>
              </div>
              <div className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${settings.saveReminder ? "bg-rose" : "bg-gray-200"}`}>
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${settings.saveReminder ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, dailyReminder: !settings.dailyReminder })}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors active:bg-[#fff9f8]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff3ef] text-[16px]">📝</span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink">每日记账提醒</p>
                <p className="text-[11px] text-muted">{settings.dailyReminder ? `每天 ${settings.reminderTime} 提醒` : "已关闭"}</p>
              </div>
              <div className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${settings.dailyReminder ? "bg-rose" : "bg-gray-200"}`}>
                <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${settings.dailyReminder ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </button>
          </li>
        </ul>
      </section>

      {/* 数据与支持 */}
      <section className="rounded-3xl bg-white/90 p-3 shadow-sm">
        <p className="mb-2 px-1 text-[12px] font-bold text-muted">数据与支持</p>
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => setShowExport(true)}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors active:bg-[#fff9f8]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#e3f2fd] text-[16px]">📊</span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink">导出账单</p>
                <p className="text-[11px] text-muted">Excel / CSV 格式</p>
              </div>
              <span className="text-[12px] text-muted">›</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setShowFeedback(true)}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors active:bg-[#fff9f8]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f3edfb] text-[16px]">💌</span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink">意见反馈</p>
                <p className="text-[11px] text-muted">帮助我们做得更好</p>
              </div>
              <span className="text-[12px] text-muted">›</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={() => setShowAbout(true)}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors active:bg-[#fff9f8]"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#fff8e1] text-[16px]">💎</span>
              <div className="flex-1">
                <p className="text-[14px] font-semibold text-ink">关于 MoneyMood</p>
                <p className="text-[11px] text-muted">版本 1.0.0</p>
              </div>
              <span className="text-[12px] text-muted">›</span>
            </button>
          </li>
        </ul>
      </section>

      {/* 底部版权 */}
      <p className="text-center text-[11px] text-muted">Made with 💗 by MoneyMood Team</p>

      {/* ========== 弹窗区域 ========== */}

      {/* 头像选择器 */}
      {showAvatarPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center" onClick={() => setShowAvatarPicker(false)} role="dialog" aria-modal="true">
          <div className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] font-extrabold text-ink">选择头像</p>
              <button type="button" onClick={() => setShowAvatarPicker(false)} className="grid h-8 w-8 place-items-center rounded-full bg-[#fff3ef] text-[14px] text-[#c49a96]">✕</button>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => { setUser({ ...user, avatar }); setShowAvatarPicker(false); }}
                  className={`h-14 w-14 rounded-full text-2xl shadow-sm transition-transform hover:scale-110 active:scale-95 ${user.avatar === avatar ? "ring-2 ring-rose ring-offset-2" : "bg-white"}`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 昵称编辑 */}
      {showNicknameEdit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center" onClick={() => setShowNicknameEdit(false)} role="dialog" aria-modal="true">
          <div className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] font-extrabold text-ink">修改昵称</p>
              <button type="button" onClick={() => setShowNicknameEdit(false)} className="grid h-8 w-8 place-items-center rounded-full bg-[#fff3ef] text-[14px] text-[#c49a96]">✕</button>
            </div>
            <label className="block rounded-2xl bg-[#fff9f8] px-4 py-3">
              <span className="text-[11px] text-muted">昵称</span>
              <input value={draftNickname} onChange={(e) => setDraftNickname(e.target.value)} maxLength={12} placeholder="给自己起个昵称吧" className="mt-1 w-full bg-transparent text-[16px] font-semibold text-ink outline-none placeholder:text-[#d4b0ae]" />
            </label>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setShowNicknameEdit(false)} className="rounded-full bg-[#fff3ef] py-3 text-[14px] font-bold text-[#c49a96]">取消</button>
              <button type="button" onClick={handleSaveNickname} className="rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(255,140,148,0.3)]">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* 预算编辑 */}
      {showBudgetEdit && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center" onClick={() => setShowBudgetEdit(false)} role="dialog" aria-modal="true">
          <div className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] font-extrabold text-ink">修改月度预算</p>
              <button type="button" onClick={() => setShowBudgetEdit(false)} className="grid h-8 w-8 place-items-center rounded-full bg-[#fff3ef] text-[14px] text-[#c49a96]">✕</button>
            </div>
            <label className="block rounded-2xl bg-[#fff9f8] px-4 py-3">
              <span className="text-[11px] text-muted">每月可支配金额</span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[18px] font-bold text-rose">¥</span>
                <input value={draftBudget} onChange={(e) => setDraftBudget(e.target.value.replace(/[^\d]/g, ""))} inputMode="numeric" placeholder="6000" className="w-full bg-transparent text-[24px] font-extrabold text-ink outline-none placeholder:text-[#d4b0ae]" />
              </div>
            </label>
            <p className="mt-2 text-[11px] text-muted">这是你每月可以花的最大金额，用于三池分配</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setShowBudgetEdit(false)} className="rounded-full bg-[#fff3ef] py-3 text-[14px] font-bold text-[#c49a96]">取消</button>
              <button type="button" onClick={handleSaveBudget} className="rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(255,140,148,0.3)]">保存</button>
            </div>
          </div>
        </div>
      )}

      {/* 账号与绑定 */}
      {showAccount && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center" onClick={() => setShowAccount(false)} role="dialog" aria-modal="true">
          <div className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] font-extrabold text-ink">账号与绑定</p>
              <button type="button" onClick={() => setShowAccount(false)} className="grid h-8 w-8 place-items-center rounded-full bg-[#fff3ef] text-[14px] text-[#c49a96]">✕</button>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center justify-between rounded-2xl bg-[#fff9f8] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📱</span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">手机号</p>
                    <p className="text-[11px] text-muted">{user.phone || "未绑定"}</p>
                  </div>
                </div>
                <span className="text-[12px] font-bold text-mint-deep">{user.phone ? "已绑定" : "去绑定"}</span>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-[#fff9f8] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">💬</span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">微信</p>
                    <p className="text-[11px] text-muted">{user.wechatBound ? "已绑定" : "未绑定"}</p>
                  </div>
                </div>
                <button type="button" className="text-[12px] font-bold text-rose">{user.wechatBound ? "已绑定" : "去绑定"}</button>
              </li>
              <li className="flex items-center justify-between rounded-2xl bg-[#fff9f8] px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">📧</span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">邮箱</p>
                    <p className="text-[11px] text-muted">{user.email || "用于找回密码"}</p>
                  </div>
                </div>
                <button type="button" className="text-[12px] font-bold text-rose">{user.email ? "变更" : "去绑定"}</button>
              </li>
            </ul>
            <div className="mt-4 space-y-2">
              <button type="button" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#ffe3e4] px-4 py-2.5 text-[14px] font-semibold text-rose">
                🔑 修改密码
              </button>
              <button type="button" onClick={handleLogout} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 px-4 py-2.5 text-[14px] font-semibold text-muted">
                🚪 退出登录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 导出账单 */}
      {showExport && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center" onClick={() => setShowExport(false)} role="dialog" aria-modal="true">
          <div className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] font-extrabold text-ink">导出账单</p>
              <button type="button" onClick={() => setShowExport(false)} className="grid h-8 w-8 place-items-center rounded-full bg-[#fff3ef] text-[14px] text-[#c49a96]">✕</button>
            </div>

            {/* 时间范围 */}
            <div className="mb-4">
              <p className="mb-2 text-[12px] font-bold text-muted">时间范围</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "month", label: "本月" },
                  { id: "quarter", label: "本季度" },
                  { id: "year", label: "本年" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setExportRange(opt.id)}
                    className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition-colors ${exportRange === opt.id ? "bg-rose text-white" : "bg-[#fff3ef] text-[#c49a96]"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 导出格式 */}
            <div className="mb-4">
              <p className="mb-2 text-[12px] font-bold text-muted">导出格式</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExportFormat("excel")}
                  className={`rounded-xl border p-3 text-left transition-colors ${exportFormat === "excel" ? "border-rose bg-[#fff3ef]" : "border-gray-100"}`}
                >
                  <p className="text-[14px] font-bold text-ink">📊 Excel</p>
                  <p className="text-[10px] text-muted">美化表格，适合查看</p>
                </button>
                <button
                  type="button"
                  onClick={() => setExportFormat("csv")}
                  className={`rounded-xl border p-3 text-left transition-colors ${exportFormat === "csv" ? "border-rose bg-[#fff3ef]" : "border-gray-100"}`}
                >
                  <p className="text-[14px] font-bold text-ink">📄 CSV</p>
                  <p className="text-[10px] text-muted">原始数据，适合分析</p>
                </button>
              </div>
            </div>

            {/* 包含内容 */}
            <div className="mb-4">
              <p className="mb-2 text-[12px] font-bold text-muted">包含内容</p>
              <div className="space-y-2">
                {[
                  { key: "includeMood", label: "情绪标签", icon: "💗" },
                  { key: "includePool", label: "池子分类", icon: "🌱" },
                  { key: "includeNote", label: "备注信息", icon: "📝" },
                ].map((opt) => (
                  <label key={opt.key} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exportOptions[opt.key as keyof typeof exportOptions]}
                      onChange={(e) => setExportOptions({ ...exportOptions, [opt.key]: e.target.checked })}
                      className="h-5 w-5 accent-rose"
                    />
                    <span className="text-[13px] text-ink">{opt.icon} {opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="w-full rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(255,140,148,0.3)] disabled:opacity-50"
            >
              {exporting ? "导出中..." : "开始导出"}
            </button>
          </div>
        </div>
      )}

      {/* 关于 */}
      {showAbout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center" onClick={() => setShowAbout(false)} role="dialog" aria-modal="true">
          <div className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] font-extrabold text-ink">关于 MoneyMood</p>
              <button type="button" onClick={() => setShowAbout(false)} className="grid h-8 w-8 place-items-center rounded-full bg-[#fff3ef] text-[14px] text-[#c49a96]">✕</button>
            </div>

            <div className="text-center">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-[#fff4ee] to-[#ffdce0] text-4xl shadow-md">💰</div>
              <h2 className="mt-4 text-[18px] font-extrabold text-ink">MoneyMood</h2>
              <p className="mt-1 text-[12px] text-muted">版本 1.0.0</p>

              <div className="mt-6 space-y-3">
                <div className="rounded-2xl bg-[#fff9f8] p-4 text-left">
                  <p className="text-[13px] font-bold text-rose">🌱 三池预算系统</p>
                  <p className="mt-1 text-[12px] text-muted">刚需 · 悦己 · 缓冲</p>
                  <p className="mt-1 text-[11px] text-[#8a6f6f]">科学分配每一分钱，让消费更有计划</p>
                </div>
                <div className="rounded-2xl bg-[#f3edfb] p-4 text-left">
                  <p className="text-[13px] font-bold text-lilac-deep">💗 情绪与消费追踪</p>
                  <p className="mt-1 text-[12px] text-muted">看见情绪，掌控金钱</p>
                  <p className="mt-1 text-[11px] text-[#8a6f6f]">记录每笔消费背后的情绪，找到消费模式的洞察</p>
                </div>
                <div className="rounded-2xl bg-[#e8f5e9] p-4 text-left">
                  <p className="text-[13px] font-bold text-mint-deep">📊 智能复盘分析</p>
                  <p className="mt-1 text-[12px] text-muted">周/月/年多维度洞察</p>
                  <p className="mt-1 text-[11px] text-[#8a6f6f]">让每一笔消费都有价值</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-[11px] text-muted">
                <p>📜 隐私协议 · 服务条款 · 开源组件</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 意见反馈 */}
      {showFeedback && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center" onClick={() => setShowFeedback(false)} role="dialog" aria-modal="true">
          <div className="max-h-[86dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[15px] font-extrabold text-ink">意见反馈</p>
              <button type="button" onClick={() => setShowFeedback(false)} className="grid h-8 w-8 place-items-center rounded-full bg-[#fff3ef] text-[14px] text-[#c49a96]">✕</button>
            </div>

            {feedbackSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#e8f5e9] text-3xl">✓</div>
                <p className="mt-4 text-[16px] font-bold text-mint-deep">感谢你的反馈！</p>
                <p className="mt-2 text-[12px] text-muted">我们会认真听取你的建议</p>
              </div>
            ) : (
              <>
                <label className="block rounded-2xl bg-[#fff9f8] p-4">
                  <span className="text-[11px] text-muted">告诉我们你的想法</span>
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    maxLength={500}
                    rows={4}
                    placeholder="功能建议、遇到的问题、想增加的功能..."
                    className="mt-2 w-full resize-none bg-transparent text-[14px] text-ink outline-none placeholder:text-[#d4b0ae]"
                  />
                  <p className="mt-2 text-right text-[10px] text-muted">{feedbackText.length}/500</p>
                </label>
                <button
                  type="button"
                  onClick={handleFeedbackSubmit}
                  disabled={!feedbackText.trim()}
                  className="mt-4 w-full rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3 text-[14px] font-bold text-white shadow-[0_8px_16px_rgba(255,140,148,0.3)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  提交反馈
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
