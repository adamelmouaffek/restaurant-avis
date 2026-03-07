import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/shared/lib/supabase/server";
import { getDashboardSession } from "@/shared/lib/dashboard-auth";
import type { OrderWithItems } from "@/shared/types";

// POST : Créer une commande (public — envoyé depuis la table du client)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurant_id, table_number, notes, items } = body;

    // Validation des champs requis
    if (!restaurant_id || !table_number) {
      return NextResponse.json(
        { error: "restaurant_id et table_number sont requis" },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "La commande doit contenir au moins un article" },
        { status: 400 }
      );
    }

    // Validation de la structure de chaque item
    for (const item of items) {
      if (!item.menu_item_id || typeof item.quantity !== "number" || item.quantity < 1) {
        return NextResponse.json(
          { error: "Chaque article doit avoir un menu_item_id et une quantité valide (>= 1)" },
          { status: 400 }
        );
      }
    }

    // Re-fetch des prix depuis la DB — NE JAMAIS faire confiance aux prix du client
    const menuItemIds = items.map((i: { menu_item_id: string }) => i.menu_item_id);

    const { data: menuItems, error: menuError } = await supabaseAdmin
      .from("menu_items")
      .select("id, name, price, is_active, restaurant_id")
      .in("id", menuItemIds);

    if (menuError) {
      return NextResponse.json({ error: menuError.message }, { status: 500 });
    }

    // Vérifier que tous les articles appartiennent bien à ce restaurant et sont actifs
    for (const item of items) {
      const menuItem = menuItems?.find((m) => m.id === item.menu_item_id);
      if (!menuItem) {
        return NextResponse.json(
          { error: `Article introuvable : ${item.menu_item_id}` },
          { status: 400 }
        );
      }
      if (menuItem.restaurant_id !== restaurant_id) {
        return NextResponse.json(
          { error: `L'article ${menuItem.name} n'appartient pas à ce restaurant` },
          { status: 400 }
        );
      }
      if (!menuItem.is_active) {
        return NextResponse.json(
          { error: `L'article ${menuItem.name} n'est plus disponible` },
          { status: 400 }
        );
      }
    }

    // Calcul du total côté serveur
    const totalAmount = items.reduce((sum: number, item: { menu_item_id: string; quantity: number }) => {
      const menuItem = menuItems!.find((m) => m.id === item.menu_item_id)!;
      return sum + menuItem.price * item.quantity;
    }, 0);

    // Insertion de la commande
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        restaurant_id,
        table_number,
        notes: notes ?? null,
        total_amount: totalAmount,
        status: "pending",
        payment_method: "server",
      })
      .select()
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Insertion des order_items
    const orderItemsPayload = items.map((item: { menu_item_id: string; quantity: number; notes?: string }) => {
      const menuItem = menuItems!.find((m) => m.id === item.menu_item_id)!;
      return {
        order_id: order.id,
        menu_item_id: item.menu_item_id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        notes: item.notes ?? null,
      };
    });

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItemsPayload);

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json(
      {
        orderId: order.id,
        tableNumber: order.table_number,
        totalAmount: order.total_amount,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// GET : Lister les commandes d'un restaurant (protégé dashboard)
export async function GET(request: NextRequest) {
  const session = await getDashboardSession();

  if (!session) {
    return NextResponse.json(
      { error: "Non autorisé — connexion au dashboard requise" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get("restaurant_id");
  const status = searchParams.get("status");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 50;

  if (!restaurantId) {
    return NextResponse.json(
      { error: "restaurant_id est requis" },
      { status: 400 }
    );
  }

  // Vérifier que le restaurant appartient bien à la session connectée
  if (session.restaurantId !== restaurantId) {
    return NextResponse.json(
      { error: "Accès non autorisé à ce restaurant" },
      { status: 403 }
    );
  }

  let query = supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data as OrderWithItems[]);
}
