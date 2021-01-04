import Link from 'next/link';
import "./style.scss"

const HomeContainer = () => {
  return (
    <div className="container">
      <h1>Hello Next.js 👋</h1>
      <div className="container__inner">
        <p>
          <Link href="/about">
            <a>About</a>
          </Link>
        </p>
      </div>
    </div>
  )
}


export { HomeContainer }
