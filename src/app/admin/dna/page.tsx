"use client";

import { useEffect, useState } from "react";
import type { DnaOrder } from "@/lib/supabase/types";

export default function AdminDnaPage() {
  const [orders, setOrders] = useState<DnaOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/dna-orders");
    const json = await res.json();
    if (json.success) setOrders(json.data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/dna-orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  return (
    <div>
      <h1 className="admin-page-title">DNA orders</h1>
      {loading ? (
        <p>Loading…</p>
      ) : orders.length === 0 ? (
        <p>No DNA orders yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Panel</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.panel_name}</td>
                <td>{order.status}</td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  {order.status !== "delivered" && (
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(
                          order.id,
                          order.status === "ordered"
                            ? "collected"
                            : order.status === "collected"
                              ? "processing"
                              : order.status === "processing"
                                ? "ready"
                                : "delivered",
                        )
                      }
                    >
                      Advance
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
