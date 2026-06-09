import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import api from "./api";
import "./index.css";

const categories = [
  "Matematika", "Fisika", "Kimia", "Biologi", "Astronomi",
  "Kebumian", "Komputer/Informatika", "Ekonomi", "Bahasa Inggris"
];

function getUser() {
  const raw = localStorage.getItem("medis_user");
  return raw ? JSON.parse(raw) : null;
}

function Layout({ children }) {
  const user = getUser();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("medis_token");
    localStorage.removeItem("medis_user");
    navigate("/");
  };

  return (
    <div>
      <nav className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl text-blue-700">MEDIS</Link>
          <div className="flex gap-3 items-center text-sm">
            {user?.role === "admin" && <Link to="/admin" className="font-medium">Dashboard Admin</Link>}
            {user?.role === "student" && <Link to="/student" className="font-medium">Dashboard Murid</Link>}
            {user ? (
              <button onClick={logout} className="px-4 py-2 rounded-xl bg-red-50 text-red-600">Logout</button>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-xl bg-blue-600 text-white">Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-xl bg-green-500 text-white">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

function Landing() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-green-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="uppercase tracking-widest text-sm mb-3">Mentoring English and Science Smudama</p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Platform latihan olimpiade untuk siswa berprestasi.</h1>
            <p className="mt-5 text-lg text-blue-50">Latihan soal, pembahasan, skor, dan progres belajar dalam satu website yang mudah digunakan.</p>
            <div className="mt-8 flex gap-3">
              <Link to="/register" className="bg-white text-blue-700 px-6 py-3 rounded-2xl font-bold">Mulai Belajar</Link>
              <Link to="/login" className="border border-white px-6 py-3 rounded-2xl font-bold">Masuk</Link>
            </div>
          </div>
          <div className="bg-white/15 rounded-3xl p-6 backdrop-blur">
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat} className="bg-white text-slate-700 rounded-2xl p-4 shadow">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-semibold">{cat}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Auth({ type }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", school: "SMUDAMA" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const url = type === "login" ? "/auth/login" : "/auth/register";
      const { data } = await api.post(url, form);
      localStorage.setItem("medis_token", data.token);
      localStorage.setItem("medis_user", JSON.stringify(data.user));
      navigate(data.user.role === "admin" ? "/admin" : "/student");
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-14">
        <div className="bg-white rounded-3xl shadow p-8">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">{type === "login" ? "Login" : "Register Murid"}</h1>
          <p className="text-slate-500 mb-6">Masuk ke platform MEDIS.</p>
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={submit} className="space-y-4">
            {type !== "login" && (
              <>
                <input className="w-full border rounded-xl p-3" placeholder="Nama Lengkap" onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <input className="w-full border rounded-xl p-3" placeholder="Sekolah" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
              </>
            )}
            <input className="w-full border rounded-xl p-3" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="w-full border rounded-xl p-3" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button className="w-full bg-blue-600 text-white rounded-xl p-3 font-bold">{type === "login" ? "Login" : "Daftar"}</button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

function RequireRole({ role, children }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/" />;
  return children;
}

function AdminDashboard() {
const [students, setStudents] = useState([]);
const [attempts, setAttempts] = useState([]);
const [questions, setQuestions] = useState([]);

const [form, setForm] = useState({
category: "Matematika",
difficulty: "Sedang",
questionText: "",
options: "",
correctAnswer: "",
explanation: ""
});

const loadData = async () => {
try {
const [studentRes, attemptRes, questionRes] = await Promise.all([
api.get("/users/students"),
api.get("/attempts/all"),
api.get("/questions")
]);

  setStudents(studentRes.data);
  setAttempts(attemptRes.data);
  setQuestions(questionRes.data);
} catch (err) {
  console.log(err);
}

};

useEffect(() => {
loadData();
}, []);

const addQuestion = async (e) => {
e.preventDefault();

try {
  await api.post("/questions", {
    ...form,
    options: form.options.split("\n")
  });

  alert("Soal berhasil ditambahkan");

  setForm({
    category: "Matematika",
    difficulty: "Sedang",
    questionText: "",
    options: "",
    correctAnswer: "",
    explanation: ""
  });

  loadData();
} catch (err) {
  alert("Gagal menambah soal");
}

};

const deleteQuestion = async (id) => {
if (!window.confirm("Hapus soal ini?")) return;

await api.delete(`/questions/${id}`);
loadData();

};

return (




    <div className="mb-8">
      <h1 className="text-4xl font-bold text-blue-700">
        Dashboard Admin MEDIS
      </h1>
      <p className="text-slate-500 mt-2">
        Kelola soal olimpiade, murid, dan hasil latihan.
      </p>
    </div>

    {/* STATISTIC */}
    <div className="grid md:grid-cols-3 gap-5 mb-8">

      <div className="bg-white rounded-3xl shadow p-6">
        <div className="text-5xl mb-3">👨‍🎓</div>
        <p className="text-slate-500">Jumlah Murid</p>
        <h2 className="text-4xl font-bold text-blue-700">
          {students.length}
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow p-6">
        <div className="text-5xl mb-3">📚</div>
        <p className="text-slate-500">Jumlah Soal</p>
        <h2 className="text-4xl font-bold text-green-600">
          {questions.length}
        </h2>
      </div>

      <div className="bg-white rounded-3xl shadow p-6">
        <div className="text-5xl mb-3">🏆</div>
        <p className="text-slate-500">Total Pengerjaan</p>
        <h2 className="text-4xl font-bold text-purple-600">
          {attempts.length}
        </h2>
      </div>

    </div>

    {/* FORM TAMBAH SOAL */}
    <div className="bg-white rounded-3xl shadow p-6 mb-8">

      <h2 className="text-2xl font-bold mb-5">
        Tambah Soal Baru
      </h2>

      <form
        onSubmit={addQuestion}
        className="grid md:grid-cols-2 gap-4"
      >

        <select
          className="border rounded-xl p-3"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="border rounded-xl p-3"
          value={form.difficulty}
          onChange={(e) =>
            setForm({ ...form, difficulty: e.target.value })
          }
        >
          <option>Mudah</option>
          <option>Sedang</option>
          <option>Sulit</option>
        </select>

        <textarea
          className="border rounded-xl p-3 md:col-span-2"
          rows="4"
          placeholder="Tulis soal di sini..."
          value={form.questionText}
          onChange={(e) =>
            setForm({
              ...form,
              questionText: e.target.value
            })
          }
          required
        />

        <textarea
          className="border rounded-xl p-3"
          rows="6"
          placeholder="Pilihan jawaban (1 baris = 1 pilihan)"
          value={form.options}
          onChange={(e) =>
            setForm({
              ...form,
              options: e.target.value
            })
          }
          required
        />

        <textarea
          className="border rounded-xl p-3"
          rows="6"
          placeholder="Pembahasan"
          value={form.explanation}
          onChange={(e) =>
            setForm({
              ...form,
              explanation: e.target.value
            })
          }
        />

        <input
          className="border rounded-xl p-3"
          placeholder="Kunci Jawaban"
          value={form.correctAnswer}
          onChange={(e) =>
            setForm({
              ...form,
              correctAnswer: e.target.value
            })
          }
          required
        />

        <button
          className="bg-blue-600 text-white rounded-xl p-3 font-bold"
        >
          Simpan Soal
        </button>

      </form>
    </div>

    {/* DAFTAR SOAL */}
    <div className="bg-white rounded-3xl shadow p-6 mb-8">

      <h2 className="text-2xl font-bold mb-5">
        Bank Soal
      </h2>

      <div className="space-y-3">

        {questions.map((q) => (
          <div
            key={q._id}
            className="border rounded-2xl p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-bold">
                {q.category} • {q.difficulty}
              </p>

              <p className="text-slate-600">
                {q.questionText}
              </p>
            </div>

            <button
              onClick={() => deleteQuestion(q._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-xl"
            >
              Hapus
            </button>
          </div>
        ))}

      </div>
    </div>

    {/* DAFTAR MURID */}
    <div className="bg-white rounded-3xl shadow p-6 mb-8">

      <h2 className="text-2xl font-bold mb-5">
        Daftar Murid
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Nama</th>
            <th>Email</th>
            <th>Sekolah</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s._id} className="border-b">
              <td className="py-3">{s.name}</td>
              <td>{s.email}</td>
              <td>{s.school}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>

    {/* HASIL LATIHAN */}
    <div className="bg-white rounded-3xl shadow p-6">

      <h2 className="text-2xl font-bold mb-5">
        Hasil Latihan Murid
      </h2>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Nama</th>
            <th>Kategori</th>
            <th>Skor</th>
          </tr>
        </thead>

        <tbody>
          {attempts.map((a) => (
            <tr key={a._id} className="border-b">
              <td className="py-3">
                {a.student?.name}
              </td>
              <td>{a.category}</td>
              <td>
                {a.score}/{a.totalQuestions}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>

  </div>
</Layout>

);
}

  const load = async () => {
    const [s, a, q] = await Promise.all([
      api.get("/users/students"),
      api.get("/attempts/all"),
      api.get("/questions")
    ]);
    setStudents(s.data);
    setAttempts(a.data);
    setQuestions(q.data);
  };

  useEffect(() => { load(); }, []);

  const addQuestion = async (e) => {
    e.preventDefault();
    await api.post("/questions", {
      ...form,
      options: form.options.split("\n").filter(Boolean)
    });
    setForm({ ...form, questionText: "", explanation: "" });
    load();
  };

  const deleteQuestion = async (id) => {
    await api.delete(`/questions/${id}`);
    load();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-700">Dashboard Admin</h1>
        <p className="text-slate-500 mt-2">Kelola soal, murid, dan hasil pengerjaan.</p>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Stat title="Jumlah Murid" value={students.length} />
          <Stat title="Jumlah Soal" value={questions.length} />
          <Stat title="Total Attempt" value={attempts.length} />
        </div>

        <section className="bg-white rounded-3xl shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Tambah Soal</h2>
          <form onSubmit={addQuestion} className="grid md:grid-cols-2 gap-4">
            <select className="border rounded-xl p-3" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className="border rounded-xl p-3" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option>Mudah</option><option>Sedang</option><option>Sulit</option>
            </select>
            <textarea className="border rounded-xl p-3 md:col-span-2" placeholder="Pertanyaan" value={form.questionText} onChange={(e) => setForm({ ...form, questionText: e.target.value })} required />
            <textarea className="border rounded-xl p-3" placeholder="Pilihan jawaban, satu baris satu opsi" value={form.options} onChange={(e) => setForm({ ...form, options: e.target.value })} required />
            <textarea className="border rounded-xl p-3" placeholder="Pembahasan" value={form.explanation} onChange={(e) => setForm({ ...form, explanation: e.target.value })} required />
            <input className="border rounded-xl p-3" placeholder="Kunci jawaban harus sama dengan salah satu opsi" value={form.correctAnswer} onChange={(e) => setForm({ ...form, correctAnswer: e.target.value })} required />
            <button className="bg-green-500 text-white rounded-xl p-3 font-bold">Simpan Soal</button>
          </form>
        </section>

        <section className="bg-white rounded-3xl shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Daftar Soal</h2>
          <div className="space-y-3">
            {questions.map(q => (
              <div key={q._id} className="border rounded-2xl p-4 flex justify-between gap-4">
                <div>
                  <p className="font-bold">{q.category} · {q.difficulty}</p>
                  <p className="text-slate-600">{q.questionText}</p>
                </div>
                <button onClick={() => deleteQuestion(q._id)} className="text-red-600 font-semibold">Hapus</button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">Hasil Pengerjaan Murid</h2>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3">Murid</th><th>Kategori</th><th>Skor</th><th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map(a => (
                  <tr key={a._id} className="border-b">
                    <td className="py-3">{a.student?.name}</td>
                    <td>{a.category}</td>
                    <td>{a.score}/{a.totalQuestions}</td>
                    <td>{new Date(a.createdAt).toLocaleDateString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  );
}

function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <p className="text-slate-500">{title}</p>
      <p className="text-4xl font-extrabold text-blue-700 mt-2">{value}</p>
    </div>
  );
}

function StudentDashboard() {
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-700">Dashboard Murid</h1>
        <p className="text-slate-500 mt-2">Pilih bidang olimpiade dan mulai latihan.</p>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {categories.map((cat) => (
            <Link key={cat} to={`/quiz/${encodeURIComponent(cat)}`} className="bg-white rounded-3xl shadow p-6 hover:shadow-lg transition">
              <div className="text-4xl">📘</div>
              <h2 className="font-bold text-xl mt-4">{cat}</h2>
              <p className="text-slate-500 mt-2">Kerjakan soal dan lihat pembahasan.</p>
            </Link>
          ))}
        </div>
        <History />
      </div>
    </Layout>
  );
}

function Quiz() {
  const category = decodeURIComponent(location.pathname.split("/").pop());
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get(`/questions?category=${encodeURIComponent(category)}`).then(res => setQuestions(res.data));
  }, [category]);

  const submit = async () => {
    const payload = {
      category,
      answers: questions.map(q => ({
        question: q._id,
        selectedAnswer: answers[q._id] || ""
      }))
    };
    const { data } = await api.post("/attempts", payload);
    setResult(data);
  };

  if (result) return <Result result={result} />;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-blue-700">Latihan {category}</h1>
        <div className="space-y-5 mt-8">
          {questions.map((q, idx) => (
            <div key={q._id} className="bg-white rounded-3xl shadow p-6">
              <p className="font-bold mb-2">Soal {idx + 1} · {q.difficulty}</p>
              <p className="text-slate-700 mb-4">{q.questionText}</p>
              <div className="space-y-2">
                {q.options.map(opt => (
                  <label key={opt} className={`block border rounded-xl p-3 cursor-pointer ${answers[q._id] === opt ? "border-blue-600 bg-blue-50" : ""}`}>
                    <input type="radio" name={q._id} className="mr-2" onChange={() => setAnswers({ ...answers, [q._id]: opt })} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        {questions.length === 0 ? (
          <div className="bg-yellow-50 text-yellow-700 rounded-2xl p-5 mt-6">Belum ada soal untuk kategori ini.</div>
        ) : (
          <button onClick={submit} className="mt-6 bg-green-500 text-white rounded-2xl px-6 py-3 font-bold">Selesai & Lihat Skor</button>
        )}
      </div>
    </Layout>
  );
}

function Result({ result }) {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow p-8 text-center">
          <h1 className="text-3xl font-bold text-blue-700">Hasil Latihan</h1>
          <p className="text-6xl font-extrabold text-green-500 mt-5">{result.score}/{result.totalQuestions}</p>
          <p className="text-slate-500 mt-2">Kategori: {result.category}</p>
        </div>
        <div className="space-y-4 mt-8">
          {result.answers.map((a, idx) => (
            <div key={a._id || idx} className="bg-white rounded-3xl shadow p-6">
              <p className="font-bold">Soal {idx + 1}</p>
              <p className="mt-2">{a.question?.questionText}</p>
              <p className={`mt-3 font-semibold ${a.isCorrect ? "text-green-600" : "text-red-600"}`}>
                Jawaban kamu: {a.selectedAnswer || "Kosong"} — {a.isCorrect ? "Benar" : "Salah"}
              </p>
              <p className="mt-2 text-blue-700 font-semibold">Kunci: {a.question?.correctAnswer}</p>
              <p className="mt-2 text-slate-600">Pembahasan: {a.question?.explanation}</p>
            </div>
          ))}
        </div>
        <Link to="/student" className="inline-block mt-6 bg-blue-600 text-white rounded-2xl px-6 py-3 font-bold">Kembali ke Dashboard</Link>
      </div>
    </Layout>
  );
}

function History() {
  const [attempts, setAttempts] = useState([]);
  useEffect(() => { api.get("/attempts/my").then(res => setAttempts(res.data)); }, []);

  return (
    <section className="bg-white rounded-3xl shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4">Riwayat Latihan</h2>
      {attempts.length === 0 && <p className="text-slate-500">Belum ada riwayat.</p>}
      <div className="space-y-3">
        {attempts.map(a => (
          <div key={a._id} className="border rounded-2xl p-4">
            <p className="font-bold">{a.category}</p>
            <p className="text-slate-600">Skor: {a.score}/{a.totalQuestions} · {new Date(a.createdAt).toLocaleString("id-ID")}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Auth type="login" />} />
        <Route path="/register" element={<Auth type="register" />} />
        <Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} />
        <Route path="/student" element={<RequireRole role="student"><StudentDashboard /></RequireRole>} />
        <Route path="/quiz/:category" element={<RequireRole role="student"><Quiz /></RequireRole>} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
