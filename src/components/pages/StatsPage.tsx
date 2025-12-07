import StatisticsView from '~/components/StatisticsView'

export default function StatsPage() {
  const handleBack = () => {
    window.location.href = '/'
  }

  return <StatisticsView onBack={handleBack} />
}
