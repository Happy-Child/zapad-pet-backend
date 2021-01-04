import Link from 'next/link'
import Layout from '../components/Layout'

const IndexPage = ({ json: { test } }: { json: { test: string } }) => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js</h1>
      <strong>{test}</strong>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </Layout>
  )
}

IndexPage.getInitialProps = async () => {
  const result = await fetch('https://zapad-pet-backend.herokuapp.com/');
  const json = await result.json();
  return { json };
};

export default IndexPage
