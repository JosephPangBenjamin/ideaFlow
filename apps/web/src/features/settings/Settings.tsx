import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  IconUser,
  IconLock,
  IconEdit,
  IconCheck,
  IconClose,
  IconCamera,
} from '@arco-design/web-react/icon';
import { Message, Input, Button, Spin, Modal, Avatar, Trigger, Card } from '@arco-design/web-react';
import { userService, UserProfile } from '@/services/user.service';
import { useAuth } from '@/hooks/useAuth';
import { NotificationSettings as NotificationSettingsSection } from './NotificationSettings';
import { LinkedAccounts } from './LinkedAccounts';

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Buddy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Abby',
];

export function Settings() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [nickname, setNickname] = useState('');
  const [savingNickname, setSavingNickname] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phone, setPhone] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [savingUsername, setSavingUsername] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getMe();
      setProfile(response.data);
      setNickname(response.data.nickname || '');
      setPhone(response.data.phone || '');
      setTempUsername(response.data.username || '');
    } catch (error) {
      Message.error('获取用户信息失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNickname = async () => {
    if (!nickname.trim()) {
      Message.warning('昵称不能为空');
      return;
    }

    try {
      setSavingNickname(true);
      const response = await userService.updateMe({ nickname: nickname.trim() });
      setProfile(response.data);
      setIsEditingNickname(false);
      Message.success(response.meta.message);
    } catch (error: any) {
      Message.error(error.response?.data?.message || '保存失败');
    } finally {
      setSavingNickname(false);
    }
  };

  const handleSavePhone = async () => {
    if (!phone.trim()) {
      Message.warning('手机号不能为空');
      return;
    }

    // Basic phone validation
    if (!/^1[3-9]\d{9}$/.test(phone.trim()) && !/^\d{7,15}$/.test(phone.trim())) {
      Message.warning('请输入有效的手机号');
      return;
    }

    try {
      setSavingPhone(true);
      const response = await userService.updateMe({ phone: phone.trim() });
      setProfile(response.data);
      setIsEditingPhone(false);
      Message.success(response.meta.message);
    } catch (error: any) {
      Message.error(error.response?.data?.message || '保存失败');
    } finally {
      setSavingPhone(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!tempUsername.trim()) {
      Message.warning('用户名不能为空');
      return;
    }

    try {
      setSavingUsername(true);
      const response = await userService.updateMe({ username: tempUsername.trim() });
      setProfile(response.data);
      setIsEditingUsername(false);
      Message.success(response.meta.message);
    } catch (error: any) {
      Message.error(error.response?.data?.message || '更新用户名失败');
    } finally {
      setSavingUsername(false);
    }
  };

  const handleSaveAvatar = async (avatarUrl: string) => {
    try {
      setSavingAvatar(true);
      const response = await userService.updateMe({ avatarUrl });
      setProfile(response.data);
      Message.success('头像更新成功');
    } catch (error: any) {
      Message.error(error.response?.data?.message || '更新头像失败');
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Message.warning('请填写所有密码字段');
      return;
    }

    if (newPassword !== confirmPassword) {
      Message.error('两次输入的密码不一致');
      return;
    }

    if (newPassword.length < 8) {
      Message.error('密码长度至少8位');
      return;
    }

    if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) {
      Message.error('密码必须包含字母和数字');
      return;
    }

    try {
      setChangingPassword(true);
      const response = await userService.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      Message.success(response.meta.message);
      // Clear form and logout
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
      // Logout after password change
      setTimeout(() => {
        logout();
      }, 1500);
    } catch (error: any) {
      Message.error(error.response?.data?.message || '密码修改失败');
    } finally {
      setChangingPassword(false);
    }
  };

  const maskPhone = (phone: string | null) => {
    if (!phone) return '未设置';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size={40} />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Profile Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-slate-700/50"
      >
        {/* Avatar Row */}
        <div className="flex flex-col items-center mb-8">
          <Trigger
            trigger="click"
            position="bottom"
            popup={() => (
              <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl flex gap-3">
                {AVATAR_PRESETS.map((url, i) => (
                  <Avatar
                    key={i}
                    size={48}
                    shape="circle"
                    className="cursor-pointer hover:scale-110 transition-transform border-2 border-transparent hover:border-blue-500"
                    onClick={() => handleSaveAvatar(url)}
                  >
                    <img src={url} alt={`preset ${i}`} />
                  </Avatar>
                ))}
              </div>
            )}
          >
            <div className="relative group cursor-pointer">
              <Avatar
                size={100}
                shape="circle"
                className="border-4 border-slate-700 shadow-xl overflow-hidden bg-slate-700"
              >
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="avatar" />
                ) : (
                  <span className="text-3xl font-bold uppercase">
                    {profile?.nickname?.[0] || profile?.username?.[0] || '?'}
                  </span>
                )}
              </Avatar>
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <IconCamera className="text-white text-2xl" />
              </div>
              {savingAvatar && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                  <Spin />
                </div>
              )}
            </div>
          </Trigger>
          <p className="mt-4 text-slate-400 text-sm">点击更换头像</p>
        </div>

        <div className="flex items-center mb-6">
          <IconUser className="w-5 h-5 text-blue-400 mr-2" />
          <h2 className="text-lg font-semibold text-white">个人信息</h2>
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div className="flex items-center justify-between py-3 border-b border-slate-700/30">
            <span className="text-slate-400">用户名</span>
            {isEditingUsername ? (
              <div className="flex items-center gap-2">
                <Input
                  value={tempUsername}
                  onChange={setTempUsername}
                  placeholder="新用户名"
                  className="w-40"
                  maxLength={50}
                />
                <Button
                  type="primary"
                  size="small"
                  loading={savingUsername}
                  onClick={handleSaveUsername}
                  icon={<IconCheck />}
                />
                <Button
                  size="small"
                  onClick={() => {
                    setIsEditingUsername(false);
                    setTempUsername(profile?.username || '');
                  }}
                  icon={<IconClose />}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white font-mono">{profile?.username}</span>
                <Button
                  size="small"
                  type="text"
                  onClick={() => setIsEditingUsername(true)}
                  icon={<IconEdit className="text-slate-400" />}
                />
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between py-3 border-b border-slate-700/30">
            <span className="text-slate-400">手机号</span>
            {isEditingPhone ? (
              <div className="flex items-center gap-2">
                <Input
                  value={phone}
                  onChange={setPhone}
                  placeholder="输入手机号"
                  className="w-40"
                />
                <Button
                  type="primary"
                  size="small"
                  loading={savingPhone}
                  onClick={handleSavePhone}
                  icon={<IconCheck />}
                />
                <Button
                  size="small"
                  onClick={() => {
                    setIsEditingPhone(false);
                    setPhone(profile?.phone || '');
                  }}
                  icon={<IconClose />}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white">{maskPhone(profile?.phone || null)}</span>
                <Button
                  size="small"
                  type="text"
                  onClick={() => setIsEditingPhone(true)}
                  icon={<IconEdit className="text-slate-400" />}
                />
              </div>
            )}
          </div>

          {/* Nickname */}
          <div className="flex items-center justify-between py-3">
            <span className="text-slate-400">昵称</span>
            {isEditingNickname ? (
              <div className="flex items-center gap-2">
                <Input
                  value={nickname}
                  onChange={setNickname}
                  placeholder="输入昵称"
                  className="w-40"
                  maxLength={50}
                />
                <Button
                  type="primary"
                  size="small"
                  loading={savingNickname}
                  onClick={handleSaveNickname}
                  icon={<IconCheck />}
                />
                <Button
                  size="small"
                  onClick={() => {
                    setIsEditingNickname(false);
                    setNickname(profile?.nickname || '');
                  }}
                  icon={<IconClose />}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-white">{profile?.nickname || '未设置'}</span>
                <Button
                  size="small"
                  type="text"
                  onClick={() => setIsEditingNickname(true)}
                  icon={<IconEdit className="text-slate-400" />}
                />
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Security Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50"
      >
        <div className="flex items-center mb-6">
          <IconLock className="w-5 h-5 text-purple-400 mr-2" />
          <h2 className="text-lg font-semibold text-white">账户安全</h2>
        </div>

        <div className="flex items-center justify-between py-3">
          <div className="flex flex-col">
            <span className="text-white font-medium">登录密码</span>
            <span className="text-slate-500 text-xs mt-1">定期修改密码有助于保护账号安全</span>
          </div>
          <Button type="primary" status="warning" onClick={() => setShowPasswordModal(true)}>
            修改密码
          </Button>
        </div>
      </motion.section>

      {/* Linked Accounts Section (AC: 7) */}
      <LinkedAccounts />

      {/* Notification Settings Section */}
      <NotificationSettingsSection />

      {/* Dashboard Stats / Info (Placeholder for user request) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card
            className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl p-4 h-full"
            bordered={false}
          >
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
              安全状态
            </h4>
            <p className="text-white text-sm">您的账户目前处于安全状态，最近一次登录是今天。</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card
            className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl p-4 h-full"
            bordered={false}
          >
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
              数据备份
            </h4>
            <p className="text-white text-sm">云同步功能已开启，您的所有想法和画布均已实时备份。</p>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card
            className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 rounded-2xl p-4 h-full"
            bordered={false}
          >
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
              活跃设备
            </h4>
            <p className="text-white text-sm">
              当前有 2 台设备正在访问您的账户（MacBook Air, iPhone 15）。
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Password Modal */}
      <Modal
        title={null}
        footer={null}
        visible={showPasswordModal}
        onCancel={() => {
          if (!changingPassword) {
            setShowPasswordModal(false);
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
          }
        }}
        style={{ padding: 0, width: '90%', maxWidth: '800px' }}
        className="p-0 border-none bg-transparent"
        wrapClassName="setting-modal-wrap"
      >
        <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-700/50 shadow-2xl flex flex-col md:flex-row h-[600px]">
          {/* Left Side: Info / Branding */}
          <div className="md:w-1/3 bg-gradient-to-br from-purple-900/40 to-blue-900/40 p-10 flex flex-col justify-between border-r border-slate-700/30">
            <div>
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/20">
                <IconLock className="text-white text-3xl" />
              </div>
              <h3 className="text-3xl font-black text-white leading-tight mb-4">
                安全
                <br />
                中心
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                保护您的创意资产，
                <br />
                从一个强密码开始。
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-slate-300">加密连接已建立</span>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="md:w-2/3 p-10 flex flex-col justify-center bg-slate-900/80">
            <div className="max-w-md mx-auto w-full">
              <h4 className="text-xl font-bold text-white mb-2 ml-1">修改密码</h4>
              <p className="text-slate-500 text-sm mb-8 ml-1">
                请填写以下信息以验证并更新您的身份凭证
              </p>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                      当前密码
                    </label>
                    <Input.Password
                      value={oldPassword}
                      onChange={setOldPassword}
                      placeholder="••••••••"
                      className="h-14 bg-slate-800/30 border-slate-700/50 hover:border-purple-500/50 focus:border-purple-500 transition-all rounded-2xl text-lg px-4"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                        新密码
                      </label>
                      <Input.Password
                        value={newPassword}
                        onChange={setNewPassword}
                        placeholder="••••••••"
                        className="h-14 bg-slate-800/30 border-slate-700/50 hover:border-blue-500/50 focus:border-blue-500 transition-all rounded-2xl text-lg px-4"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">
                        重复新密码
                      </label>
                      <Input.Password
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        placeholder="••••••••"
                        className="h-14 bg-slate-800/30 border-slate-700/50 hover:border-blue-500/50 focus:border-blue-500 transition-all rounded-2xl text-lg px-4"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <Button
                    className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 border-none hover:opacity-90 font-black text-base shadow-xl shadow-purple-900/20"
                    type="primary"
                    loading={changingPassword}
                    onClick={handleChangePassword}
                  >
                    立即更新
                  </Button>
                  <Button
                    className="px-8 h-14 rounded-2xl bg-slate-800 border-slate-700 text-slate-400 hover:text-white font-bold"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setOldPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    disabled={changingPassword}
                  >
                    取消
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
