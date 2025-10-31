'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@alpha/ui/components/badge'
import { Button } from '@alpha/ui/components/button'
import {
  ArrowRight,
  Database,
  Lock,
  BarChart3,
  Layers,
  Shield,
  ExternalLink,
  Bot,
  Wallet,
  Network,
  GitBranch,
  Cpu,
  Zap,
  Sparkles,
  Code,
  CheckCircle2,
} from 'lucide-react'
import { motion } from 'framer-motion'

import type { ReactElement } from 'react'

export default function Page(): ReactElement {
  const appLink = '#' // Chrome extension - no external link

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <Link href="/" className="text-xl font-bold text-foreground">
              Alpha
            </Link>
          </motion.div>
          <nav className="hidden md:flex gap-6">
            {['Features', 'How It Works', 'Context Protocol', 'AI Wallet'].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </nav>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="#install" className="flex items-center gap-1">
                Install Extension <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative z-40 w-full border-b border-border/50 bg-card py-3 text-center"
      >
        <div className="container mx-auto flex items-center justify-center px-4">
          <div className="relative inline-flex items-center rounded-full border border-primary/20 bg-card p-1 shadow-sm">
            <Link href="#hedera" className="flex items-center gap-2.5 px-3 py-1 sm:gap-4">
              <Badge className="rounded-full border-none bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                New
              </Badge>
              <span className="whitespace-nowrap text-sm font-medium text-foreground">
                Built on Hedera Hashgraph Testnet
                <ArrowRight className="ml-1.5 inline h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </motion.div>

      <main className="flex-1">
        <section className="relative w-full overflow-hidden py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col justify-center space-y-6"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Badge variant="secondary" className="mb-4 rounded-full px-4 py-1">
                      <Sparkles className="mr-2 h-3 w-3" />
                      Next-Gen AI Wallet
                    </Badge>
                  </motion.div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl">
                    AI-Powered Wallet with{' '}
                    <span className="text-primary">On-Chain Intelligence</span>
                  </h1>
                  <p className="max-w-[600px] text-lg text-muted-foreground">
                    Alpha combines an AI agent wallet with a decentralized context protocol,
                    enabling AI agents to seamlessly interact with Hedera protocols through
                    standardized frameworks.
                  </p>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col gap-3 min-[400px]:flex-row"
                >
                  <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                    <Link href="#install">
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="#features">Learn More</Link>
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center gap-6 pt-4"
                >
                  {[
                    { icon: CheckCircle2, text: 'AI-Powered' },
                    { icon: Shield, text: 'Secure' },
                    { icon: Zap, text: 'Fast' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <item.icon className="h-4 w-4 text-primary" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="relative mx-auto flex h-[500px] w-full max-w-[500px] items-center justify-center"
              >
                {/* Main central card */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative z-20 flex h-48 w-48 flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-2xl"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-lg font-bold text-foreground">Alpha AI</div>
                    <div className="text-xs text-muted-foreground">Smart Agent</div>
                  </div>
                </motion.div>

                {/* Orbiting elements */}
                {[
                  { icon: Wallet, label: 'Wallet', color: 'text-chart-1', position: 0 },
                  { icon: Network, label: 'Network', color: 'text-chart-2', position: 1 },
                  { icon: Database, label: 'Data', color: 'text-chart-3', position: 2 },
                  { icon: Lock, label: 'Security', color: 'text-chart-4', position: 3 },
                  { icon: Code, label: 'Protocols', color: 'text-chart-5', position: 4 },
                  { icon: Zap, label: 'Speed', color: 'text-chart-1', position: 5 },
                ].map((item, i) => {
                  const angle = i * 60 * (Math.PI / 180)
                  const radius = 180
                  const x = Math.cos(angle) * radius
                  const y = Math.sin(angle) * radius

                  return (
                    <motion.div
                      key={i}
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: i * 0.1,
                      }}
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        marginLeft: '-20px',
                        marginTop: '-20px',
                      }}
                      className="z-10"
                    >
                      <motion.div
                        animate={{
                          rotate: [0, -360],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          rotate: {
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                          },
                          scale: {
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.2,
                          },
                        }}
                        style={{
                          transform: `translate(${x}px, ${y}px)`,
                        }}
                        className="flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card shadow-lg"
                      >
                        <item.icon className={`h-6 w-6 ${item.color}`} />
                      </motion.div>
                    </motion.div>
                  )
                })}

                {/* Connection lines */}
                <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 5 }}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  {Array.from({ length: 6 }).map((_, i) => {
                    const angle = i * 60 * (Math.PI / 180)
                    const radius = 180
                    const x = 250 + Math.cos(angle) * radius
                    const y = 250 + Math.sin(angle) * radius
                    return (
                      <motion.line
                        key={i}
                        x1="250"
                        y1="250"
                        x2={x}
                        y2={y}
                        stroke="url(#lineGradient)"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: i * 0.2,
                        }}
                      />
                    )
                  })}
                </svg>

                {/* Decorative rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-dashed border-primary/20"
                  style={{
                    width: '400px',
                    height: '400px',
                    left: '50%',
                    top: '50%',
                    marginLeft: '-200px',
                    marginTop: '-200px',
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* Floating code snippet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 right-8 hidden rounded-lg border border-border bg-card/80 p-4 backdrop-blur-md shadow-xl md:block"
          >
            <div className="font-mono text-xs text-foreground">
              <div className="text-muted-foreground">{'// Alpha Context'}</div>
              <div>{'{'}</div>
              <div className="ml-4">
                <span className="text-chart-2">protocol</span>:{' '}
                <span className="text-chart-5">"hedera"</span>,
              </div>
              <div className="ml-4">
                <span className="text-chart-2">wallet</span>:{' '}
                <span className="text-chart-5">"ai-powered"</span>
              </div>
              <div>{'}'}</div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="w-full border-t border-border bg-muted/50 py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-3">
                <Badge variant="outline" className="rounded-full">
                  Core Features
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Next-Generation AI Wallet Infrastructure
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-lg">
                  Alpha combines AI agents with blockchain technology to create intelligent,
                  context-aware wallet experiences on Hedera.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-3">
              {[
                {
                  icon: Bot,
                  title: 'AI Agent Wallet',
                  description:
                    'Built-in AI agent powered by LangGraph that understands your intent and helps you interact with Hedera protocols seamlessly.',
                  color: 'text-chart-1',
                },
                {
                  icon: Network,
                  title: 'Context Protocol',
                  description:
                    'Decentralized registry that allows dApp protocols to register their context, enabling AI agents to discover and interact accurately.',
                  color: 'text-chart-2',
                },
                {
                  icon: Shield,
                  title: 'Hedera Native',
                  description:
                    'Built specifically for Hedera Hashgraph, leveraging its fast, secure, and sustainable distributed ledger technology.',
                  color: 'text-chart-3',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full border-t border-border py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-3">
                <Badge variant="outline" className="rounded-full">
                  Technology
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How Alpha Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-lg">
                  Our innovative architecture combines AI agents, smart contracts, and decentralized
                  protocols to create seamless on-chain intelligence.
                </p>
              </div>
            </motion.div>

            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid gap-8 md:grid-cols-2">
                {[
                  {
                    step: '01',
                    title: 'Protocol Registration',
                    description:
                      'dApp developers register their protocols (contracts, services, APIs) in the Alpha Context Protocol, creating a standardized context framework.',
                    icon: Database,
                  },
                  {
                    step: '02',
                    title: 'AI Agent Discovery',
                    description:
                      'The Alpha AI agent uses LangGraph to understand user intent and query the context protocol to discover relevant protocols and their interactions.',
                    icon: Bot,
                  },
                  {
                    step: '03',
                    title: 'Smart Execution',
                    description:
                      'AI agents automatically identify and interact with all subordinate contracts and services, ensuring accurate and complete protocol interactions.',
                    icon: Cpu,
                  },
                  {
                    step: '04',
                    title: 'Seamless Integration',
                    description:
                      'All interactions happen through the Chrome extension wallet, providing a unified interface for managing assets and interacting with protocols.',
                    icon: Wallet,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
                  >
                    <div className="absolute right-4 top-4 text-6xl font-bold text-primary/5 transition-all group-hover:text-primary/10">
                      {item.step}
                    </div>
                    <div className="relative flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-primary">{item.step}</span>
                          <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              id="hedera"
              className="mx-auto mt-20 max-w-4xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-8 md:p-12"
            >
              <div className="flex flex-col items-center space-y-4 text-center">
                <Badge className="rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                  Powered by Hedera
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                  Built on Hedera Hashgraph
                </h2>
                <p className="max-w-[700px] text-muted-foreground">
                  Alpha leverages Hedera's fast, fair, and secure distributed ledger technology.
                  Currently operating on Hedera Testnet, Alpha provides a robust foundation for
                  AI-powered wallet experiences with low fees and high throughput.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  {[
                    { label: 'Fast', icon: Zap },
                    { label: 'Secure', icon: Shield },
                    { label: 'Sustainable', icon: Layers },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2"
                    >
                      <item.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>
        </section>

        <section
          id="context-protocol"
          className="w-full border-t border-border bg-muted/50 py-20 md:py-32"
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-3">
                <Badge variant="outline" className="rounded-full">
                  Context Protocol
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Alpha Context Protocol
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-lg">
                  A decentralized infrastructure layer that enables AI agents to understand and
                  interact with complex protocol ecosystems through standardized context frameworks.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mx-auto mt-12 max-w-3xl"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xl">
                <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Protocol Registration
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="#install">
                      View Docs <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="p-6">
                  <pre className="overflow-x-auto rounded-lg bg-slate-950 p-6 text-sm">
                    <code className="font-mono text-slate-50">
                      <span className="text-slate-500">// Register your protocol</span>
                      <br />
                      <span className="text-pink-400">const</span>{' '}
                      <span className="text-sky-300">protocol</span> = {'{'} <br />
                      &nbsp;&nbsp;<span className="text-violet-400">name</span>:{' '}
                      <span className="text-emerald-400">"MyDeFiProtocol"</span>,
                      <br />
                      &nbsp;&nbsp;<span className="text-violet-400">contracts</span>: [
                      <span className="text-emerald-400">"0x123..."</span>],
                      <br />
                      &nbsp;&nbsp;<span className="text-violet-400">services</span>: [
                      <span className="text-emerald-400">"api.mydefi.com"</span>],
                      <br />
                      &nbsp;&nbsp;<span className="text-violet-400">context</span>: {'{'}{' '}
                      <span className="text-slate-500">...</span> {'}'}
                      <br />
                      {'}'};
                      <br />
                      <br />
                      <span className="text-pink-400">await</span>{' '}
                      <span className="text-sky-300">alphaRegistry</span>.
                      <span className="text-amber-400">register</span>(protocol);
                    </code>
                  </pre>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="ai-wallet" className="w-full border-t border-border py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center"
            >
              <div className="space-y-3">
                <Badge variant="outline" className="rounded-full">
                  Use Cases
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                  What You Can Do With Alpha
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-lg">
                  Discover how Alpha transforms the way you interact with Hedera protocols through
                  AI-powered assistance.
                </p>
              </div>
            </motion.div>
            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Natural Language Transactions',
                  description:
                    'Simply tell Alpha what you want to do - send tokens, swap assets, or interact with smart contracts using plain language.',
                  icon: Bot,
                  color: 'text-chart-1',
                },
                {
                  title: 'Protocol Discovery',
                  description:
                    'AI agents automatically discover and understand complex protocol interactions through the context registry.',
                  icon: Network,
                  color: 'text-chart-2',
                },
                {
                  title: 'Smart Contract Interaction',
                  description:
                    'Interact with multiple related contracts seamlessly - Alpha understands the full protocol ecosystem.',
                  icon: GitBranch,
                  color: 'text-chart-3',
                },
                {
                  title: 'Secure Asset Management',
                  description:
                    'Manage your Hedera assets with AI assistance while maintaining full control of your private keys.',
                  icon: Shield,
                  color: 'text-chart-4',
                },
                {
                  title: 'Developer-Friendly',
                  description:
                    'Register your protocols easily, enabling AI agents to interact with your dApps intelligently.',
                  icon: Cpu,
                  color: 'text-chart-5',
                },
                {
                  title: 'Fast & Efficient',
                  description:
                    'Built on Hedera Hashgraph for lightning-fast transactions with low fees and high throughput.',
                  icon: Zap,
                  color: 'text-chart-1',
                },
              ].map((useCase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative space-y-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                      <useCase.icon className={`h-7 w-7 ${useCase.color}`} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-foreground">{useCase.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {useCase.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="install" className="w-full border-t border-border bg-muted/50 py-20 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col justify-center space-y-6"
                >
                  <div className="space-y-4">
                    <Badge variant="outline" className="rounded-full">
                      Get Started
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                      Start Using Alpha Today
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      Install the Alpha Chrome extension and experience the next generation of
                      AI-powered wallet interactions on Hedera.
                    </p>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Easy Chrome extension installation',
                      'Built-in AI agent for seamless interactions',
                      'Access to Hedera Testnet protocols',
                      'Open source and developer-friendly',
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm text-foreground">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-3 min-[400px]:flex-row"
                  >
                    <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                      <Link href="https://github.com/fullendmaestro/alpha">
                        Download Extension <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link href="https://github.com/fullendmaestro/alpha">
                        View on GitHub <ExternalLink className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-center"
                >
                  <div className="relative h-[400px] w-full overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(var(--primary)/0.1),transparent)]" />
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="flex h-full flex-col items-center justify-center space-y-6"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-xl">
                          <Wallet className="h-16 w-16 text-primary-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2 text-center">
                        <div className="text-2xl font-bold text-foreground">Alpha Wallet</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                          Chrome Extension
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {[Bot, Network, Shield].map((Icon, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
                          >
                            <Icon className="h-5 w-5 text-primary" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border bg-card py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">Alpha</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Next-generation AI wallet and context protocol for Hedera.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Product</h3>
              <ul className="space-y-2 text-sm">
                {['Features', 'How It Works', 'Context Protocol', 'AI Wallet'].map((item) => (
                  <li key={item}>
                    <Link
                      href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Resources</h3>
              <ul className="space-y-2 text-sm">
                {[
                  { label: 'GitHub', href: 'https://github.com/fullendmaestro/alpha' },
                  { label: 'Documentation', href: '#install' },
                  { label: 'Hedera', href: 'https://hedera.com' },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Legal</h3>
              <ul className="space-y-2 text-sm">
                {['Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-center text-sm text-muted-foreground md:text-left">
                &copy; {new Date().getFullYear()} Alpha. All rights reserved. Built on{' '}
                <Link
                  href="https://hedera.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4 hover:text-foreground"
                >
                  Hedera Hashgraph
                </Link>
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="https://github.com/fullendmaestro/alpha"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
