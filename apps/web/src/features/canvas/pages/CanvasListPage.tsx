import { useNavigate } from 'react-router-dom';
import { CanvasList } from '../components/CanvasList';

export function CanvasListPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <CanvasList
        hideCreate={true}
        onSelect={(canvas) => navigate(`/canvas/${canvas.id}`)}
        onCreate={(canvas) => navigate(`/canvas/${canvas.id}`)}
      />
    </div>
  );
}
