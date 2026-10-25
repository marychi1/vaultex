'use client'

import { useState } from 'react'
import Link from 'next/link'

const NAV = [
  ['Buy Crypto', '/onramp'],
  ['Cards', '/cards'],
  ['KYC', '/kyc'],
  ['Support', '/support'],
  ['Legal', '/legal'],
  ['Dashboard', '/dashboard'],
]

const FEATURES = [
  {
    name: 'Smart Wallet',
    desc: 'Create and manage a wallet for your digital assets.',
    status: 'Coming soon',
  },
  {
    name: 'Token Swap',
    desc: 'Swap 200+ tokens and find competitive rates.',
    status: 'Explore',
    href: '/dashboard',
  },
  {
    name: 'Virtual Cards',
    desc: 'Spend crypto anywhere with a virtual card.',
    status: 'Explore',
    href: '/cards',
  },
  {
    name: 'DeFi Yields',
    desc: 'Explore yield strategies from your dashboard.',
    status: 'Explore',
    href: '/dashboard',
  },
  {
    name: 'Buy Crypto',
    desc: 'Purchase crypto using card, bank, or Apple Pay.',
    status: 'Explore',
    href: '/onramp',
  },
  {
    name: 'KYC Verification',
    desc: 'Complete identity verification to access services.',
    status: 'Explore',
    href: '/kyc',
  },
]

const STATS = [
  ['$4.2B+', 'Assets Managed'],
  ['2.1M+', 'Active Users'],
  ['150+', 'Countries'],
  ['40+', 'Blockchains'],
]

const FOOTER_LINKS = [
  ['Terms', '/legal/terms'],
  ['Privacy', '/legal/privacy'],
  ['AML Policy', '/legal/aml'],
  ['Cookies', '/legal/cookies'],
  ['Support', '/support'],
  ['Legal', '/legal'],
]

export default function Home() {
  const [notifShown, setNotifShown] = useState(false)

  const requestNotifs = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setNotifShown(true)
        new Notification('VAULTEX', {
          body: 'Push notifications enabled! 🎉',
          icon: '/icons/icon.svg',
        })
      }
    }
  }

  return (
    <main className="page">
      <header className="nav">
        <Link className="brand" href="/" aria-label="VAULTEX home">
          VAULT<span>EX</span>
        </Link>
        <nav aria-label="Main navigation">
          {NAV.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">Your digital assets, in one place</p>
        <h1>Manage your digital wealth with confidence.</h1>
        <p>
          Explore crypto services, virtual cards, and tools for managing your
          digital assets from a single platform.
        </p>
        <div className="actions">
          <a className="cta" href="/dashboard">
            OPEN DASHBOARD
          </a>
          <a className="secondary" href="/onramp">
            BUY CRYPTO
          </a>
          <button
            className="secondary notification-button"
            type="button"
            onClick={requestNotifs}
          >
            {notifShown ? '🔔 ENABLED' : '🔔 NOTIFICATIONS'}
          </button>
        </div>

        <div className="stats" aria-label="Platform statistics">
          {STATS.map(([value, label]) => (
            <div className="stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="features-heading">
        <div className="section-heading">
          <p className="eyebrow">Explore VAULTEX</p>
          <h2 id="features-heading">Tools for your digital assets</h2>
        </div>
        <div className="grid">
          {FEATURES.map((feature, index) => {
            const content = (
              <>
                <span className="badge" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{feature.name}</h3>
                <p>{feature.desc}</p>
                <span className="tag">{feature.status}</span>
              </>
            )

            return feature.href ? (
              <a className="card feature-card" href={feature.href} key={feature.name}>
                {content}
              </a>
            ) : (
              <article className="card feature-card" key={feature.name}>
                {content}
              </article>
            )
          })}
        </div>
      </section>

      <section className="section install-section">
        <div className="install-card">
          <div>
            <h2>Install the VAULTEX app</h2>
            <p>
              Add VAULTEX to your home screen for quick access. No app store
              needed.
            </p>
          </div>
          <a className="cta" href="/manifest.json">
            INSTALL APP
          </a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-links">
          {FOOTER_LINKS.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </div>
        <p>
          © 2025 VAULTEX Inc. · Singapore · Not financial advice · Crypto
          carries risk
        </p>
      </footer>
    </main>
  )
}
