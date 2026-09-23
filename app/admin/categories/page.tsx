"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import Swal from "sweetalert2";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase.from("categories").select("*").order("sort_order", { ascending: true });
    if (data) setCategories(data);
    setLoading(false);
  }

  const handleAdd = () => {
    setCategories([
      ...categories,
      { 
        id: "new-" + Date.now(), 
        slug: "new-category", 
        icon: "fa-circle-info", 
        sort_order: categories.length + 1, 
        title_id: "Kategori Baru", 
        title_en: "New Category", 
        title_ja: "新しいカテゴリ",
        description_id: "Deskripsi kategori",
        description_en: "Category description",
        description_ja: "カテゴリの説明",
        isNew: true 
      },
    ]);
  };

  const handleRemove = async (index: number, id: string) => {
    if (id.startsWith("new-")) {
      setCategories(categories.filter((_, i) => i !== index));
      return;
    }
    
    const result = await Swal.fire({
      title: "Hapus Kategori?",
      text: "Kategori ini akan dihapus secara permanen.",
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
    await supabase.from("categories").delete().eq("id", id);
    
    Swal.fire({
      title: "Terhapus!",
      text: "Kategori berhasil dihapus.",
      icon: "success",
      confirmButtonColor: "#0a4c8c",
      timer: 1500,
      showConfirmButton: false
    });
    
    fetchCategories();
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newCats = [...categories];
    newCats[index][field] = value;
    setCategories(newCats);
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      for (const cat of categories) {
        const payload = {
          slug: cat.slug,
          icon: cat.icon,
          sort_order: cat.sort_order,
          title_id: cat.title_id,
          title_en: cat.title_en,
          title_ja: cat.title_ja,
          description_id: cat.description_id,
          description_en: cat.description_en,
          description_ja: cat.description_ja,
        };

        if (cat.isNew) {
          await supabase.from("categories").insert(payload);
        } else {
          await supabase.from("categories").update(payload).eq("id", cat.id);
        }
      }
      Swal.fire({
        title: "Berhasil!",
        text: "Perubahan kategori berhasil disimpan.",
        icon: "success",
        confirmButtonColor: "#0a4c8c",
        timer: 1500,
        showConfirmButton: false
      });
      fetchCategories();
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
            <i className="fa-solid fa-layer-group" />
          </div>
          <h2 className="text-2xl font-display font-bold text-ocean-800">Categories</h2>
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-white border border-slate-200 text-ocean-700 hover:border-ocean-400 hover:bg-ocean-50/50 font-bold rounded-xl text-sm transition-all shadow-sm flex items-center"
        >
          <i className="fa-solid fa-plus mr-2" /> Tambah Kategori
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((cat, index) => (
          <div key={cat.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/30">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Urutan</label>
                  <input
                    type="number"
                    value={cat.sort_order}
                    onChange={(e) => handleChange(index, "sort_order", parseInt(e.target.value))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none text-sm"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    value={cat.slug}
                    onChange={(e) => handleChange(index, "slug", e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none text-sm"
                  />
                </div>
                <div className="w-32">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Icon (FA)</label>
                  <div className="flex items-center gap-2">
                    <i className={`fa-solid ${cat.icon} text-ocean-600 w-4 text-center`} />
                    <input
                      type="text"
                      value={cat.icon}
                      onChange={(e) => handleChange(index, "icon", e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none text-sm"
                      placeholder="fa-wifi"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleRemove(index, cat.id)}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors"
              >
                <i className="fa-solid fa-trash-can mr-1.5" /> Hapus
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-ocean-700 bg-ocean-50 px-2 py-1 rounded">Bahasa Indonesia</label>
                <input
                  type="text"
                  value={cat.title_id}
                  onChange={(e) => handleChange(index, "title_id", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-semibold"
                  placeholder="Judul"
                />
                <textarea
                  value={cat.description_id}
                  onChange={(e) => handleChange(index, "description_id", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                  placeholder="Deskripsi"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">English</label>
                <input
                  type="text"
                  value={cat.title_en}
                  onChange={(e) => handleChange(index, "title_en", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-semibold"
                  placeholder="Title"
                />
                <textarea
                  value={cat.description_en}
                  onChange={(e) => handleChange(index, "description_en", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                  placeholder="Description"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">日本語 (Japanese)</label>
                <input
                  type="text"
                  value={cat.title_ja}
                  onChange={(e) => handleChange(index, "title_ja", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-semibold"
                  placeholder="タイトル"
                />
                <textarea
                  value={cat.description_ja}
                  onChange={(e) => handleChange(index, "description_ja", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                  placeholder="説明"
                  rows={2}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-6 mt-6 border-t border-slate-100 sticky bottom-0 bg-white/90 backdrop-blur p-4 -mx-4 -mb-4 border-t-2 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] rounded-b-3xl">
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
