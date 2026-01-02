import { Card, Empty } from '@arco-design/web-react';

export function Canvas() {
    return (
        <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-200 bg-white">
                <h1 className="text-2xl font-bold text-gray-800">画布</h1>
            </div>

            <div className="flex-1 flex items-center justify-center bg-gray-100">
                <Card className="bg-white">
                    <Empty description="创建你的第一个画布，开始可视化你的想法！" />
                </Card>
            </div>
        </div>
    );
}
