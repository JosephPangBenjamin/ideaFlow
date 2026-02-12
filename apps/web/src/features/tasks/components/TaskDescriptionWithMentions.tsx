import { useState, useCallback } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import 'react-mentions/lib/react-mentions.css';
import { useQuery } from '@tanstack/react-query';
import { getCanvasMembers, TeamMember } from '../../../services/teams.api';

interface TaskDescriptionWithMentionsProps {
  value: string;
  onChange: (value: string) => void;
  onAssigneeChange: (assigneeId: string) => void;
  canvasId?: string | null;
  placeholder?: string;
}

/**
 * Story 8.3: 带 @mention 的任务描述输入
 * 输入 @ 符号时自动提示团队成员，选中后自动分配任务
 */
export function TaskDescriptionWithMentions({
  value,
  onChange,
  onAssigneeChange,
  canvasId,
  placeholder = '描述任务... 输入 @ 分配给团队成员',
}: TaskDescriptionWithMentionsProps) {
  const [query, setQuery] = useState('');

  // 获取画布成员
  const { data: membersData } = useQuery({
    queryKey: ['canvasMembers', canvasId],
    queryFn: () => getCanvasMembers(canvasId!),
    enabled: !!canvasId,
  });

  const members = membersData?.data || [];

  // 转换为 react-mentions 需要的格式
  const mentionData = members.map((m: TeamMember) => ({
    id: m.userId,
    display: m.user.username || '未知用户',
  }));

  // 过滤匹配的成员
  const filteredMembers = query
    ? mentionData.filter((m) => m.display.toLowerCase().includes(query.toLowerCase()))
    : mentionData;

  // 处理提及添加
  const handleAddMention = useCallback(
    (id: string, display: string) => {
      // 设置为分配者
      onAssigneeChange(id);
    },
    [onAssigneeChange]
  );

  return (
    <div className="task-description-with-mentions">
      <MentionsInput
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mentions-input"
        customSuggestionsContainerClassName="mentions-dropdown"
        a11ySuggestionsListLabel={'团队成员列表'}
      >
        <Mention
          trigger="@"
          data={filteredMembers}
          onAdd={handleAddMention}
          markup="@__display__"
          displayTransform={(id, display) => `@${display}`}
          className="mention-highlight"
          appendSpaceOnAdd={true}
        />
      </MentionsInput>

      <style>{`
        .mentions-input {
          width: 100%;
          min-height: 100px;
          padding: 12px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 12px;
          color: #e2e8f0;
          font-size: 14px;
          line-height: 1.5;
          resize: vertical;
          transition: all 0.2s;
        }

        .mentions-input:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .mentions-input::placeholder {
          color: #64748b;
        }

        .mentions-dropdown {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(51, 65, 85, 0.5);
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          max-height: 200px;
          overflow-y: auto;
          backdrop-filter: blur(12px);
          z-index: 100;
        }

        .mentions-dropdown > div {
          padding: 8px 12px;
          cursor: pointer;
          transition: background 0.2s;
          color: #e2e8f0;
        }

        .mentions-dropdown > div:hover,
        .mentions-dropdown > div:focus {
          background: rgba(255, 255, 255, 0.05);
        }

        .mention-highlight {
          color: #60a5fa;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 4px;
          padding: 2px 4px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
