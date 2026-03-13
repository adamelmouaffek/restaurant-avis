"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  Star,
  QrCode,
  Gift,
  BarChart3,
  Globe,
  Shield,
  Check,
  ArrowRight,
  Sparkles,
  UtensilsCrossed,
  MonitorSmartphone,
  LayoutDashboard,
  ExternalLink,
  ChevronDown,
  X as XIcon,
  TrendingUp,
  Clock,
  Users,
  Zap,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedCounter,
  TextReveal,
  GradientBackground,
} from "@/shared/components/animations";

// ─── Sticky CTA Bar ────────────────────────────────────────
function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[60] bg-white/90 backdrop-blur-lg border-b shadow-sm"
        >
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm hidden sm:inline">Restaurant Avis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline">
                +50 avis Google en 60 jours
              </span>
              <Link href="/r/la-belle-assiette">
                <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 text-sm">
                  <Sparkles className="w-4 h-4 mr-1" />
                  Tester la demo
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── FAQ Accordion ─────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="border-b border-gray-100 last:border-0"
      initial={false}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="font-medium text-gray-900 pr-4 group-hover:text-amber-600 transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-muted-foreground leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────
export default function Home() {
  const { scrollYProgress } = useScroll();
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-600 z-[70] origin-left"
        style={{ scaleX: scaleProgress }}
      />

      <StickyCTA />

      {/* ─── Header ───────────────────────────────────── */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Restaurant Avis</span>
          </motion.div>
          <motion.div
            className="flex items-center gap-1 sm:gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link href="/m/la-belle-assiette/table/1">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3 hidden md:inline-flex">
                Menu
              </Button>
            </Link>
            <Link href="/kds/la-belle-assiette">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3 hidden md:inline-flex">
                KDS
              </Button>
            </Link>
            <Link href="/dashboard/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                Dashboard
              </Button>
            </Link>
            <Link href="/r/la-belle-assiette">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 text-xs sm:text-sm px-2 sm:px-3">
                Demo Avis
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="relative py-24 sm:py-36 px-4 sm:px-6 overflow-hidden">
        <GradientBackground />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn delay={0.1}>
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5 shadow-sm">
              +50 avis Google en 60 jours — Garanti
            </Badge>
          </FadeIn>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            <TextReveal
              text="Multipliez vos avis Google"
              delay={0.3}
            />
            <br />
            <TextReveal
              text="par 6 en 30 jours"
              delay={0.8}
              highlightWords={["par", "6", "en", "30", "jours"]}
            />
          </h1>

          <FadeIn delay={1.2}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              La roue cadeaux qui transforme chaque client en ambassadeur.
              Avis authentiques, verifies par Google OAuth. Zero faux avis.
            </p>
          </FadeIn>

          <FadeIn delay={1.5}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/r/la-belle-assiette">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 text-lg px-8 h-12 w-full sm:w-auto shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-shadow"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Tester la demo
                  </Button>
                </motion.div>
              </Link>
              <a href="#tarifs">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" size="lg" className="text-lg px-8 h-12 w-full sm:w-auto">
                    Decouvrir nos offres
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Social Proof Bar ─────────────────────────── */}
      <section className="py-10 px-4 border-y bg-gray-50/50">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Ils nous font confiance
            </p>
          </FadeIn>
          <StaggerContainer className="flex flex-wrap justify-center items-center gap-8 sm:gap-12" stagger={0.1}>
            {[
              { value: 50, suffix: "+", label: "Restaurants" },
              { value: 6, suffix: "x", label: "Plus d'avis" },
              { value: 98, suffix: "%", label: "Satisfaction" },
              { value: 30, suffix: "j", label: "Resultats visibles" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={1.5}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Acces rapide ─────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-3">
              Acces rapide
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
              Testez toutes les fonctionnalites de la plateforme
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" stagger={0.08}>
            {[
              { href: "/r/la-belle-assiette", icon: Gift, title: "Roue Cadeaux + Avis", desc: "Parcours client complet : avis, roue, cadeau", color: "amber", label: "Tester" },
              { href: "/m/la-belle-assiette/table/1", icon: UtensilsCrossed, title: "Menu Digital", desc: "Menu QR, panier, commande depuis la table", color: "orange", label: "Tester" },
              { href: "/kds/la-belle-assiette", icon: MonitorSmartphone, title: "Ecran Cuisine (KDS)", desc: "Commandes en temps reel, gestion des statuts", color: "blue", label: "Tester" },
              { href: "/dashboard", icon: LayoutDashboard, title: "Dashboard Gerant", desc: "Menu, commandes, avis, QR codes, stats", color: "green", label: "Acceder" },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <Link href={item.href} className="group block h-full">
                  <motion.div
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="h-full border hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                        <motion.div
                          className={`w-12 h-12 rounded-xl bg-${item.color}-50 flex items-center justify-center`}
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          <item.icon className={`w-6 h-6 text-${item.color}-600`} />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <span className={`text-xs text-${item.color}-600 font-medium flex items-center gap-1`}>
                          {item.label} <ExternalLink className="w-3 h-3" />
                        </span>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Comment ca marche ────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-4">
              Comment ca marche ?
            </h2>
            <p className="text-muted-foreground text-center mb-14 max-w-xl mx-auto">
              Un parcours simple en 4 etapes qui transforme chaque repas en avis Google
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" stagger={0.15}>
            {[
              { step: "1", icon: QrCode, title: "Scannez le QR code", desc: "Le client scanne le QR code sur sa table avec son telephone" },
              { step: "2", icon: Star, title: "Laissez un avis", desc: "Il se connecte avec Google et laisse un avis authentifie" },
              { step: "3", icon: Gift, title: "Tournez la roue", desc: "Il tourne la roue de cadeaux et decouvre son lot" },
              { step: "4", icon: Sparkles, title: "Gagnez un cadeau", desc: "Il presente son ecran au serveur pour recevoir son cadeau" },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="text-sm font-bold text-amber-600 mb-1">
                    Etape {item.step}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Bento Features Grid ──────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              Une suite complete pour booster votre reputation en ligne
            </p>
          </FadeIn>

          <StaggerContainer
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            stagger={0.08}
          >
            {[
              { icon: Star, title: "Avis authentifies", desc: "Connexion Google OAuth obligatoire. Chaque avis est lie a un vrai compte.", gradient: "from-yellow-500/10 to-amber-500/10" },
              { icon: Gift, title: "Roue de cadeaux", desc: "Configurez vos lots et probabilites. Motivez vos clients a laisser un avis.", gradient: "from-orange-500/10 to-red-500/10" },
              { icon: QrCode, title: "QR codes par table", desc: "Generez un QR code pour chaque table. Vos clients scannent et participent.", gradient: "from-blue-500/10 to-indigo-500/10" },
              { icon: BarChart3, title: "Dashboard complet", desc: "Suivez vos avis, participations et statistiques en temps reel.", gradient: "from-green-500/10 to-emerald-500/10" },
              { icon: Shield, title: "Anti-abus integre", desc: "1 seule participation par client par restaurant. Zero triche.", gradient: "from-purple-500/10 to-pink-500/10" },
              { icon: Globe, title: "Conforme DGCCRF", desc: "Le cadeau n'est pas conditionne a une note positive. 100% legal.", gradient: "from-teal-500/10 to-cyan-500/10" },
            ].map((feature) => (
              <StaggerItem key={feature.title}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="border bg-white hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden group relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <CardContent className="pt-6 relative">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.4 }}
                      >
                        <feature.icon className="w-10 h-10 text-amber-600 mb-4" />
                      </motion.div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Comparison: Avant / Apres ────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-4">
              Avant vs. Avec Restaurant Avis
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
              La difference est claire en quelques semaines
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="border-red-200 bg-red-50/50 h-full">
                  <CardHeader>
                    <CardTitle className="text-lg text-red-700 flex items-center gap-2">
                      <XIcon className="w-5 h-5" />
                      Sans Restaurant Avis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "2-3 avis Google par mois",
                        "Aucun controle sur la reputation",
                        "Pas de motivation client",
                        "Zero donnees exploitables",
                        "Dependance aux plateformes",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-red-800">
                          <XIcon className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="border-green-200 bg-green-50/50 h-full">
                  <CardHeader>
                    <CardTitle className="text-lg text-green-700 flex items-center gap-2">
                      <Check className="w-5 h-5" />
                      Avec Restaurant Avis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "15-20 avis Google par mois",
                        "Dashboard de suivi en temps reel",
                        "Roue cadeaux = motivation naturelle",
                        "Donnees clients exploitables",
                        "Votre propre ecosysteme digital",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-green-800">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Stats Impact ─────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-amber-500 to-orange-600">
        <div className="max-w-5xl mx-auto">
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-8" stagger={0.1}>
            {[
              { icon: TrendingUp, value: 6, suffix: "x", label: "Plus d'avis Google" },
              { icon: Clock, value: 30, suffix: "j", label: "Pour voir les resultats" },
              { icon: Users, value: 98, suffix: "%", label: "Clients satisfaits" },
              { icon: Zap, value: 5, suffix: "min", label: "Pour s'installer" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center text-white">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 opacity-80" />
                  <div className="text-3xl sm:text-4xl font-bold">
                    <AnimatedCounter
                      target={stat.value}
                      suffix={stat.suffix}
                      duration={1.5}
                      className="text-white"
                    />
                  </div>
                  <p className="text-sm text-white/80 mt-1">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ─── Tarifs ───────────────────────────────────── */}
      <section id="tarifs" className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-4">Nos offres</h2>
            <p className="text-muted-foreground text-center mb-12">
              Paiement unique — Pas d&apos;abonnement cache
            </p>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8" stagger={0.15}>
            <StaggerItem>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="border bg-white h-full">
                  <CardHeader>
                    <CardTitle className="text-xl">Essentiel</CardTitle>
                    <CardDescription>
                      L&apos;indispensable pour demarrer
                    </CardDescription>
                    <div className="pt-2">
                      <span className="text-3xl sm:text-4xl font-bold">1 490</span>
                      <span className="text-muted-foreground ml-1">EUR HT</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Menu QR + Commande + Paiement",
                        "Site web SEO (5 pages)",
                        "Google Maps GMB optimise",
                        "Formation gerant 1h (Zoom)",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" className="w-full">
                        Nous contacter
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </StaggerItem>

            <StaggerItem>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                <Card className="border-2 border-amber-500 bg-white relative h-full">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 px-4">
                      Recommande
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl">Tout-en-un</CardTitle>
                    <CardDescription>
                      La suite complete pour dominer Google
                    </CardDescription>
                    <div className="pt-2">
                      <span className="text-3xl sm:text-4xl font-bold">2 990</span>
                      <span className="text-muted-foreground ml-1">EUR HT</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {[
                        "Tout l'Essentiel +",
                        "Roue Cadeaux (OAuth Google)",
                        "Campagnes Google Ads (SEA)",
                        "Reseaux Sociaux (Instagram, Facebook, TikTok)",
                        "Maintenance 3 mois incluse",
                        "Site SEO 10 pages",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <motion.div className="w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 shadow-lg shadow-amber-500/25">
                        Nous contacter
                      </Button>
                    </motion.div>
                  </CardFooter>
                </Card>
              </motion.div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ─── FAQ ───────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-4">
              Questions frequentes
            </h2>
            <p className="text-muted-foreground text-center mb-12">
              Tout ce que vous devez savoir
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Card className="border bg-white">
              <CardContent className="p-6 sm:p-8">
                {[
                  {
                    question: "Est-ce difficile a installer ?",
                    answer: "Non, l'installation prend 5 minutes. Vous recevez un QR code par table a imprimer, et votre dashboard est pret immediatement. Aucun materiel supplementaire requis.",
                  },
                  {
                    question: "Le cadeau est-il conditionne a une note positive ?",
                    answer: "Non, jamais. Conformement a la DGCCRF, chaque client tourne la roue quel que soit sa note. C'est ce qui rend les avis 100% authentiques et legaux.",
                  },
                  {
                    question: "Mon personnel a-t-il besoin d'etre forme ?",
                    answer: "Le systeme est intuitif : le client scanne, donne son avis, tourne la roue. Votre equipe n'a qu'a verifier l'ecran du gagnant. Une formation de 15 minutes suffit.",
                  },
                  {
                    question: "Puis-je personnaliser les cadeaux ?",
                    answer: "Oui, entierement. Vous definissez les lots (cafe offert, dessert, reduction...), leur probabilite d'apparition et le nombre total disponible depuis le dashboard.",
                  },
                  {
                    question: "Que se passe-t-il apres les 3 mois de maintenance ?",
                    answer: "Votre systeme continue de fonctionner normalement. La maintenance couvre les mises a jour et le support technique. Apres, vous pouvez renouveler a tarif reduit.",
                  },
                  {
                    question: "Les avis vont-ils directement sur Google ?",
                    answer: "Le systeme verifie l'identite via Google OAuth et redirige le client vers Google Maps pour y deposer son avis. Vous suivez tout depuis le dashboard.",
                  },
                ].map((faq) => (
                  <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* ─── CTA Final ────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        <GradientBackground />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pret a multiplier vos avis Google ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Rejoignez les restaurants qui transforment chaque repas en avis 5 etoiles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/r/la-belle-assiette">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 text-lg px-8 h-12 w-full sm:w-auto shadow-lg shadow-amber-500/25"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Essayer gratuitement
                  </Button>
                </motion.div>
              </Link>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button variant="outline" size="lg" className="text-lg px-8 h-12 w-full sm:w-auto">
                  <Phone className="w-5 h-5 mr-2" />
                  Nous contacter
                </Button>
              </motion.div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────── */}
      <footer className="py-12 px-4 sm:px-6 bg-foreground text-background">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
            <FadeIn direction="right">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-lg">Restaurant Avis</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-xs">
                  La suite digitale tout-en-un pour les restaurants, hotels, cafes et bars.
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="left" delay={0.1}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Produit</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/r/la-belle-assiette" className="hover:text-background transition-colors">Demo</Link></li>
                    <li><a href="#tarifs" className="hover:text-background transition-colors">Tarifs</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Legal</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><span className="hover:text-background transition-colors cursor-pointer">Mentions legales</span></li>
                    <li><span className="hover:text-background transition-colors cursor-pointer">Confidentialite</span></li>
                  </ul>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <h4 className="font-semibold mb-3 text-sm">Contact</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> contact@restaurant-avis.fr</li>
                    <li className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Paris, France</li>
                  </ul>
                </div>
              </div>
            </FadeIn>
          </div>
          <div className="border-t border-muted-foreground/20 my-8" />
          <p className="text-sm text-muted-foreground text-center">
            &copy; 2026 Restaurant Avis — Adam EL MOUAFFEK. Tous droits reserves.
          </p>
        </div>
      </footer>
    </div>
  );
}
