import Link from "next/link";
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
import { Separator } from "@/shared/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg">Restaurant Avis</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/dashboard/login">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm px-2 sm:px-3">
                Espace gerant
              </Button>
            </Link>
            <Link href="/r/la-belle-assiette">
              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 text-xs sm:text-sm px-2 sm:px-3">
                Voir la demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 text-sm px-4 py-1">
            +50 avis Google en 60 jours — Garanti
          </Badge>
          <h1 className="text-3xl sm:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
            Multipliez vos avis Google{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              par 6 en 30 jours
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            La roue cadeaux qui transforme chaque client en ambassadeur.
            Avis authentiques, verifies par Google OAuth. Zero faux avis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/r/la-belle-assiette">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0 text-lg px-8 h-12 w-full sm:w-auto"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Tester la demo
              </Button>
            </Link>
            <a href="#tarifs">
              <Button variant="outline" size="lg" className="text-lg px-8 h-12 w-full sm:w-auto">
                Decouvrir nos offres
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Separator />

      {/* Comment ca marche */}
      <section className="py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Comment ca marche ?
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Un parcours simple en 4 etapes qui transforme chaque repas en avis Google
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                icon: QrCode,
                title: "Scannez le QR code",
                desc: "Le client scanne le QR code sur sa table avec son telephone",
              },
              {
                step: "2",
                icon: Star,
                title: "Laissez un avis",
                desc: "Il se connecte avec Google et laisse un avis authentifie",
              },
              {
                step: "3",
                icon: Gift,
                title: "Tournez la roue",
                desc: "Il tourne la roue de cadeaux et decouvre son lot",
              },
              {
                step: "4",
                icon: Sparkles,
                title: "Gagnez un cadeau",
                desc: "Il presente son ecran au serveur pour recevoir son cadeau",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div className="text-sm font-bold text-amber-600 mb-1">
                  Etape {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tout ce dont vous avez besoin
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Star,
                title: "Avis authentifies",
                desc: "Connexion Google OAuth obligatoire. Chaque avis est lie a un vrai compte.",
              },
              {
                icon: Gift,
                title: "Roue de cadeaux",
                desc: "Configurez vos lots et probabilites. Motivez vos clients a laisser un avis.",
              },
              {
                icon: QrCode,
                title: "QR codes par table",
                desc: "Generez un QR code pour chaque table. Vos clients scannent et participent.",
              },
              {
                icon: BarChart3,
                title: "Dashboard complet",
                desc: "Suivez vos avis, participations et statistiques en temps reel.",
              },
              {
                icon: Shield,
                title: "Anti-abus integre",
                desc: "1 seule participation par client par restaurant. Zero triche.",
              },
              {
                icon: Globe,
                title: "Conforme DGCCRF",
                desc: "Le cadeau n'est pas conditionne a une note positive. 100% legal.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="border bg-white">
                <CardContent className="pt-6">
                  <feature.icon className="w-10 h-10 text-amber-600 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Tarifs */}
      <section id="tarifs" className="py-20 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Nos offres</h2>
          <p className="text-muted-foreground text-center mb-12">
            Paiement unique — Pas d&apos;abonnement cache
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Essentiel */}
            <Card className="border bg-white">
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
                <Button variant="outline" className="w-full">
                  Nous contacter
                </Button>
              </CardFooter>
            </Card>

            {/* Tout-en-un */}
            <Card className="border-2 border-amber-500 bg-white relative">
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
                <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white border-0">
                  Nous contacter
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 bg-foreground text-background">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
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
                  <li>Paris, France</li>
                  <li className="break-all">contact@restaurant-avis.fr</li>
                </ul>
              </div>
            </div>
          </div>
          <Separator className="my-8 bg-muted-foreground/20" />
          <p className="text-sm text-muted-foreground text-center">
            &copy; 2026 Restaurant Avis — Adam EL MOUAFFEK. Tous droits reserves.
          </p>
        </div>
      </footer>
    </div>
  );
}
