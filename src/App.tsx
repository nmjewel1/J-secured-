import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Cpu, 
  Smartphone, 
  BellOff, 
  Fingerprint, 
  ChevronRight, 
  Code, 
  FileText, 
  Settings,
  Zap,
  Volume2,
  Power
} from 'lucide-react';

// --- Kotlin Code Snippets ---
const KOTLIN_ACCESSIBILITY_SERVICE = `
class JSecureAccessibilityService : AccessibilityService() {
    override fun onKeyEvent(event: KeyEvent): Boolean {
        val keyCode = event.keyCode
        val action = event.action

        // Intercept Power and Volume buttons when J-Secure is active
        if (JSecureManager.isLocked) {
            when (keyCode) {
                KeyEvent.KEYCODE_POWER,
                KeyEvent.KEYCODE_VOLUME_UP,
                KeyEvent.KEYCODE_VOLUME_DOWN -> {
                    // Consume the event so the system doesn't react
                    return true 
                }
            }
        }
        return super.onKeyEvent(event)
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {}
    override fun onInterrupt() {}
}
`;

const KOTLIN_FOREGROUND_SERVICE = `
class JSecureForegroundService : Service() {
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("J-Secure Active")
            .setContentText("Anti-theft protection is running")
            .setSmallIcon(R.drawable.ic_shield)
            .setOngoing(true)
            .build()

        startForeground(NOTIFICATION_ID, notification)
        return START_STICKY
    }
}
`;

const ANDROID_MANIFEST = `
<manifest ...>
    <!-- Essential Permissions -->
    <uses-permission android:name="android.permission.BIND_ACCESSIBILITY_SERVICE" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <application ...>
        <service
            android:name=".JSecureAccessibilityService"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="false">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>
    </application>
</manifest>
`;

export default function App() {
  const [isLocked, setIsLocked] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tech' | 'code'>('dashboard');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  return (
    <div className="min-h-screen bg-[#1A237E] text-white selection:bg-[#00E5FF]/30">
      {/* Splash Screen Overlay */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A237E]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[#00E5FF] blur-3xl opacity-20 animate-pulse"></div>
              <Shield size={120} className="text-[#00E5FF] relative z-10" />
            </motion.div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-5xl font-bold tracking-tighter"
            >
              J-SECURE
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
              className="mt-2 text-sm uppercase tracking-[0.3em]"
            >
              Anti-Theft Protection Suite
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navigation */}
      <nav className="border-b border-white/10 bg-[#1A237E]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-[#00E5FF]" size={24} />
            <span className="font-bold text-xl tracking-tight">J-SECURE</span>
          </div>
          <div className="flex gap-1">
            {(['dashboard', 'tech', 'code'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-[#00E5FF] text-[#1A237E]' 
                    : 'hover:bg-white/5 text-white/60'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 md:p-12">
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Interactive Lock Simulation */}
            <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-[40px] border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00E5FF]/50 to-transparent"></div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleLock}
                className={`relative w-64 h-64 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isLocked 
                    ? 'bg-[#00E5FF] text-[#1A237E] animate-pulse-glow shadow-[0_0_50px_rgba(0,229,255,0.3)]' 
                    : 'bg-white/10 text-white border-2 border-white/20'
                }`}
              >
                {isLocked ? <Lock size={80} /> : <Unlock size={80} />}
                <div className="absolute -bottom-16 text-center">
                  <p className={`text-lg font-bold uppercase tracking-widest ${isLocked ? 'text-[#00E5FF]' : 'text-white/40'}`}>
                    {isLocked ? 'System Armed' : 'System Disarmed'}
                  </p>
                  <p className="text-xs text-white/40 mt-1">Tap to toggle protection</p>
                </div>
              </motion.button>

              <div className="mt-32 grid grid-cols-2 gap-4 w-full">
                <StatusCard 
                  icon={<Power size={18} />} 
                  label="Power Button" 
                  active={isLocked} 
                />
                <StatusCard 
                  icon={<Volume2 size={18} />} 
                  label="Volume Control" 
                  active={isLocked} 
                />
                <StatusCard 
                  icon={<BellOff size={18} />} 
                  label="Notification Panel" 
                  active={isLocked} 
                />
                <StatusCard 
                  icon={<Fingerprint size={18} />} 
                  label="Biometric Auth" 
                  active={isLocked} 
                />
              </div>
            </div>

            {/* Right: Feature Highlights */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-4">High-Security Anti-Theft</h2>
                <p className="text-white/60 leading-relaxed">
                  J-Secure transforms your device into an impenetrable vault. By leveraging deep Android system hooks, 
                  we ensure that even if a thief grabs your phone, they cannot power it off, change volume, 
                  or access the notification shade to toggle Airplane Mode.
                </p>
              </div>

              <div className="space-y-4">
                <FeatureItem 
                  icon={<Zap className="text-[#00E5FF]" />}
                  title="Accessibility Interception"
                  desc="Consumes hardware KeyEvents to prevent device shutdown or silencing."
                />
                <FeatureItem 
                  icon={<Smartphone className="text-[#00E5FF]" />}
                  title="Overlay Protection"
                  desc="Uses SYSTEM_ALERT_WINDOW to block notification shade pull-down."
                />
                <FeatureItem 
                  icon={<Fingerprint className="text-[#00E5FF]" />}
                  title="Biometric Prompt"
                  desc="Securely unlocks using the latest Android Biometric APIs."
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tech' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Cpu className="text-[#00E5FF]" /> Technical Architecture
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">1. Accessibility Service</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    The core of J-Secure. By implementing an <code>AccessibilityService</code>, we can override 
                    <code>onKeyEvent</code>. When the system is locked, we return <code>true</code> for 
                    KEYCODE_POWER and KEYCODE_VOLUME, effectively "consuming" the event before the system can process it.
                  </p>
                </div>
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold mb-3">2. WindowManager Overlay</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    To block the notification shade, we create a transparent 1px height overlay at the top of the screen 
                    using <code>TYPE_APPLICATION_OVERLAY</code>. By setting specific LayoutParams, we intercept 
                    touch events that would otherwise trigger the status bar expansion.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <FileText className="text-[#00E5FF]" /> Manifest & Permissions
              </h2>
              <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm overflow-x-auto border border-white/10">
                <pre className="text-emerald-400">{ANDROID_MANIFEST}</pre>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Code size={20} className="text-[#00E5FF]" /> AccessibilityService.kt
              </h3>
              <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm overflow-x-auto border border-white/10">
                <pre className="text-blue-300">{KOTLIN_ACCESSIBILITY_SERVICE}</pre>
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-[#00E5FF]" /> ForegroundService.kt
              </h3>
              <div className="bg-black/40 rounded-2xl p-6 font-mono text-sm overflow-x-auto border border-white/10">
                <pre className="text-purple-300">{KOTLIN_FOREGROUND_SERVICE}</pre>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 p-12 text-center text-white/40 text-sm">
        <p>© 2026 J-Secure Systems. High-Security Anti-Theft Protection.</p>
        <p className="mt-2">Designed for Android 12+ (API 31+)</p>
      </footer>
    </div>
  );
}

function StatusCard({ icon, label, active }: { icon: ReactNode, label: string, active: boolean }) {
  return (
    <div className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${
      active 
        ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]' 
        : 'bg-white/5 border-white/10 text-white/40'
    }`}>
      {icon}
      <span className="text-xs font-bold uppercase tracking-tighter">{label}</span>
    </div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: ReactNode, title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="font-bold text-lg group-hover:text-[#00E5FF] transition-colors">{title}</h4>
        <p className="text-white/40 text-sm">{desc}</p>
      </div>
    </div>
  );
}
