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

// Password validation regex: ≥8 chars, contains letter and number
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

export function RegisterPage() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleSubmit = useCallback(
        async (values: { username: string; password: string; confirmPassword: string }) => {
            if (values.password !== values.confirmPassword) {
                Message.error('两次输入的密码不一致');
                return;
            }

            setLoading(true);
            try {
                await register(values.username, values.password);
                Message.success('注册成功！');
            } catch (error: unknown) {
                const err = error as { response?: { data?: { message?: string } } };
                const message = err.response?.data?.message || '注册失败，请重试';
                Message.error(message);
            } finally {
                setLoading(false);
            }
        },
        [register]
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <Card className="w-full max-w-md p-8 shadow-xl">
                <div className="text-center mb-8">
                    <Title heading={2} className="text-gray-800">
                        创建账号
                    </Title>
                    <Text type="secondary">开始使用 IdeaFlow 记录你的想法</Text>
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
                        rules={[
                            { required: true, message: '请输入用户名' },
                            { minLength: 3, message: '用户名至少3个字符' },
                            { maxLength: 20, message: '用户名最多20个字符' },
                        ]}
                    >
                        <Input
                            prefix={<IconUser />}
                            placeholder="3-20个字符"
                            size="large"
                        />
                    </FormItem>

                    <FormItem
                        label="密码"
                        field="password"
                        rules={[
                            { required: true, message: '请输入密码' },
                            {
                                validator: (value, callback) => {
                                    if (value && value.length < 8) {
                                        callback('密码至少8位');
                                    } else if (value && !passwordRegex.test(value)) {
                                        callback('密码需包含字母和数字');
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<IconLock />}
                            placeholder="至少8位，包含字母和数字"
                            size="large"
                        />
                    </FormItem>

                    <FormItem
                        label="确认密码"
                        field="confirmPassword"
                        rules={[
                            { required: true, message: '请确认密码' },
                            {
                                validator: (value, callback) => {
                                    const password = form.getFieldValue('password');
                                    if (value && value !== password) {
                                        callback('两次输入的密码不一致');
                                    } else {
                                        callback();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input.Password
                            prefix={<IconLock />}
                            placeholder="再次输入密码"
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
                            注册
                        </Button>
                    </FormItem>
                </Form>

                <div className="text-center mt-4">
                    <Text type="secondary">
                        已有账号？{' '}
                        <Link to="/login" className="text-blue-600 hover:text-blue-800">
                            立即登录
                        </Link>
                    </Text>
                </div>
            </Card>
        </div>
    );
}

export default RegisterPage;
