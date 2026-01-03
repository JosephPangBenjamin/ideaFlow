import { IconBulb, IconCheckCircle, IconApps } from '@arco-design/web-react/icon';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { isSidebarOpenAtom } from '@/store/ui';
import { staggerContainer, fadeInUp, hoverAnimation, tapAnimation, spring } from '@/utils/motion';
import { useAuth } from '@/hooks/useAuth';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string; // Now used for text/icon accents or subtle gradients
  delay?: number;
}

function StatCard({ title, value, icon, gradient, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      custom={delay}
      whileHover={{ ...hoverAnimation, y: -4, backgroundColor: 'rgba(30, 41, 59, 0.6)' }}
      whileTap={tapAnimation}
      className="rounded-2xl p-6 bg-slate-800/40 backdrop-blur-md border border-white/10 shadow-xl shadow-black/5 cursor-pointer group overflow-hidden relative"
    >
      {/* Dynamic Glow Effect */}
      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl ${gradient.replace('bg-', 'bg-')}`}
      />

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex items-start justify-between">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white`}
          >
            {icon}
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/5 text-slate-300 border border-white/5">
            +12%
          </span>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="text-3xl font-heading font-bold text-white mt-1 tracking-tight">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}

export function Dashboard() {
  const [isSidebarOpen] = useAtom(isSidebarOpenAtom);
  const { user } = useAuth();

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="w-full">
      {/* Header Section */}
      <div className="mb-10 flex items-end justify-between">
        <motion.div variants={fadeInUp}>
          <h1 className="text-4xl font-heading font-bold text-white tracking-tight">
            {new Date().getHours() < 12
              ? '早上好'
              : new Date().getHours() < 18
                ? '下午好'
                : '晚上好'}
            , {user?.username || '用户'}
          </h1>
          <p className="text-slate-400 mt-2 text-lg">今天阳光明媚，适合捕捉灵感。</p>
        </motion.div>

        {/* Weather/Context Widget (Placeholder) */}
        <motion.div
          variants={fadeInUp}
          className="hidden md:flex items-center gap-4 text-slate-300 bg-white/5 px-4 py-2 rounded-full border border-white/5 backdrop-blur-sm"
        >
          <span>🌱 创意生长季</span>
          <div className="w-px h-4 bg-white/10" />
          <span>24°C</span>
        </motion.div>
      </div>

      {/* Adaptive Grid: 3 cols when open, 4 cols when closed */}
      <div
        className={`grid gap-6 transition-all duration-500 ease-spring ${
          isSidebarOpen
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        <StatCard
          title="活跃想法"
          value={12}
          icon={<IconBulb className="w-5 h-5" />}
          gradient="bg-blue-500"
        />
        <StatCard
          title="待办任务"
          value={8}
          icon={<IconCheckCircle className="w-5 h-5" />}
          gradient="bg-emerald-500"
        />
        <StatCard
          title="画布项目"
          value={3}
          icon={<IconApps className="w-5 h-5" />}
          gradient="bg-purple-500"
        />
        {/* Extra card shown seamlessly when space allows */}
        <StatCard
          title="已归档"
          value={128}
          icon={<IconApps className="w-5 h-5" />}
          gradient="bg-orange-500"
        />
      </div>

      {/* Large Content Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart/Area - Spans 2 cols */}
        <motion.div
          variants={fadeInUp}
          className="lg:col-span-2 rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 p-8 min-h-[300px] shadow-xl shadow-black/5"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">创意趋势</h3>
            <div className="flex gap-2">
              {['周', '月', '年'].map((t) => (
                <button
                  key={t}
                  className="px-3 py-1 text-sm rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-48 w-full bg-gradient-to-t from-blue-500/10 to-transparent rounded-xl flex items-end justify-center pb-4 border-b border-white/5 relative overflow-hidden">
            {/* Abstract Chart Placeholder */}
            <div className="absolute inset-0 flex items-end justify-around px-4">
              {[40, 60, 45, 70, 50, 80, 65].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ ...spring, delay: i * 0.1 }}
                  className="w-12 bg-blue-500/20 rounded-t-lg hover:bg-blue-500/40 transition-colors"
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions / Side Panel */}
        <motion.div
          variants={fadeInUp}
          className="rounded-3xl bg-slate-800/40 backdrop-blur-md border border-white/10 p-8 shadow-xl shadow-black/5"
        >
          <h3 className="text-xl font-semibold text-white mb-6">快捷操作</h3>
          <div className="space-y-4">
            <QuickActionRow
              icon={<IconBulb />}
              label="记录新想法"
              shortcut="N"
              color="text-blue-400"
            />
            <QuickActionRow
              icon={<IconCheckCircle />}
              label="创建任务"
              shortcut="T"
              color="text-emerald-400"
            />
            <QuickActionRow
              icon={<IconApps />}
              label="开启画布"
              shortcut="C"
              color="text-purple-400"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function QuickActionRow({
  icon,
  label,
  shortcut,
  color,
}: {
  icon: any;
  label: string;
  shortcut: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg bg-white/5 ${color} group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <span className="text-slate-300 font-medium">{label}</span>
      </div>
      <kbd className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-500 font-mono group-hover:text-slate-300 transition-colors">
        ⌘{shortcut}
      </kbd>
    </div>
  );
}
