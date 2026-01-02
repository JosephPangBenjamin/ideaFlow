import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Message, Typography } from '@arco-design/web-react';
import { IconUser, IconLock } from '@arco-design/web-react/icon';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { fadeInUp, staggerContainer, tapAnimation } from '@/utils/motion';

const FormItem = Form.Item;
const { Title, Text } = Typography;

export function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = useCallback(
    async (values: { username: string; password: string }) => {
      setLoading(true);
      try {
        await login(values.username, values.password);
        Message.success('登录成功！');
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } } };
        const message = err.response?.data?.message || '登录失败，请重试';
        Message.error(message);
      } finally {
        setLoading(false);
      }
    },
    [login]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden relative font-sans text-slate-100">
      {/* Dynamic Background (Starry Night / Aurora) - Consistent with Layout */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] z-0">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent opacity-60 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="w-full max-w-sm relative z-10 px-4"
      >
        {/* Logo Section */}
        <motion.div variants={fadeInUp} className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40 mb-4 border border-white/20">
            <span className="text-white font-bold text-3xl font-heading">I</span>
          </div>
          <Title
            heading={2}
            className="!text-white !mb-1 !mt-0 !text-3xl tracking-tight font-heading"
          >
            欢迎回来
          </Title>
          <Text className="!text-slate-400">登录到 IdeaFlow 开启灵感之旅</Text>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20"
        >
          <Form
            form={form}
            layout="vertical"
            autoComplete="off"
            onSubmit={handleSubmit}
            className="dark-form"
          >
            <FormItem
              label={<span className="text-slate-300 font-medium">用户名</span>}
              field="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<IconUser className="text-slate-400" />}
                placeholder="请输入用户名"
                className="!bg-white/5 !border-white/10 !text-white !rounded-xl !h-12 focus-within:!border-blue-500/50 transition-all"
              />
            </FormItem>

            <FormItem
              label={<span className="text-slate-300 font-medium">密码</span>}
              field="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<IconLock className="text-slate-400" />}
                placeholder="请输入密码"
                className="!bg-white/5 !border-white/10 !text-white !rounded-xl !h-12 focus-within:!border-blue-500/50 transition-all"
              />
            </FormItem>

            <FormItem className="mb-0 mt-6">
              <motion.div whileTap={tapAnimation}>
                <Button
                  type="primary"
                  htmlType="submit"
                  long
                  loading={loading}
                  className="!h-12 !rounded-xl !bg-gradient-to-r !from-blue-600 !to-indigo-600 !border-0 !text-white !font-bold !text-base shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all"
                >
                  登录系统
                </Button>
              </motion.div>
            </FormItem>
          </Form>

          <div className="text-center mt-8">
            <Text className="!text-slate-400 !text-sm">
              还没有账号？{' '}
              <Link
                to="/register"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                立即注册
              </Link>
            </Text>
          </div>
        </motion.div>

        {/* Footer Subtle Text */}
        <motion.p variants={fadeInUp} className="text-center mt-10 text-slate-500 text-xs">
          &copy; 2026 IdeaFlow. Premium AI-Powered Ideation.
        </motion.p>
      </motion.div>

      <style>{`
                .dark-form .arco-form-label-item {
                    margin-bottom: 6px;
                }
                .dark-form .arco-input-inner-wrapper {
                    background-color: transparent !important;
                    transition: all 0.2s !important;
                    border-radius: 12px !important;
                }
                .dark-form .arco-input-inner-wrapper-focus {
                    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3) !important;
                    border-color: rgba(59, 130, 246, 0.5) !important;
                    border-radius: 12px !important;
                }
                /* Input text color and placeholder */
                .dark-form input {
                    color: #f8fafc !important; /* slate-50 */
                }
                .dark-form .arco-input::placeholder {
                    color: #94a3b8 !important; /* slate-400 */
                }
                /* Eliminate browser default outline and Arco inner focus rings */
                .dark-form input, 
                .dark-form input:focus, 
                .dark-form .arco-input:focus,
                .dark-form .arco-input-inner-wrapper input:focus {
                    outline: none !important;
                    box-shadow: none !important;
                    border: none !important;
                }
                /* Hide the default Arco focus border if it persists */
                .dark-form .arco-input-inner-wrapper-focus::after {
                    display: none !important;
                }
            `}</style>
    </div>
  );
}

export default LoginPage;
