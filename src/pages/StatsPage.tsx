import { useNavigate } from 'react-router-dom';
import StatisticsView from '../components/StatisticsView';

export default function StatsPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return <StatisticsView onBack={handleBack} />;
}
