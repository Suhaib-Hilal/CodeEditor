import Link from 'next/link'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <p className={styles.title}>Make something great.</p>
      <p className={styles.subtitle}>
        Build software collaboratively with the power of AI, on any
        <br></br>device, without spending a second on setup
      </p>
      <Link href="/sign-up" className={styles.btn}>
        Start creating
      </Link>
    </main>
  )
}
