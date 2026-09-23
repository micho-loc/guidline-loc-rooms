"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import Swal from "sweetalert2";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase.from("rooms").select("*").order("sort_order", { ascending: true });
    if (data) setRooms(data);
    setLoading(false);
  }

  const handleAdd = () => {
    setRooms([
      ...rooms,
      { id: "new-" + Date.now(), name: "New Room", ip_address: "192.168.1.1", sort_order: rooms.length + 1, isNew: true },
    ]);
  };

  const handleRemove = async (index: number, id: string) => {
    if (id.startsWith("new-")) {
      setRooms(rooms.filter((_, i) => i !== index));
      return;
    }
    
    const result = await Swal.fire({
      title: "Hapus Ruangan?",
      text: "Data ruangan ini akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0a4c8c",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal"
    });

    if (!result.isConfirmed) return;
    
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.from("rooms").delete().eq("id", id);
    
    Swal.fire({
      title: "Terhapus!",
      text: "Ruangan berhasil dihapus.",
      icon: "success",
      confirmButtonColor: "#0a4c8c",
      timer: 1500,
      showConfirmButton: false
    });
    
    fetchRooms();
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newRooms = [...rooms];
    newRooms[index][field] = value;
    setRooms(newRooms);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      for (const room of rooms) {
        if (room.isNew) {
          await supabase.from("rooms").insert({
            name: room.name,
            ip_address: room.ip_address,
            sort_order: room.sort_order,
          });
        } else {
          await supabase.from("rooms").update({
            name: room.name,
            ip_address: room.ip_address,
            sort_order: room.sort_order,
          }).eq("id", room.id);
        }
      }
      Swal.fire({
        title: "Berhasil!",
        text: "Perubahan ruangan berhasil disimpan.",
        icon: "success",
        confirmButtonColor: "#0a4c8c",
        timer: 1500,
        showConfirmButton: false
      });
      fetchRooms();
    } catch (err: any) {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menyimpan: " + err.message,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
    }
    setSaving(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ocean-50 text-ocean-600 flex items-center justify-center text-lg">
            <i className="fa-solid fa-door-open" />
          </div>
          <h2 className="text-2xl font-display font-bold text-ocean-800">Rooms Setup</h2>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-white border border-slate-200 text-ocean-700 hover:border-ocean-400 hover:bg-ocean-50/50 font-bold rounded-xl text-sm transition-all shadow-sm flex items-center"
        >
          <i className="fa-solid fa-plus mr-2" /> Tambah Ruangan
        </button>
      </div>

      <div className="space-y-4">
        {rooms.map((room, index) => (
          <div key={room.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-200 rounded-2xl items-start sm:items-center bg-slate-50/50">
            <div className="w-16">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Urutan</label>
              <input
                type="number"
                value={room.sort_order}
                onChange={(e) => handleChange(index, "sort_order", parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Ruangan</label>
              <input
                type="text"
                value={room.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1">IP Address</label>
              <input
                type="text"
                value={room.ip_address}
                onChange={(e) => handleChange(index, "ip_address", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
              />
            </div>
            <div className="pt-5">
              <button
                onClick={() => handleRemove(index, room.id)}
                className="w-9 h-9 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                title="Hapus"
              >
                <i className="fa-solid fa-trash-can text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-6 mt-6 border-t border-slate-100">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-ocean-600 hover:bg-ocean-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-70"
        >
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
}
