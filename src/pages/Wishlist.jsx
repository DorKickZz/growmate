import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import PlantCreateModal from "../components/PlantCreateModal";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const fetchUserAndWishlist = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        refreshWishlist(user.id);
      }
    };

    fetchUserAndWishlist();
  }, []);

  const refreshWishlist = async (uid = userId) => {
    if (!uid) return;
    const { data, error } = await supabase
      .from("wunschpflanzen")
      .select("*")
      .eq("user_id", uid)
      .order("created_at", { ascending: true });
    if (!error) setWishlist(data);
  };

  const handleDelete = async (id) => {
    if (!confirm("Wunschpflanze wirklich löschen?")) return;
    await supabase.from("wunschpflanzen").delete().eq("id", id);
    refreshWishlist();
  };

  const handleAdopt = async (plant) => {
    // Pflanze in "pflanzen" übernehmen
    await supabase.from("pflanzen").insert([
      {
        name: plant.name,
        category: plant.category,
        location: plant.location,
        user_id: userId,
      }
    ]);

    // Wunschpflanze löschen
    await supabase.from("wunschpflanzen").delete().eq("id", plant.id);

    refreshWishlist();
  };

  const handleCreate = async (name, category = "", location = "") => {
    await supabase.from("wunschpflanzen").insert([
      {
        name,
        category,
        location,
        user_id: userId,
      }
    ]);
    refreshWishlist();
    setShowCreate(false);
  };

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-semibold">🌟 Wunschliste</h2>
        <button className="btn btn-outline-success" onClick={() => setShowCreate(true)}>
          ➕ Neue Wunschpflanze
        </button>
      </div>

      {wishlist.length === 0 ? (
        <p className="text-muted">Keine Wunschpflanzen vorhanden.</p>
      ) : (
        <div className="row g-4">
          {wishlist.map((plant) => (
            <div className="col-md-4" key={plant.id}>
              <div className="card p-3 h-100 shadow-sm d-flex flex-column">
                <h5 className="fw-semibold">{plant.name}</h5>
                <p className="text-secondary small mb-2">
                  Kategorie: <strong>{plant.category || "–"}</strong><br />
                  Standort: {plant.location || "–"}
                </p>

                <div className="d-flex gap-2 mt-auto">
                  <button className="btn btn-sm btn-success" onClick={() => handleAdopt(plant)}>
                    🌱 Übernehmen
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(plant.id)}>
                    🗑️ Löschen
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && <CreateWishlistModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />}
    </div>
  );
}

// 🎨 Kleines, einfaches Modal um Wunschpflanze anzulegen
function CreateWishlistModal({ onClose, onCreate }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    if (name.trim() === "") {
      alert("Bitte gib einen Namen an.");
      return;
    }
    onCreate(name, category, location);
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
    >
      <div className="bg-white rounded-4 shadow p-4" style={{ width: "100%", maxWidth: "420px" }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">🌟 Neue Wunschpflanze</h5>
          <button className="btn btn-sm btn-close" onClick={onClose} />
        </div>

        <div className="mb-3">
          <label className="form-label">Name der Pflanze</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Kategorie (optional)</label>
          <input className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>

        <div className="mb-3">
          <label className="form-label">Standort (optional)</label>
          <input className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>

        <div className="d-flex justify-content-end">
          <button className="btn btn-secondary me-2" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-success" onClick={handleSubmit}>Speichern</button>
        </div>
      </div>
    </div>
  );
}
