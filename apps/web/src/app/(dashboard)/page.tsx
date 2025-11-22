import { update_session } from '../(auth)/action'
import Home from './components/home'

const HomePage = async (props: PageProps<'/'>) => {
  const searchParams = await props.searchParams

  if (searchParams?.verified === 'true') {
    await update_session()
  }

  return <Home />
}

export default HomePage
