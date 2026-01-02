import { Card, Empty } from '@arco-design/web-react';

export function Tasks() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">任务</h1>
            </div>

            <Card className="bg-white">
                <Empty description="暂无任务，从想法创建你的第一个任务吧！" />
            </Card>
        </div>
    );
}
