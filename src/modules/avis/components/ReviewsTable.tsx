"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Star } from "lucide-react";

interface ReviewWithParticipant {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  participants: {
    name: string | null;
    email: string;
  } | null;
}

interface ReviewsTableProps {
  restaurantId: string;
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

export function ReviewsTable({ restaurantId }: ReviewsTableProps) {
  const [reviews, setReviews] = useState<ReviewWithParticipant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/avis/reviews?restaurant_id=${restaurantId}`
      );
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Chargement...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Avis</h1>
        <p className="text-muted-foreground mt-1">
          Tous les avis de vos clients
        </p>
      </div>

      {/* Average rating */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {avgRating > 0 ? avgRating.toFixed(1) : "--"} / 5
              </p>
              <p className="text-sm text-muted-foreground">
                Note moyenne sur {reviews.length} avis
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews table */}
      {reviews.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucun avis pour le moment.
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Liste des avis</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Client
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Note
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">
                    Commentaire
                  </th>
                </tr>
              </thead>
              <tbody>
                {reviews
                  .sort(
                    (a, b) =>
                      new Date(b.created_at).getTime() -
                      new Date(a.created_at).getTime()
                  )
                  .map((review) => (
                    <tr
                      key={review.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(review.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td className="p-4 text-sm font-medium">
                        {review.participants?.name ||
                          review.participants?.email ||
                          "Anonyme"}
                      </td>
                      <td className="p-4">
                        <StarDisplay rating={review.rating} />
                      </td>
                      <td className="p-4 text-sm text-muted-foreground hidden md:table-cell max-w-[300px] truncate">
                        {review.comment || "--"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
