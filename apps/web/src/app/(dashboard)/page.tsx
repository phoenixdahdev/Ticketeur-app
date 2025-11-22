import Home from './components/home'

const HomePage = async (props: PageProps<'/'>) => {
  const searchParams = await props.searchParams
  const isVerified = searchParams?.verified === 'true'
  const userId = searchParams.userId
  return <Home isVerified={isVerified} userId={userId as string} />
}

export default HomePage
