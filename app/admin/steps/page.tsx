"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import Swal from "sweetalert2";

export default function AdminStepsPage() {
  const [steps, setSteps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionFilter, setSectionFilter] = useState("install");

  useEffect(() => {
    fetchSteps();
  }, []);

  async function fetchSteps() {
    const supabase = getSupabase();
    if (!supabase) return;
    const { data } = await supabase.from("guide_steps").select("*").order("sort_order", { ascending: true });
    if (data) setSteps(data);
    setLoading(false);
  }

  const handleAdd = () => {
    setSteps([
      ...steps,
      {
        id: "new-" + Date.now(),
        section: sectionFilter,
        sort_order: steps.filter(s => s.section === sectionFilter).length + 1,
        image_path: "",
        is_final: false,
        title_id: "Judul Baru",
        title_en: "New Title",
        title_ja: "新しいタイトル",
        body_id: "Deskripsi",
        body_en: "Description",
        body_ja: "説明",
        isNew: true
      },
    ]);
  };

  const handleRemove = async (index: number, id: string) => {
    if (id.startsWith("new-")) {
      setSteps(steps.filter((_, i) => i !== index));
      return;
    }
    
    const result = await Swal.fire({
      title: "Hapus Step?",
      text: "Step ini akan dihapus secara permanen.",
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
    await supabase.from("guide_steps").delete().eq("id", id);
    
    Swal.fire({
      title: "Terhapus!",
      text: "Step berhasil dihapus.",
      icon: "success",
      confirmButtonColor: "#0a4c8c",
      timer: 1500,
      showConfirmButton: false
    });
    
    fetchSteps();
  };

  const handleChange = (index: number, field: string, value: any) => {
    const newSteps = [...steps];
    newSteps[index][field] = value;
    setSteps(newSteps);
  };

  const handleImageUpload = async (index: number, file: File) => {
    const supabase = getSupabase();
    if (!supabase) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `steps/${fileName}`;

    Swal.fire({
      title: "Mengunggah...",
      text: "Mohon tunggu sebentar.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file);

    if (uploadError) {
      Swal.fire({
        title: "Gagal Upload!",
        text: uploadError.message,
        icon: "error",
        confirmButtonColor: "#ef4444"
      });
      return;
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    handleChange(index, "image_path", data.publicUrl);
    
    Swal.fire({
      title: "Berhasil!",
      text: "Gambar berhasil diunggah.",
      icon: "success",
      confirmButtonColor: "#0a4c8c",
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      for (const step of steps) {
        const payload = {
          section: step.section,
          sort_order: step.sort_order,
          image_path: step.image_path,
          is_final: step.is_final,
          title_id: step.title_id,
          title_en: step.title_en,
          title_ja: step.title_ja,
          body_id: step.body_id,
          body_en: step.body_en,
          body_ja: step.body_ja,
        };

        if (step.isNew) {
          await supabase.from("guide_steps").insert(payload);
        } else {
          await supabase.from("guide_steps").update(payload).eq("id", step.id);
        }
      }
      Swal.fire({
        title: "Berhasil!",
        text: "Perubahan step berhasil disimpan.",
        icon: "success",
        confirmButtonColor: "#0a4c8c",
        timer: 1500,
        showConfirmButton: false
      });
      fetchSteps();
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

  const filteredSteps = steps.filter(s => s.section === sectionFilter).sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ocean-50 text-ocean-600 flex items-center justify-center text-lg">
            <i className="fa-solid fa-list-ol" />
          </div>
          <h2 className="text-2xl font-display font-bold text-ocean-800">Guide Steps</h2>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select 
            value={sectionFilter} 
            onChange={(e) => setSectionFilter(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 rounded-xl outline-none text-sm font-semibold text-slate-700 bg-white shadow-sm"
          >
            <option value="install">Instalasi (Install)</option>
            <option value="connect">Koneksi (Connect)</option>
          </select>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-white border border-slate-200 text-ocean-700 hover:border-ocean-400 hover:bg-ocean-50/50 font-bold rounded-xl text-sm transition-all shadow-sm whitespace-nowrap flex items-center"
          >
            <i className="fa-solid fa-plus mr-2" /> Tambah Step
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {filteredSteps.map((step) => {
          const originalIndex = steps.findIndex(s => s.id === step.id);
          return (
            <div key={step.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50/30">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Urutan</label>
                    <input
                      type="number"
                      value={step.sort_order}
                      onChange={(e) => handleChange(originalIndex, "sort_order", parseInt(e.target.value))}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 outline-none text-sm"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer mt-4">
                    <input 
                      type="checkbox" 
                      checked={step.is_final} 
                      onChange={(e) => handleChange(originalIndex, "is_final", e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-ocean-600 focus:ring-ocean-500"
                    />
                    Step Terakhir (Final)
                  </label>
                </div>
                <button
                  onClick={() => handleRemove(originalIndex, step.id)}
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors"
                >
                  <i className="fa-solid fa-trash-can mr-1.5" /> Hapus
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Gambar (URL atau Upload)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={step.image_path || ""}
                        onChange={(e) => handleChange(originalIndex, "image_path", e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                        placeholder="/images/..."
                      />
                      <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
                        <i className="fa-solid fa-upload" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageUpload(originalIndex, e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                    {step.image_path && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={step.image_path} alt="Preview" className="mt-2 h-20 object-contain rounded border border-slate-200 bg-white" />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-ocean-700 bg-ocean-50 px-2 py-1 rounded">Bahasa Indonesia</label>
                    <input
                      type="text"
                      value={step.title_id}
                      onChange={(e) => handleChange(originalIndex, "title_id", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-semibold"
                      placeholder="Judul"
                    />
                    <textarea
                      value={step.body_id}
                      onChange={(e) => handleChange(originalIndex, "body_id", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                      placeholder="Deskripsi"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">English</label>
                    <input
                      type="text"
                      value={step.title_en}
                      onChange={(e) => handleChange(originalIndex, "title_en", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-semibold"
                      placeholder="Title"
                    />
                    <textarea
                      value={step.body_en}
                      onChange={(e) => handleChange(originalIndex, "body_en", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                      placeholder="Description"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">日本語 (Japanese)</label>
                    <input
                      type="text"
                      value={step.title_ja}
                      onChange={(e) => handleChange(originalIndex, "title_ja", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm font-semibold"
                      placeholder="タイトル"
                    />
                    <textarea
                      value={step.body_ja}
                      onChange={(e) => handleChange(originalIndex, "body_ja", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 outline-none text-sm"
                      placeholder="説明"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
