import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Form,
    Input,
    Button,
    Message,
    Card,
    Typography,
} from '@arco-design/web-react';
import { IconUser, IconLock } from '@arco-design/web-react/icon';
import { useAuth } from '@/hooks/useAuth';

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <Card className="w-full max-w-md p-8 shadow-xl">
                <div className="text-center mb-8">
                    <Title heading={2} className="text-gray-800">
                        欢迎回来
                    </Title>
                    <Text type="secondary">登录到 IdeaFlow</Text>
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    autoComplete="off"
                    onSubmit={handleSubmit}
                >
                    <FormItem
                        label="用户名"
                        field="username"
                        rules={[{ required: true, message: '请输入用户名' }]}
                    >
                        <Input
                            prefix={<IconUser />}
                            placeholder="请输入用户名"
                            size="large"
                        />
                    </FormItem>

                    <FormItem
                        label="密码"
                        field="password"
                        rules={[{ required: true, message: '请输入密码' }]}
                    >
                        <Input.Password
                            prefix={<IconLock />}
                            placeholder="请输入密码"
                            size="large"
                        />
                    </FormItem>

                    <FormItem>
                        <Button
                            type="primary"
                            htmlType="submit"
                            long
                            size="large"
                            loading={loading}
                            className="mt-2"
                        >
                            登录
                        </Button>
                    </FormItem>
                </Form>

                <div className="text-center mt-4">
                    <Text type="secondary">
                        还没有账号？{' '}
                        <Link to="/register" className="text-blue-600 hover:text-blue-800">
                            立即注册
                        </Link>
                    </Text>
                </div>
            </Card>
        </div>
    );
}

export default LoginPage;
