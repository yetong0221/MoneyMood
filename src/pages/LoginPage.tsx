import { useState } from "react";
import logo from "../assets/logo.png";

/* ============================================
   登录页面 - 欢迎页引导式 v2.0
   ============================================ */

type LoginStep = "welcome" | "phone" | "verify" | "email" | "wechat";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [step, setStep] = useState<LoginStep>("welcome");

  // 手机登录
  const [phone, setPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [verifyError, setVerifyError] = useState("");

  // 邮箱登录
  const [email, setEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  // 通用状态
  const [loading, setLoading] = useState(false);

  // 倒计时
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 验证验证码
  const handleVerifyCode = () => {
    if (!verifyCode || verifyCode.length < 4) {
      setVerifyError("请输入4位验证码");
      return;
    }
    setLoading(true);
    // 模拟登录
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1000);
  };

  // 邮箱登录
  const handleEmailLogin = () => {
    if (!email || !email.includes("@")) {
      setEmailError("请输入正确的邮箱地址");
      return;
    }
    if (!emailPassword || emailPassword.length < 6) {
      setEmailError("密码至少6位");
      return;
    }
    setLoading(true);
    setEmailError("");
    // 模拟登录
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 1000);
  };

  // 微信登录
  const handleWechatLogin = () => {
    setLoading(true);
    // 模拟微信授权
    setTimeout(() => {
      setLoading(false);
      // 实际应跳转微信授权页
      onLoginSuccess();
    }, 1500);
  };

  // 欢迎页
  if (step === "welcome") {
    return (
      <div className="flex min-h-full flex-col px-4 py-8">
        {/* 顶部装饰 - Logo */}
        <div className="relative mx-auto h-40 w-40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ffb0b6] to-rose opacity-20 animate-pulse" />
          <img
            src={logo}
            alt="MoneyMood"
            className="relative h-full w-full object-contain"
          />
        </div>

        {/* Logo */}
        <div className="mt-6 text-center">
          <h1 className="text-[28px] font-extrabold text-ink">MoneyMood</h1>
          <p className="mt-1 text-[14px] text-muted">情绪记账 · 轻松理财</p>
        </div>

        {/* 设计理念 */}
        <div className="mt-6 space-y-1 px-2">
          <p className="text-center text-[15px] text-muted">先存后花</p>
          <p className="text-center text-[15px] text-muted">存下满腹的底气</p>
          <p className="text-center text-[15px] text-muted">花出不内疚的欢喜</p>
          <div className="my-3 h-px bg-gradient-to-r from-transparent via-[#ffdce0] to-transparent" />
          <p className="text-center text-[15px] text-muted">让刚需给生活打底</p>
          <p className="text-center text-[15px] text-muted">悦己为快乐买单</p>
          <p className="text-center text-[15px] text-muted">缓冲为偶尔的失控兜底</p>
          <div className="my-3 h-px bg-gradient-to-r from-transparent via-[#ffdce0] to-transparent" />
          <p className="text-center text-[15px] text-muted">每一笔花销都是一次对情绪的倾听与照顾</p>
        </div>

        {/* 登录按钮 */}
        <div className="mt-auto space-y-3">
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="w-full rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(255,140,148,0.35)] active:scale-[0.98]"
          >
            📱 手机号登录
          </button>
          <button
            type="button"
            onClick={handleWechatLogin}
            className="w-full rounded-full bg-[#e8f5e9] py-3.5 text-[15px] font-bold text-mint-deep shadow-sm active:scale-[0.98]"
          >
            💬 微信一键登录
          </button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="w-full rounded-full bg-white py-3.5 text-[15px] font-bold text-ink shadow-sm active:scale-[0.98]"
          >
            📧 邮箱登录
          </button>
          <p className="text-center text-[10px] text-muted">
            登录即表示同意《用户协议》和《隐私政策》
          </p>
        </div>
      </div>
    );
  }

  // 手机号输入页
  if (step === "phone") {
    return (
      <div className="flex min-h-full flex-col px-4 py-8">
        <header className="mb-8">
          <button
            type="button"
            onClick={() => setStep("welcome")}
            className="mb-4 text-[14px] text-[#c49a96]"
          >
            ‹ 返回
          </button>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff3ef] text-2xl">📱</span>
            <div>
              <h2 className="text-[20px] font-extrabold text-ink">手机号登录</h2>
              <p className="text-[12px] text-muted">未注册将自动创建账号</p>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <label className="block rounded-2xl bg-white px-4 py-4 shadow-sm">
            <span className="text-[11px] text-muted">手机号</span>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[16px] font-semibold text-[#c49a96]">+86</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 11))}
                placeholder="请输入手机号"
                className="flex-1 bg-transparent text-[16px] font-semibold text-ink outline-none placeholder:text-[#d4b0ae]"
              />
            </div>
          </label>

          {verifyError && (
            <p className="text-[12px] text-rose">{verifyError}</p>
          )}

          <button
            type="button"
            onClick={() => {
              if (phone.length === 11) {
                setStep("verify");
                startCountdown();
              } else {
                setVerifyError("请输入正确的手机号");
              }
            }}
            className="w-full rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(255,140,148,0.35)] active:scale-[0.98]"
          >
            获取验证码
          </button>
        </div>

        {/* 其他登录方式 */}
        <div className="mt-auto">
          <p className="mb-3 text-center text-[11px] text-muted">其他登录方式</p>
          <div className="flex justify-center gap-6">
            <button
              type="button"
              onClick={() => setStep("email")}
              className="flex flex-col items-center gap-1"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#f3edfb] text-2xl shadow-sm">📧</span>
              <span className="text-[10px] text-muted">邮箱</span>
            </button>
            <button
              type="button"
              onClick={handleWechatLogin}
              className="flex flex-col items-center gap-1"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e8f5e9] text-2xl shadow-sm">💬</span>
              <span className="text-[10px] text-muted">微信</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 验证码输入页
  if (step === "verify") {
    return (
      <div className="flex min-h-full flex-col px-4 py-8">
        <header className="mb-8">
          <button
            type="button"
            onClick={() => setStep("phone")}
            className="mb-4 text-[14px] text-[#c49a96]"
          >
            ‹ 返回
          </button>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff3ef] text-2xl">🔐</span>
            <div>
              <h2 className="text-[20px] font-extrabold text-ink">输入验证码</h2>
              <p className="text-[12px] text-muted">已发送至 +86 {phone}</p>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                type="tel"
                maxLength={1}
                value={verifyCode[i] || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^\d]/g, "");
                  if (val) {
                    const newCode = verifyCode.slice(0, i) + val + verifyCode.slice(i + 1);
                    setVerifyCode(newCode);
                    // 自动聚焦下一个
                    if (i < 3) {
                      const inputs = document.querySelectorAll<HTMLInputElement>("input[data-verify]");
                      inputs[i + 1]?.focus();
                    }
                  }
                }}
                data-verify={i}
                className="h-14 w-14 rounded-2xl border-2 border-[#ffe3e4] bg-white text-center text-[24px] font-extrabold text-ink outline-none focus:border-rose"
              />
            ))}
          </div>

          {verifyError && (
            <p className="text-center text-[12px] text-rose">{verifyError}</p>
          )}

          <button
            type="button"
            onClick={handleVerifyCode}
            disabled={loading || verifyCode.length < 4}
            className="w-full rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(255,140,148,0.35)] disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "验证中..." : "验证并登录"}
          </button>

          <p className="text-center text-[12px] text-muted">
            {countdown > 0 ? (
              <span>重新发送 ({countdown}s)</span>
            ) : (
              <button
                type="button"
                onClick={startCountdown}
                className="text-rose"
              >
                重新发送验证码
              </button>
            )}
          </p>
        </div>

        {/* 未收到短信 */}
        <div className="mt-6 rounded-2xl bg-[#fff9f8] p-4">
          <p className="text-[12px] font-bold text-[#c49a96]">未收到短信？</p>
          <ul className="mt-2 space-y-1 text-[11px] text-muted">
            <li>• 检查手机号是否正确</li>
            <li>• 确认短信未被拦截</li>
            <li>• 尝试重新获取验证码</li>
          </ul>
        </div>
      </div>
    );
  }

  // 邮箱登录页
  if (step === "email") {
    return (
      <div className="flex min-h-full flex-col px-4 py-8">
        <header className="mb-8">
          <button
            type="button"
            onClick={() => setStep("welcome")}
            className="mb-4 text-[14px] text-[#c49a96]"
          >
            ‹ 返回
          </button>
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f3edfb] text-2xl">📧</span>
            <div>
              <h2 className="text-[20px] font-extrabold text-ink">邮箱登录</h2>
              <p className="text-[12px] text-muted">使用邮箱密码登录</p>
            </div>
          </div>
        </header>

        <div className="space-y-4">
          <label className="block rounded-2xl bg-white px-4 py-4 shadow-sm">
            <span className="text-[11px] text-muted">邮箱地址</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1 w-full bg-transparent text-[16px] font-semibold text-ink outline-none placeholder:text-[#d4b0ae]"
            />
          </label>

          <label className="block rounded-2xl bg-white px-4 py-4 shadow-sm">
            <span className="text-[11px] text-muted">密码</span>
            <input
              type="password"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              placeholder="请输入密码"
              className="mt-1 w-full bg-transparent text-[16px] font-semibold text-ink outline-none placeholder:text-[#d4b0ae]"
            />
          </label>

          {emailError && (
            <p className="text-[12px] text-rose">{emailError}</p>
          )}

          <button
            type="button"
            onClick={handleEmailLogin}
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-[#ffb0b6] to-rose py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(255,140,148,0.35)] disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "登录中..." : "登录"}
          </button>

          <div className="flex items-center justify-between text-[12px]">
            <button
              type="button"
              className="text-rose"
            >
              忘记密码？
            </button>
            <button
              type="button"
              onClick={() => { setEmail(""); setEmailPassword(""); setStep("phone"); }}
              className="text-[#c49a96]"
            >
              手机号登录
            </button>
          </div>
        </div>

        {/* 其他登录方式 */}
        <div className="mt-auto">
          <p className="mb-3 text-center text-[11px] text-muted">其他登录方式</p>
          <div className="flex justify-center gap-6">
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="flex flex-col items-center gap-1"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#fff3ef] text-2xl shadow-sm">📱</span>
              <span className="text-[10px] text-muted">手机</span>
            </button>
            <button
              type="button"
              onClick={handleWechatLogin}
              className="flex flex-col items-center gap-1"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e8f5e9] text-2xl shadow-sm">💬</span>
              <span className="text-[10px] text-muted">微信</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
