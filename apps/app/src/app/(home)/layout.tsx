import Header from '@/components/global/header'
import Footer from '@/components/global/footer'
import NewsletterSection from '@/components/global/news-letter'

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="font-sans">
      <Header />
      <div className="flex-1">{children}</div>
      <NewsletterSection />
      <Footer />
    </main>
  )
}
