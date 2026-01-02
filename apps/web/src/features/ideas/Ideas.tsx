import { Card, Empty } from '@arco-design/web-react';

export function Ideas() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">想法</h1>
            </div>

            <Card className="bg-white">
                <Empty description="暂无想法，开始捕捉你的灵感吧！" />
            </Card>
        </div>
    );
}
