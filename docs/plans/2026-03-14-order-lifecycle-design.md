# Regles metier — Cycle de vie des commandes

> Document de reference pour le cycle de vie des commandes dans Restaurant Avis.
> Date : 2026-03-14

---

## 11 etats

| # | Etat | Type | Description |
|---|------|------|-------------|
| 1 | `pending` | Initial | Commande recue, attend confirmation cuisine |
| 2 | `confirmed` | Actif | Cuisine a confirme, va commencer |
| 3 | `modification_requested` | Actif | Modification demandee, cuisine doit valider |
| 4 | `preparing` | Actif | En cours de preparation |
| 5 | `partially_ready` | Actif | Certains items prets, d'autres en prep |
| 6 | `ready` | Actif | Tout est pret, a servir |
| 7 | `delivered` | Post-service | Servie au client |
| 8 | `awaiting_payment` | Post-service | Attend le paiement |
| 9 | `paid` | Terminal | Payee — fin du cycle |
| 10 | `rejected` | Echec | Cuisine a refuse |
| 11 | `cancelled` | Terminal | Annulee |

---

## Diagramme de transitions

```
CLIENT commande
       |
       v
   [pending] ──→ [confirmed] ──→ [preparing] ──→ [partially_ready] ──→ [ready]
       |              |                                                    |
       |              ├──→ [modification_requested] ──→ [confirmed]       |
       |              |                             ──→ [rejected]         |
       |              ├──→ [rejected] ──→ [pending] (re-soumission)       |
       |              └──→ [cancelled]                                    |
       ├──→ [rejected]                                                    v
       └──→ [cancelled]                                              [delivered]
                                                                          |
                                                                          v
                                                                 [awaiting_payment]
                                                                          |
                                                                          v
                                                                       [paid]
```

---

## Matrice de permissions

| Transition | Client | Serveur | Cuisine (KDS) | Dashboard |
|------------|:------:|:-------:|:-------------:|:---------:|
| pending → confirmed | | | X | X |
| pending → rejected | | X | X | X |
| pending → cancelled | **X** | X | | X |
| confirmed → preparing | | | X | |
| confirmed → modification_requested | | X | | X |
| confirmed → rejected | | X | X | X |
| confirmed → cancelled | | X | | X |
| modification_requested → confirmed | | | X | X |
| modification_requested → rejected | | | X | X |
| modification_requested → cancelled | | X | | X |
| preparing → partially_ready | | | X | |
| preparing → ready | | | X | |
| partially_ready → ready | | | X | |
| ready → delivered | | X | | X |
| delivered → awaiting_payment | | X | | X |
| awaiting_payment → paid | | X | | X |
| rejected → pending | | | | X |

---

## Principes

1. **Client** : peut SEULEMENT annuler sa commande en `pending`
2. **Cuisine (KDS)** : gere le flow de production (confirmer → preparer → pret). Ne sert PAS et ne gere PAS le paiement
3. **Serveur** : interface avec le client (servir, paiement, modifications, annulations). Ne lance PAS la preparation
4. **Dashboard (proprietaire)** : supervision totale sauf lancer la preparation (c'est le role de la cuisine)

---

## Implementation technique

- Source unique : `src/shared/lib/order-rules.ts`
- Fonctions : `canTransition()`, `validateTransition()`, `getNextStatuses()`
- Les 3 endpoints PATCH importent `order-rules.ts` avec le role correspondant
- Annulation client : `POST /api/menu/orders/[id]/cancel`
