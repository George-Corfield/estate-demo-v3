import useIsMobile from '../../hooks/useIsMobile'
import OverviewPageDesktop from './OverviewPageDesktop'
import OverviewPageMobile from './OverviewPageMobile'

export default function OverviewPage() {
  const isMobile = useIsMobile()
  return isMobile ? <OverviewPageMobile /> : <OverviewPageDesktop />
}
