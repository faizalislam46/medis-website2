import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell
} from "recharts";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useParams
} from "react-router-dom";
import api from "./api";
import "./index.css";
import * as XLSX from "xlsx";

const categories = [
  "Matematika",
  "Fisika",
  "Kimia",
  "Biologi",
  "Astronomi",
  "Kebumian",
  "Geografi",
  "Informatika",
  "Ekonomi",
  "Bahasa Inggris"
];

const icons = {
  Matematika: "📐",
  Fisika: "⚛️",
  Kimia: "🧪",
  Biologi: "🧬",
  Astronomi: "🔭",
  Kebumian: "🌋",
  Geografi: "🌍",
  Informatika: "💻",
  Ekonomi: "📈",
  "Bahasa Inggris": "🇬🇧"
};

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
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl text-blue-700">
            MEDIS
          </Link>

          <div className="flex gap-3 items-center text-sm flex-wrap justify-end">
            {user?.role === "admin" && (
              <Link to="/admin" className="font-medium">
                Dashboard Admin
              </Link>
            )}

            {user?.role === "student" && (
              <>
                <Link to="/student" className="font-medium">
                  Dashboard Murid
                </Link>
                <Link to="/leaderboard" className="font-medium">
                  Leaderboard
                </Link>
              </>
            )}

            {user ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-red-50 text-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 rounded-xl bg-blue-600 text-white">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 rounded-xl bg-green-500 text-white">
                  Register
                </Link>
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
            <p className="uppercase tracking-widest text-sm mb-3">
              Mentoring English and Science Smudama
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Platform latihan olimpiade berbasis pelajaran dan bab.
            </h1>
            <p className="mt-5 text-lg text-blue-50">
              Siswa fokus pada satu bidang OSN, lalu melihat kekuatan dan kelemahan berdasarkan bab.
            </p>
            <div className="mt-8 flex gap-3">
              <Link to="/register" className="bg-white text-blue-700 px-6 py-3 rounded-2xl font-bold">
                Mulai Belajar
              </Link>
              <Link to="/login" className="border border-white px-6 py-3 rounded-2xl font-bold">
                Masuk
              </Link>
            </div>
          </div>

          <div className="bg-white/15 rounded-3xl p-6 backdrop-blur">
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div key={cat} className="bg-white text-slate-700 rounded-2xl p-4 shadow">
                  <div className="text-2xl mb-2">{icons[cat] || "🏆"}</div>
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
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    school: "SMUDAMA",
    mainSubject: "Astronomi"
  });
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
          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            {type === "login" ? "Login" : "Register Murid"}
          </h1>

          <p className="text-slate-500 mb-6">
            {type === "login"
              ? "Masuk ke platform MEDIS."
              : "Daftar dan pilih satu pelajaran utama OSN."}
          </p>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4">{error}</div>}

          <form onSubmit={submit} className="space-y-4">
            {type !== "login" && (
              <>
                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Nama Lengkap"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

                <input
                  className="w-full border rounded-xl p-3"
                  placeholder="Sekolah"
                  value={form.school}
                  onChange={(e) => setForm({ ...form, school: e.target.value })}
                />

                <select
                  className="w-full border rounded-xl p-3"
                  value={form.mainSubject}
                  onChange={(e) => setForm({ ...form, mainSubject: e.target.value })}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </>
            )}

            <input
              className="w-full border rounded-xl p-3"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />

            <input
              className="w-full border rounded-xl p-3"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <button className="w-full bg-blue-600 text-white rounded-xl p-3 font-bold">
              {type === "login" ? "Login" : "Daftar"}
            </button>
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

function Stat({ title, value }) {
  return (
    <div className="bg-white rounded-3xl shadow p-6">
      <p className="text-slate-500">{title}</p>
      <p className="text-4xl font-extrabold text-blue-700 mt-2">{value}</p>
    </div>
  );
}

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [tryoutResults, setTryoutResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [tryouts, setTryouts] = useState([]);
  const [selectedTryoutId, setSelectedTryoutId] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [bankCategoryFilter, setBankCategoryFilter] = useState("");
  const [bankChapterFilter, setBankChapterFilter] = useState("");
  const [bankDifficultyFilter, setBankDifficultyFilter] = useState("");
  const [bankSearch, setBankSearch] = useState("");
  const [dashboardCategory, setDashboardCategory] = useState("ALL");

  const [chapterForm, setChapterForm] = useState({
    category: "Astronomi",
    chapterName: ""
  });

  const [tryoutForm, setTryoutForm] = useState({
    title: "",
    category: "Astronomi",
    level: "Kabupaten",
    durationMinutes: 120,
    totalQuestions: 10
  });

  const [form, setForm] = useState({
    category: "Astronomi",
    chapter: "Umum",
    difficulty: "Sedang",
    questionText: "",
    options: "",
    correctAnswer: "",
    explanation: ""
  });

  const loadData = async () => {
    try {
      const [studentRes, attemptRes, questionRes, resultRes, chapterRes] =
        await Promise.all([
          api.get("/users/students"),
          api.get("/attempts/all"),
          api.get("/questions"),
          api.get("/results"),
          api.get("/chapters")
        ]);

      setStudents(studentRes.data);
      setAttempts(attemptRes.data);
      setQuestions(questionRes.data);
      setTryoutResults(resultRes.data);
      setChapters(chapterRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadData();

    const savedTryouts = localStorage.getItem("medis_tryouts");
    if (savedTryouts) {
      setTryouts(JSON.parse(savedTryouts));
    }
  }, []);

  const getResultPercentage = (result) => {
    if (!result?.totalQuestions) return 0;
    return Math.round(
      (Number(result.score || 0) / Number(result.totalQuestions || 1)) * 100
    );
  };

  const getChaptersByCategory = (category) =>
    chapters
      .filter((chapter) => chapter.category === category)
      .map((chapter) => chapter.chapterName);

  const filteredQuestions = questions.filter((q) => {
    const matchCategory = bankCategoryFilter
      ? q.category === bankCategoryFilter
      : true;

    const matchChapter = bankChapterFilter
      ? q.chapter === bankChapterFilter
      : true;

    const matchDifficulty = bankDifficultyFilter
      ? q.difficulty === bankDifficultyFilter
      : true;

    const keyword = bankSearch.toLowerCase().trim();

    const matchSearch = keyword
      ? q.questionText?.toLowerCase().includes(keyword) ||
        q.explanation?.toLowerCase().includes(keyword) ||
        q.chapter?.toLowerCase().includes(keyword)
      : true;

    return matchCategory && matchChapter && matchDifficulty && matchSearch;
  });

  const filteredResults =
    dashboardCategory === "ALL"
      ? tryoutResults
      : tryoutResults.filter((result) => result.category === dashboardCategory);

  const filteredQuestionsDashboard =
    dashboardCategory === "ALL"
      ? questions
      : questions.filter((question) => question.category === dashboardCategory);

  const filteredChaptersDashboard =
    dashboardCategory === "ALL"
      ? chapters
      : chapters.filter((chapter) => chapter.category === dashboardCategory);

  const adminAverageScore =
    filteredResults.length > 0
      ? Math.round(
          filteredResults.reduce(
            (sum, result) => sum + getResultPercentage(result),
            0
          ) / filteredResults.length
        )
      : 0;

  const categoryStats = categories.map((category) => {
    const categoryQuestions = questions.filter(
      (question) => question.category === category
    ).length;

    const categoryChapters = chapters.filter(
      (chapter) => chapter.category === category
    ).length;

    const categoryResults = tryoutResults.filter(
      (result) => result.category === category
    );

    const average =
      categoryResults.length > 0
        ? Math.round(
            categoryResults.reduce(
              (sum, result) => sum + getResultPercentage(result),
              0
            ) / categoryResults.length
          )
        : 0;

    return {
      category,
      questions: categoryQuestions,
      chapters: categoryChapters,
      attempts: categoryResults.length,
      average
    };
  });

  const topStudents = [...filteredResults]
    .filter((result) => result.totalQuestions > 0)
    .sort((a, b) => getResultPercentage(b) - getResultPercentage(a))
    .slice(0, 5);

  const mostActiveCategory =
    dashboardCategory === "ALL"
      ? [...categoryStats].sort((a, b) => b.attempts - a.attempts)[0]
      : categoryStats[0];

  const chapterWeaknessMap = {};

  filteredResults.forEach((result) => {
    (result.chapterScores || []).forEach((item) => {
      const category = result.category || "Umum";
      const chapter = item.chapter || "Umum";
      const key = `${category}__${chapter}`;

      if (!chapterWeaknessMap[key]) {
        chapterWeaknessMap[key] = {
          category,
          chapter,
          correct: 0,
          total: 0
        };
      }

      chapterWeaknessMap[key].correct += Number(item.correct || 0);
      chapterWeaknessMap[key].total += Number(item.total || 0);
    });
  });

  const weakestChapters = Object.values(chapterWeaknessMap)
    .filter((item) => item.total > 0)
    .map((item) => ({
      ...item,
      average: Math.round((item.correct / item.total) * 100)
    }))
    .sort((a, b) => a.average - b.average)
    .slice(0, 5);

  const addChapter = async (e) => {
    e.preventDefault();

    try {
      await api.post("/chapters", chapterForm);
      alert("Bab berhasil ditambahkan");

      setChapterForm({
        ...chapterForm,
        chapterName: ""
      });

      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menambah bab");
    }
  };

  const deleteChapter = async (id) => {
    if (!window.confirm("Hapus bab ini?")) return;

    try {
      await api.delete(`/chapters/${id}`);
      loadData();
    } catch (err) {
      alert("Gagal menghapus bab");
    }
  };

  const addQuestion = async (e) => {
    e.preventDefault();

    try {
      await api.post("/questions", {
        ...form,
        chapter: form.chapter || "Umum",
        options: form.options
          .split("\n")
          .map((x) => x.trim())
          .filter(Boolean)
      });

      alert("Soal berhasil ditambahkan");

      setForm({
        category: "Astronomi",
        chapter: "Umum",
        difficulty: "Sedang",
        questionText: "",
        options: "",
        correctAnswer: "",
        explanation: ""
      });

      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menambah soal");
    }
  };

  const uploadExcel = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    try {
      for (let i = 0; i < rows.length; i++) {
        const raw = rows[i];
        const row = {};

        Object.keys(raw).forEach((key) => {
          row[key.trim()] = raw[key];
        });

        if (
          !row.Kategori ||
          !row.Bab ||
          !row.Level ||
          !row.Soal ||
          !row.Jawaban
        ) {
          alert(
            `Format salah di baris Excel nomor ${i + 2}. Kolom wajib: Kategori, Bab, Level, Soal, Jawaban`
          );
          return;
        }

        const category = String(row.Kategori).trim();
        const chapter = String(row.Bab).trim();

        const chapterExists = chapters.some(
          (c) => c.category === category && c.chapterName === chapter
        );

        if (!chapterExists) {
          try {
            await api.post("/chapters", {
              category,
              chapterName: chapter
            });
          } catch (err) {
            console.log("Chapter already exists");
          }
        }

        await api.post("/questions", {
          category,
          chapter,
          difficulty: String(row.Level).trim(),
          questionText: String(row.Soal).trim(),
          options: [row.A, row.B, row.C, row.D, row.E]
            .map((x) => String(x).trim())
            .filter(Boolean),
          correctAnswer: String(row.Jawaban).trim(),
          explanation: String(row.Pembahasan || "").trim()
        });
      }

      await loadData();

      alert(`${rows.length} soal berhasil diupload`);
      e.target.value = "";
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert(err.response?.data?.message || "Upload gagal. Cek format Excel.");
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Hapus soal ini?")) return;

    try {
      await api.delete(`/questions/${id}`);
      loadData();
    } catch (err) {
      alert("Gagal menghapus soal");
    }
  };

  const saveTryout = () => {
    if (!tryoutForm.title.trim()) {
      alert("Masukkan nama paket tryout");
      return;
    }

    const newTryout = {
      id: Date.now(),
      ...tryoutForm,
      questionIds: []
    };

    const updatedTryouts = [...tryouts, newTryout];

    setTryouts(updatedTryouts);
    localStorage.setItem("medis_tryouts", JSON.stringify(updatedTryouts));

    setTryoutForm({
      title: "",
      category: "Astronomi",
      level: "Kabupaten",
      durationMinutes: 120,
      totalQuestions: 10
    });
  };

  const deleteTryout = (tryoutId) => {
    if (!window.confirm("Hapus paket tryout ini?")) return;

    const updatedTryouts = tryouts.filter(
      (tryout) => String(tryout.id) !== String(tryoutId)
    );

    setTryouts(updatedTryouts);
    localStorage.setItem("medis_tryouts", JSON.stringify(updatedTryouts));

    if (String(selectedTryoutId) === String(tryoutId)) {
      setSelectedTryoutId("");
      setSelectedQuestions([]);
    }
  };

  const toggleQuestion = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const saveQuestionsToTryout = () => {
    if (!selectedTryoutId) {
      alert("Pilih paket tryout dulu");
      return;
    }

    const updatedTryouts = tryouts.map((tryout) =>
      String(tryout.id) === String(selectedTryoutId)
        ? {
            ...tryout,
            questionIds: selectedQuestions
          }
        : tryout
    );

    setTryouts(updatedTryouts);
    localStorage.setItem("medis_tryouts", JSON.stringify(updatedTryouts));
    alert("Soal berhasil dimasukkan ke paket tryout");
  };

  const updateStudentSubject = async (studentId, subject) => {
    try {
      await api.put(`/users/students/${studentId}/subject`, {
        mainSubject: subject
      });

      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update pelajaran");
    }
  };

  const downloadTemplateExcel = () => {
    const templateData = [
      {
        Kategori: "Astronomi",
        Bab: "Tata Surya",
        Level: "Sedang",
        Soal: "Planet terbesar di Tata Surya adalah ...",
        A: "Bumi",
        B: "Mars",
        C: "Jupiter",
        D: "Venus",
        E: "Merkurius",
        Jawaban: "Jupiter",
        Pembahasan: "Jupiter adalah planet terbesar di Tata Surya."
      },
      {
        Kategori: "Biologi",
        Bab: "Genetika",
        Level: "Mudah",
        Soal: "Unit pewarisan sifat pada makhluk hidup disebut ...",
        A: "Sel",
        B: "Gen",
        C: "Jaringan",
        D: "Organ",
        E: "Protein",
        Jawaban: "Gen",
        Pembahasan: "Gen adalah unit dasar pewarisan sifat."
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Soal");
    XLSX.writeFile(workbook, "Template_Upload_Soal_MEDIS.xlsx");
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-700">
            Dashboard Admin MEDIS
          </h1>

          <p className="text-slate-500 mt-2">
            Kelola pelajaran, bab, soal, paket tryout, murid, dan hasil belajar.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 mb-8">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                Statistik Dashboard
              </h2>

              <p className="text-slate-500">
                Filter statistik berdasarkan pelajaran.
              </p>
            </div>

            <select
              className="border rounded-xl p-3"
              value={dashboardCategory}
              onChange={(e) => setDashboardCategory(e.target.value)}
            >
              <option value="ALL">
                Semua Pelajaran
              </option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-5 mb-8">
          <Stat title="Jumlah Murid" value={students.length} />
          <Stat title="Jumlah Bab" value={filteredChaptersDashboard.length} />
          <Stat title="Jumlah Soal" value={filteredQuestionsDashboard.length} />
          <Stat title="Tryout Dikerjakan" value={filteredResults.length} />
          <Stat title="Rata-rata Skor" value={`${adminAverageScore}%`} />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-2">
              Analitik Performa
            </h2>

            <p className="text-slate-500 mb-5">
              Grafik tetap menampilkan semua pelajaran. Filter hanya memberi highlight pada pelajaran yang dipilih.
            </p>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryStats}
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 45
                  }}
                >
                  <XAxis
                    dataKey="category"
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                    height={75}
                    tick={{
                      fontSize: 10
                    }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{
                      fontSize: 11
                    }}
                  />
                  <Tooltip />
                  <Bar dataKey="average" radius={[8, 8, 0, 0]}>
                    {categoryStats.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={
                          dashboardCategory === "ALL"
                            ? "#2563eb"
                            : entry.category === dashboardCategory
                            ? "#ef4444"
                            : "#cbd5e1"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-green-500 text-white rounded-3xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">
              Insight Admin
            </h2>

            <p className="text-4xl mb-3">📊</p>

            <p className="text-lg font-bold">
              Aktivitas tertinggi: {mostActiveCategory?.category || "-"}
            </p>

            <p className="text-blue-50 mt-3">
              {mostActiveCategory?.attempts > 0
                ? `${mostActiveCategory.category} memiliki ${mostActiveCategory.attempts} hasil tryout dengan rata-rata ${mostActiveCategory.average}%.`
                : "Belum ada aktivitas tryout yang cukup untuk dianalisis."}
            </p>

            <div className="mt-5 bg-white/15 rounded-2xl p-4">
              <p className="font-bold mb-1">
                Rekomendasi Admin
              </p>

              <p className="text-blue-50">
                {weakestChapters.length > 0
                  ? `Prioritaskan penguatan bab ${weakestChapters[0].chapter} pada pelajaran ${weakestChapters[0].category}.`
                  : "Upload soal berbasis bab dan dorong siswa mengerjakan tryout agar statistik lebih kaya."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">
              Top 5 Siswa
            </h2>

            {topStudents.length === 0 ? (
              <p className="text-slate-500">
                Belum ada data hasil tryout.
              </p>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="py-3">Rank</th>
                      <th>Nama</th>
                      <th>Pelajaran</th>
                      <th>Paket</th>
                      <th>Skor</th>
                    </tr>
                  </thead>

                  <tbody>
                    {topStudents.map((result, index) => (
                      <tr key={result._id} className="border-b">
                        <td className="py-3 font-bold">
                          #{index + 1}
                        </td>

                        <td>
                          {result.studentName || result.userId?.name || "Siswa"}
                        </td>

                        <td>
                          {result.category}
                        </td>

                        <td>
                          {result.tryoutTitle}
                        </td>

                        <td className="font-bold text-green-600">
                          {getResultPercentage(result)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-5">
              Bab Terlemah
            </h2>

            {weakestChapters.length === 0 ? (
              <p className="text-slate-500">
                Data bab lemah akan muncul setelah siswa mengerjakan tryout berbasis bab.
              </p>
            ) : (
              <div className="space-y-4">
                {weakestChapters.map((item) => (
                  <div key={`${item.category}-${item.chapter}`}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-slate-700">
                        {item.category} • {item.chapter}
                      </span>

                      <span className="font-bold text-orange-600">
                        {item.average}%
                      </span>
                    </div>

                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-3 bg-orange-500 rounded-full"
                        style={{ width: `${item.average}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5">
            Kelola Bab
          </h2>

          <form onSubmit={addChapter} className="grid md:grid-cols-3 gap-4 mb-6">
            <select
              className="border rounded-xl p-3"
              value={chapterForm.category}
              onChange={(e) =>
                setChapterForm({
                  ...chapterForm,
                  category: e.target.value
                })
              }
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              className="border rounded-xl p-3"
              placeholder="Nama Bab, contoh: Tata Surya"
              value={chapterForm.chapterName}
              onChange={(e) =>
                setChapterForm({
                  ...chapterForm,
                  chapterName: e.target.value
                })
              }
              required
            />

            <button className="bg-blue-600 text-white rounded-xl p-3 font-bold">
              Tambah Bab
            </button>
          </form>

          <div className="grid md:grid-cols-2 gap-3 max-h-[280px] overflow-auto pr-2">
            {chapters.map((chapter) => (
              <div
                key={chapter._id}
                className="border rounded-2xl p-4 flex justify-between items-center gap-4"
              >
                <div>
                  <p className="font-bold">
                    {chapter.chapterName}
                  </p>

                  <p className="text-slate-500">
                    {chapter.category}
                  </p>
                </div>

                <button
                  onClick={() => deleteChapter(chapter._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5">
            Tambah Soal Baru
          </h2>

          <div className="mb-6 bg-blue-50 border border-blue-100 rounded-2xl p-4">
            <div className="flex justify-between items-center gap-4 mb-3 flex-wrap">
              <div>
                <label className="block font-semibold text-blue-700">
                  Upload Soal Excel
                </label>

                <p className="text-sm text-slate-500 mt-1">
                  Download template terlebih dahulu agar format kolom tidak salah.
                </p>
              </div>

              <button
                type="button"
                onClick={downloadTemplateExcel}
                className="bg-green-600 text-white px-5 py-2 rounded-xl font-bold"
              >
                Download Template Excel
              </button>
            </div>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={uploadExcel}
              className="border p-3 rounded-xl bg-white w-full"
            />

            <p className="text-sm text-slate-500 mt-2">
              Format kolom: Kategori, Bab, Level, Soal, A, B, C, D, E, Jawaban, Pembahasan
            </p>
          </div>

          <form onSubmit={addQuestion} className="grid md:grid-cols-2 gap-4">
            <select
              className="border rounded-xl p-3"
              value={form.category}
              onChange={(e) => {
                const category = e.target.value;

                setForm({
                  ...form,
                  category,
                  chapter: getChaptersByCategory(category)[0] || "Umum"
                });
              }}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              className="border rounded-xl p-3"
              value={form.chapter}
              onChange={(e) =>
                setForm({
                  ...form,
                  chapter: e.target.value
                })
              }
            >
              <option value="Umum">
                Umum
              </option>

              {getChaptersByCategory(form.category).map((chapter) => (
                <option key={chapter} value={chapter}>
                  {chapter}
                </option>
              ))}
            </select>

            <select
              className="border rounded-xl p-3"
              value={form.difficulty}
              onChange={(e) =>
                setForm({
                  ...form,
                  difficulty: e.target.value
                })
              }
            >
              <option value="Mudah">Mudah</option>
              <option value="Sedang">Sedang</option>
              <option value="Sulit">Sulit</option>
            </select>

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
              placeholder="Pilihan jawaban, satu baris satu pilihan"
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
              required
            />

            <button className="bg-blue-600 text-white rounded-xl p-3 font-bold md:col-span-2">
              Simpan Soal
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5">
            Kelola Paket Tryout
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="border rounded-xl p-3"
              placeholder="Nama Paket Tryout"
              value={tryoutForm.title}
              onChange={(e) =>
                setTryoutForm({
                  ...tryoutForm,
                  title: e.target.value
                })
              }
            />

            <select
              className="border rounded-xl p-3"
              value={tryoutForm.category}
              onChange={(e) =>
                setTryoutForm({
                  ...tryoutForm,
                  category: e.target.value
                })
              }
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              className="border rounded-xl p-3"
              value={tryoutForm.level}
              onChange={(e) =>
                setTryoutForm({
                  ...tryoutForm,
                  level: e.target.value
                })
              }
            >
              <option value="Kabupaten">Kabupaten</option>
              <option value="Provinsi">Provinsi</option>
              <option value="Nasional">Nasional</option>
            </select>

            <input
              type="number"
              className="border rounded-xl p-3"
              placeholder="Durasi (menit)"
              value={tryoutForm.durationMinutes}
              onChange={(e) =>
                setTryoutForm({
                  ...tryoutForm,
                  durationMinutes: e.target.value
                })
              }
            />

            <input
              type="number"
              className="border rounded-xl p-3"
              placeholder="Jumlah Soal"
              value={tryoutForm.totalQuestions}
              onChange={(e) =>
                setTryoutForm({
                  ...tryoutForm,
                  totalQuestions: e.target.value
                })
              }
            />
          </div>

          <button
            className="mt-5 bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
            onClick={saveTryout}
          >
            Simpan Paket Tryout
          </button>

          <div className="mt-8 space-y-3">
            {tryouts.map((tryout) => (
              <div
                key={tryout.id}
                className="border rounded-2xl p-4 flex justify-between gap-4 items-center"
              >
                <div>
                  <p className="font-bold">
                    {tryout.title}
                  </p>

                  <p className="text-slate-500">
                    {tryout.category} • {tryout.level}
                  </p>

                  <p className="text-slate-500">
                    {tryout.durationMinutes} menit • {tryout.totalQuestions} soal •{" "}
                    {tryout.questionIds?.length || 0} soal dipilih
                  </p>
                </div>

                <button
                  onClick={() => deleteTryout(tryout.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5">
            Bank Soal
          </h2>

          <div className="grid md:grid-cols-4 gap-4 mb-5">
            <select
              className="border rounded-xl p-3"
              value={bankCategoryFilter}
              onChange={(e) => setBankCategoryFilter(e.target.value)}
            >
              <option value="">
                Pilih Pelajaran
              </option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              className="border rounded-xl p-3"
              value={bankChapterFilter}
              onChange={(e) => setBankChapterFilter(e.target.value)}
            >
              <option value="">
                Pilih Bab
              </option>

              {chapters
                .filter(
                  (chapter) =>
                    !bankCategoryFilter || chapter.category === bankCategoryFilter
                )
                .map((chapter) => (
                  <option key={chapter._id} value={chapter.chapterName}>
                    {chapter.chapterName}
                  </option>
                ))}
            </select>

            <select
              className="border rounded-xl p-3"
              value={bankDifficultyFilter}
              onChange={(e) => setBankDifficultyFilter(e.target.value)}
            >
              <option value="">
                Pilih Tingkat Kesulitan
              </option>

              <option value="Mudah">Mudah</option>
              <option value="Sedang">Sedang</option>
              <option value="Sulit">Sulit</option>
            </select>

            <input
              className="border rounded-xl p-3"
              placeholder="Cari kata kunci soal..."
              value={bankSearch}
              onChange={(e) => setBankSearch(e.target.value)}
            />
          </div>

          <div className="mb-5 grid md:grid-cols-3 gap-4">
            <select
              className="border rounded-xl p-3"
              value={selectedTryoutId}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedTryoutId(value);

                const selected = tryouts.find(
                  (tryout) => String(tryout.id) === String(value)
                );

                setSelectedQuestions(selected?.questionIds || []);
              }}
            >
              <option value="">
                Pilih Paket Tryout
              </option>

              {tryouts.map((tryout) => (
                <option key={tryout.id} value={tryout.id}>
                  {tryout.title}
                </option>
              ))}
            </select>

            <div className="border rounded-xl p-3 text-slate-600">
              {selectedQuestions.length} soal dipilih
            </div>

            <button
              className="bg-green-600 text-white rounded-xl p-3 font-bold"
              onClick={saveQuestionsToTryout}
            >
              Simpan Soal ke Paket
            </button>
          </div>

          <p className="text-sm text-slate-500 mb-3">
            Menampilkan {filteredQuestions.length} dari {questions.length} soal.
          </p>

          <div className="space-y-3 max-h-[650px] overflow-auto pr-2">
            {filteredQuestions.map((question) => (
              <div
                key={question._id}
                className="border rounded-2xl p-4 flex justify-between gap-4 items-center"
              >
                <div className="flex gap-3 items-start flex-1">
                  <input
                    type="checkbox"
                    className="mt-2 w-5 h-5"
                    checked={selectedQuestions.includes(question._id)}
                    onChange={() => toggleQuestion(question._id)}
                  />

                  <div>
                    <p className="font-bold">
                      {question.category} • {question.chapter || "Umum"} •{" "}
                      {question.difficulty}
                    </p>

                    <p className="text-slate-600">
                      {question.questionText}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteQuestion(question._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5">
            Daftar Murid
          </h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">Nama</th>
                  <th>Email</th>
                  <th>Sekolah</th>
                  <th>Pelajaran</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student._id} className="border-b">
                    <td className="py-3">
                      {student.name}
                    </td>

                    <td>
                      {student.email}
                    </td>

                    <td>
                      {student.school}
                    </td>

                    <td>
                      <select
                        className="border rounded-lg p-2"
                        value={student.mainSubject || "Astronomi"}
                        onChange={(e) =>
                          updateStudentSubject(student._id, e.target.value)
                        }
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5">
            Hasil Tryout Siswa
          </h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">Nama</th>
                  <th>Email</th>
                  <th>Paket</th>
                  <th>Pelajaran</th>
                  <th>Skor</th>
                  <th>Tanggal</th>
                </tr>
              </thead>

              <tbody>
                {tryoutResults.map((result) => (
                  <tr key={result._id} className="border-b">
                    <td className="py-3">
                      {result.studentName || result.userId?.name || "-"}
                    </td>

                    <td>
                      {result.studentEmail || result.userId?.email || "-"}
                    </td>

                    <td>
                      {result.tryoutTitle}
                    </td>

                    <td>
                      {result.category}
                    </td>

                    <td className="font-bold text-green-600">
                      {result.score}/{result.totalQuestions}
                    </td>

                    <td>
                      {new Date(result.createdAt).toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6">
          <h2 className="text-2xl font-bold mb-5">
            Hasil Latihan Murid
          </h2>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3">Nama</th>
                  <th>Kategori</th>
                  <th>Skor</th>
                  <th>Tanggal</th>
                </tr>
              </thead>

              <tbody>
                {attempts.map((attempt) => (
                  <tr key={attempt._id} className="border-b">
                    <td className="py-3">
                      {attempt.student?.name}
                    </td>

                    <td>
                      {attempt.category}
                    </td>

                    <td>
                      {attempt.score}/{attempt.totalQuestions}
                    </td>

                    <td>
                      {new Date(attempt.createdAt).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}


function StudentDashboard() {
  const user = getUser();
  const mainSubject = user?.mainSubject || "Astronomi";

  const [questions, setQuestions] = useState([]);
  const [tryoutResults, setTryoutResults] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [questionRes, resultRes, chapterRes] = await Promise.all([
          api.get(`/questions?category=${encodeURIComponent(mainSubject)}`),
          api.get("/results/my"),
          api.get(`/chapters?category=${encodeURIComponent(mainSubject)}`)
        ]);

        setQuestions(questionRes.data);
        setTryoutResults(
          resultRes.data.filter((r) => r.category === mainSubject)
        );
        setChapters(chapterRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStats(false);
      }
    };

    loadDashboard();
  }, [mainSubject]);

  const getPercentage = (result) => {
    if (!result.totalQuestions) return 0;
    return Math.round((result.score / result.totalQuestions) * 100);
  };

  const totalTryouts = tryoutResults.length;

  const averageScore = totalTryouts
    ? Math.round(
        tryoutResults.reduce((sum, r) => sum + getPercentage(r), 0) /
          totalTryouts
      )
    : 0;

  const highestScore = totalTryouts
    ? Math.max(...tryoutResults.map((r) => getPercentage(r)))
    : 0;

  const recentResults = [...tryoutResults].slice(0, 7).reverse();

  const scoreChartData = recentResults.map((r, index) => ({
    name: `Tryout ${index + 1}`,
    score: getPercentage(r),
    title: r.tryoutTitle
  }));

  const chapterMap = {};

  chapters.forEach((chapter) => {
    chapterMap[chapter.chapterName] = {
      chapter: chapter.chapterName,
      correct: 0,
      total: 0
    };
  });

  tryoutResults.forEach((result) => {
    (result.chapterScores || []).forEach((item) => {
      const key = item.chapter || "Umum";

      if (!chapterMap[key]) {
        chapterMap[key] = {
          chapter: key,
          correct: 0,
          total: 0
        };
      }

      chapterMap[key].correct += Number(item.correct || 0);
      chapterMap[key].total += Number(item.total || 0);
    });
  });

  const chapterSummary = Object.values(chapterMap)
    .map((item) => ({
      ...item,
      average: item.total
        ? Math.round((item.correct / item.total) * 100)
        : 0
    }))
    .sort((a, b) => b.average - a.average);

  const answeredChapterSummary = chapterSummary.filter(
    (item) => item.total > 0
  );

  const bestChapter = answeredChapterSummary[0];
  const weakestChapter =
    answeredChapterSummary[answeredChapterSummary.length - 1];

  const getAiCoachMessage = () => {
    if (totalTryouts === 0) {
      return {
        title: "Mulai dari tryout pertama",
        message:
          "Kerjakan minimal 1 paket tryout agar MEDIS bisa membaca pola kekuatan dan kelemahan belajarmu.",
        action: "Mulai dari paket tryout yang tersedia."
      };
    }

    if (!weakestChapter) {
      return {
        title: "Data bab belum cukup",
        message:
          "Skor tryout sudah tercatat, tetapi data bab belum cukup untuk dianalisis.",
        action: "Kerjakan tryout yang soalnya sudah memiliki bab."
      };
    }

    if (averageScore >= 85) {
      return {
        title: "Performa sangat baik",
        message: `Rata-rata skormu sudah ${averageScore}%. Kamu paling kuat di bab ${bestChapter?.chapter}.`,
        action: `Pertahankan ritme belajar dan fokus polishing di bab ${weakestChapter.chapter}.`
      };
    }

    if (averageScore >= 70) {
      return {
        title: "Performa cukup stabil",
        message: `Rata-rata skormu ${averageScore}%. Bab yang perlu diperkuat adalah ${weakestChapter.chapter}.`,
        action: `Kerjakan 15–20 soal tambahan di bab ${weakestChapter.chapter}.`
      };
    }

    return {
      title: "Perlu penguatan konsep dasar",
      message: `Rata-rata skormu masih ${averageScore}%. Bab terlemah saat ini adalah ${weakestChapter.chapter}.`,
      action: `Mulai dari review konsep ${weakestChapter.chapter}, lalu kerjakan 10 soal mudah dan 10 soal sedang.`
    };
  };

  const aiCoach = getAiCoachMessage();

  const chapterChartData = chapterSummary.map((item) => ({
    chapter: item.chapter,
    score: item.average
  }));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-widest text-blue-600 font-bold mb-2">
            Dashboard Murid
          </p>

          <h1 className="text-4xl font-bold text-slate-800">
            Halo, {user?.name || "Siswa"} 👋
          </h1>

          <p className="text-slate-500 mt-2">
            Fokus OSN kamu:{" "}
            <span className="font-bold text-blue-700">
              {icons[mainSubject]} {mainSubject}
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-5 mb-8">
          <Stat title="Total Tryout" value={totalTryouts} />
          <Stat title="Rata-rata Skor" value={`${averageScore}%`} />
          <Stat title="Skor Tertinggi" value={`${highestScore}%`} />
          <Stat title={`Soal ${mainSubject}`} value={questions.length} />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-2">
              Grafik Perkembangan Skor
            </h2>

            <p className="text-slate-500 mb-5">
              Menampilkan tren skor tryout {mainSubject}.
            </p>

            {loadingStats ? (
              <p className="text-slate-500">Memuat grafik...</p>
            ) : scoreChartData.length === 0 ? (
              <p className="text-slate-500">
                Belum ada data tryout. Mulai kerjakan paket tryout dulu.
              </p>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreChartData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-green-500 text-white rounded-3xl shadow p-6">
            <h2 className="text-xl font-bold mb-3">AI Coach MEDIS</h2>

            <p className="text-4xl mb-3">🤖</p>

            <p className="text-lg font-bold">{aiCoach.title}</p>

            <p className="text-blue-50 mt-3">{aiCoach.message}</p>

            <div className="mt-5 bg-white/15 rounded-2xl p-4">
              <p className="font-bold mb-1">Rekomendasi Aksi</p>
              <p className="text-blue-50">{aiCoach.action}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-bold mb-2">
              Grafik Performa per Bab
            </h2>

            <p className="text-slate-500 mb-5">
              Nilai rata-rata berdasarkan bab {mainSubject}.
            </p>

            {chapterChartData.length === 0 ? (
              <p className="text-slate-500">
                Belum ada bab untuk pelajaran ini.
              </p>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chapterChartData}>
                    <XAxis dataKey="chapter" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="grid gap-6">
            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-3">Bab Terkuat</h2>

              {bestChapter ? (
                <>
                  <p className="text-4xl mb-2">🏆</p>
                  <p className="text-2xl font-bold text-green-700">
                    {bestChapter.chapter}
                  </p>
                  <p className="text-slate-500 mt-1">
                    Rata-rata {bestChapter.average}% dari {bestChapter.total} soal.
                  </p>
                </>
              ) : (
                <p className="text-slate-500">
                  Kerjakan tryout dulu untuk melihat bab terkuat.
                </p>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow p-6">
              <h2 className="text-xl font-bold mb-3">
                Bab yang Perlu Diperkuat
              </h2>

              {weakestChapter ? (
                <>
                  <p className="text-4xl mb-2">📚</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {weakestChapter.chapter}
                  </p>
                  <p className="text-slate-500 mt-1">
                    Rata-rata {weakestChapter.average}% dari {weakestChapter.total} soal.
                  </p>
                </>
              ) : (
                <p className="text-slate-500">
                  Data akan muncul setelah kamu mengerjakan tryout.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-3">Aksi Belajar</h2>

          <p className="text-slate-500 mb-5">
            Pilih aktivitas belajar untuk pelajaran {mainSubject}.
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link
              to="/tryouts"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-2xl font-bold"
            >
              Lihat Paket Tryout
            </Link>

            <Link
              to={`/quiz/${encodeURIComponent(mainSubject)}`}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold"
            >
              Latihan Soal
            </Link>

            <Link
              to="/history"
              className="inline-block bg-slate-700 text-white px-6 py-3 rounded-2xl font-bold"
            >
              Riwayat Tryout
            </Link>

            <Link
              to="/leaderboard"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold"
            >
              Leaderboard
            </Link>
          </div>
        </div>

        <History />
      </div>
    </Layout>
  );
}

function TryoutList() {
  const user = getUser();
  const mainSubject = user?.mainSubject || "Astronomi";
  const [tryouts, setTryouts] = useState([]);

  useEffect(() => {
    const savedTryouts = localStorage.getItem("medis_tryouts");
    if (savedTryouts) {
      setTryouts(JSON.parse(savedTryouts).filter((t) => t.category === mainSubject));
    }
  }, [mainSubject]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-blue-700">Paket Tryout {mainSubject}</h1>
        <p className="text-slate-500 mt-2 mb-8">Pilih paket tryout sesuai pelajaran OSN kamu.</p>
        {tryouts.length === 0 ? <div className="bg-yellow-50 text-yellow-700 rounded-2xl p-5">Belum ada paket tryout {mainSubject}.</div> : (
          <div className="grid md:grid-cols-3 gap-5">
            {tryouts.map((t) => <div key={t.id} className="bg-white rounded-3xl shadow p-6 border"><div className="text-5xl mb-4">📑</div><h2 className="text-xl font-bold">{t.title}</h2><p className="text-slate-500 mt-2">{t.category} • {t.level}</p><p className="text-slate-500 mt-1">{t.durationMinutes} menit • {t.totalQuestions} soal</p><Link to={`/tryout/${t.id}`} className="mt-5 inline-block bg-green-600 text-white px-5 py-3 rounded-xl font-bold">Mulai Tryout</Link></div>)}
          </div>
        )}
      </div>
    </Layout>
  );
}

function TryoutDemo() {
  const { id } = useParams();
  const savedTryouts = JSON.parse(localStorage.getItem("medis_tryouts")) || [];
  const selectedTryout = savedTryouts.find((t) => String(t.id) === String(id));

  const [demoQuestions, setDemoQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(Number(selectedTryout?.durationMinutes || 120) * 60);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const loadTryoutQuestions = async () => {
      try {
        const { data } = await api.get("/questions");
        const selectedIds = selectedTryout?.questionIds || [];
        const filteredQuestions = data.filter((q) => selectedIds.includes(q._id)).map((q) => ({
          id: q._id,
          question: q.questionText,
          chapter: q.chapter || "Umum",
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }));
        setDemoQuestions(filteredQuestions);
      } catch (err) {
        console.error(err);
        alert("Gagal mengambil soal tryout");
      } finally {
        setLoadingQuestions(false);
      }
    };
    loadTryoutQuestions();
  }, [selectedTryout?.id]);

  useEffect(() => {
    if (finished || loadingQuestions || demoQuestions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished, loadingQuestions, demoQuestions.length]);

  const formatTime = (seconds) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  if (loadingQuestions) return <Layout><div className="max-w-4xl mx-auto px-6 py-10"><div className="bg-white rounded-3xl shadow p-8">Memuat soal tryout...</div></div></Layout>;
  if (demoQuestions.length === 0) return <Layout><div className="max-w-4xl mx-auto px-6 py-10"><div className="bg-yellow-50 text-yellow-700 rounded-3xl p-8">Paket ini belum memiliki soal.</div></div></Layout>;

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / demoQuestions.length) * 100);
  const currentQuestion = demoQuestions[current];

  const selectAnswer = (option) => setAnswers({ ...answers, [current]: option });

  const calculateScore = () => demoQuestions.reduce((total, q, index) => total + (answers[index] === q.correctAnswer ? 1 : 0), 0);

  const calculateChapterScores = () => {
    const chapterMap = {};
    demoQuestions.forEach((q, index) => {
      const chapter = q.chapter || "Umum";
      if (!chapterMap[chapter]) chapterMap[chapter] = { chapter, correct: 0, total: 0 };
      chapterMap[chapter].total += 1;
      if (answers[index] === q.correctAnswer) chapterMap[chapter].correct += 1;
    });
    return Object.values(chapterMap);
  };

  const submitTryout = async () => {
    if (!window.confirm("Selesaikan tryout sekarang?")) return;
    const score = calculateScore();
    try {
      await api.post("/results", {
        tryoutId: selectedTryout.id,
        tryoutTitle: selectedTryout.title,
        category: selectedTryout.category,
        score,
        totalQuestions: demoQuestions.length,
        chapterScores: calculateChapterScores()
      });
      console.log("RESULT SAVED");
    } catch (err) {
      console.error(err);
      console.log("FAILED SAVE RESULT");
    }
    setFinished(true);
  };

  if (finished) {
    const score = calculateScore();
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="bg-white rounded-3xl shadow p-8 text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-700">Hasil Tryout</h1>
            <p className="text-6xl font-extrabold text-green-600 mt-6">{score}/{demoQuestions.length}</p>
            <p className="text-slate-500 mt-2">{selectedTryout?.title || "Tryout OSN"}</p>
          </div>
          <div className="space-y-4">
            {demoQuestions.map((q, index) => {
              const userAnswer = answers[index] || "Belum dijawab";
              const isCorrect = userAnswer === q.correctAnswer;
              return <div key={index} className="bg-white rounded-3xl shadow p-6"><p className="font-bold mb-2">Soal {index + 1} • {q.chapter}</p><p className="mb-3">{q.question}</p><p className={`font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>Jawaban kamu: {userAnswer} — {isCorrect ? "Benar" : "Salah"}</p><p className="text-blue-700 font-semibold mt-2">Kunci: {q.correctAnswer}</p><p className="text-slate-600 mt-2">Pembahasan: {q.explanation}</p></div>;
            })}
          </div>
          <Link to="/tryouts" className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold">Kembali ke Paket Tryout</Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-3xl font-bold">{selectedTryout?.title || "Tryout OSN"}</h1><p className="text-slate-500 mt-1">{selectedTryout?.category} • {selectedTryout?.level}</p><p className="text-slate-500 mt-1">{answeredCount}/{demoQuestions.length} soal terjawab</p></div>
          <div className="bg-red-100 text-red-700 px-5 py-3 rounded-xl font-bold">⏰ {formatTime(timeLeft)}</div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 mb-6"><div className="bg-blue-600 h-3 rounded-full" style={{ width: `${progress}%` }} /></div>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-3 bg-white rounded-3xl shadow p-8">
            <div className="mb-5 text-slate-500">Soal {current + 1} dari {demoQuestions.length} • {currentQuestion.chapter}</div>
            <div className="text-lg leading-8 mb-8">{currentQuestion.question}</div>
            <div className="space-y-3">{currentQuestion.options.map((option, index) => { const label = String.fromCharCode(65 + index); const selected = answers[current] === option; return <button key={option} onClick={() => selectAnswer(option)} className={`w-full text-left border p-4 rounded-xl transition ${selected ? "bg-blue-600 text-white border-blue-600" : "hover:bg-blue-50"}`}>{label}. {option}</button>; })}</div>
            <div className="flex justify-between mt-8"><button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="bg-slate-200 px-5 py-3 rounded-xl disabled:opacity-50">Sebelumnya</button><button onClick={() => setCurrent(Math.min(demoQuestions.length - 1, current + 1))} disabled={current === demoQuestions.length - 1} className="bg-blue-600 text-white px-5 py-3 rounded-xl disabled:opacity-50">Berikutnya</button></div>
          </div>
          <div className="bg-white rounded-3xl shadow p-5"><h3 className="font-bold mb-4">Navigasi Soal</h3><div className="grid grid-cols-5 gap-2">{demoQuestions.map((_, i) => <button key={i} onClick={() => setCurrent(i)} className={`h-10 rounded-lg ${current === i ? "bg-blue-600 text-white" : answers[i] ? "bg-green-500 text-white" : "bg-slate-100"}`}>{i + 1}</button>)}</div><button onClick={submitTryout} className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-bold">Selesai Tryout</button></div>
        </div>
      </div>
    </Layout>
  );
}

function Leaderboard() {
  const user = getUser();
  const mainSubject = user?.mainSubject || "Astronomi";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState(mainSubject);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (categoryFilter) params.append("category", categoryFilter);
        const query = params.toString();
        const { data } = await api.get(`/results/leaderboard${query ? `?${query}` : ""}`);
        setResults(data);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat leaderboard");
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, [categoryFilter]);

  const getMedal = (index) => index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`;

  return <Layout><div className="max-w-6xl mx-auto px-6 py-10"><div className="mb-8"><h1 className="text-4xl font-bold text-blue-700">Leaderboard MEDIS</h1><p className="text-slate-500 mt-2">Ranking siswa berdasarkan hasil tryout terbaik.</p></div><div className="bg-white rounded-3xl shadow p-6 mb-8"><label className="block text-sm font-semibold text-slate-600 mb-2">Pelajaran</label><select className="w-full border rounded-xl p-3" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option value="">Semua Pelajaran</option>{categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select></div><div className="bg-white rounded-3xl shadow p-6"><h2 className="text-2xl font-bold mb-5">Ranking Siswa</h2>{loading ? <p className="text-slate-500">Memuat leaderboard...</p> : results.length === 0 ? <div className="bg-yellow-50 text-yellow-700 rounded-2xl p-5">Belum ada data leaderboard.</div> : <div className="overflow-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="py-3">Rank</th><th>Nama</th><th>Paket Tryout</th><th>Pelajaran</th><th>Skor</th><th>Persentase</th><th>Tanggal</th></tr></thead><tbody>{results.map((r, index) => <tr key={r._id} className="border-b"><td className="py-3 font-bold text-lg">{getMedal(index)}</td><td className="font-semibold">{r.name || r.email || "Siswa"}</td><td>{r.tryoutTitle}</td><td>{r.category}</td><td className="font-bold text-green-600">{r.score}/{r.totalQuestions}</td><td className="font-bold text-blue-700">{r.percentage}%</td><td>{new Date(r.createdAt).toLocaleString("id-ID")}</td></tr>)}</tbody></table></div>}</div></div></Layout>;
}

function TryoutHistory() {
  const user = getUser();
  const mainSubject = user?.mainSubject || "Astronomi";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const loadResults = async () => { try { const { data } = await api.get("/results/my"); setResults(data.filter((r) => r.category === mainSubject)); } catch (err) { console.error(err); } finally { setLoading(false); } }; loadResults(); }, [mainSubject]);
  return <Layout><div className="max-w-5xl mx-auto px-6 py-10"><h1 className="text-3xl font-bold mb-6">Riwayat Tryout {mainSubject}</h1>{loading ? <div className="bg-white rounded-3xl shadow p-6">Memuat data...</div> : results.length === 0 ? <div className="bg-white rounded-3xl shadow p-6">Belum ada hasil tryout.</div> : <div className="space-y-4">{results.map((r) => <div key={r._id} className="bg-white rounded-3xl shadow p-6"><h3 className="text-xl font-bold">{r.tryoutTitle}</h3><p className="text-slate-500">{r.category}</p><p className="mt-2 text-green-600 font-bold text-lg">{r.score}/{r.totalQuestions}</p><p className="text-sm text-slate-400 mt-1">{new Date(r.createdAt).toLocaleString("id-ID")}</p></div>)}</div>}</div></Layout>;
}

function Quiz() {
  const category = decodeURIComponent(location.pathname.split("/").pop());
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => { api.get(`/questions?category=${encodeURIComponent(category)}`).then((res) => setQuestions(res.data)); }, [category]);

  const submit = async () => {
    const payload = { category, answers: questions.map((q) => ({ question: q._id, selectedAnswer: answers[q._id] || "" })) };
    const { data } = await api.post("/attempts", payload);
    setResult(data);
  };

  if (result) return <Result result={result} />;

  return <Layout><div className="max-w-4xl mx-auto px-4 py-10"><h1 className="text-3xl font-bold text-blue-700">Latihan {category}</h1><div className="space-y-5 mt-8">{questions.map((q, idx) => <div key={q._id} className="bg-white rounded-3xl shadow p-6"><p className="font-bold mb-2">Soal {idx + 1} · {q.chapter || "Umum"} · {q.difficulty}</p><p className="text-slate-700 mb-4">{q.questionText}</p><div className="space-y-2">{q.options.map((opt) => <label key={opt} className={`block border rounded-xl p-3 cursor-pointer ${answers[q._id] === opt ? "border-blue-600 bg-blue-50" : ""}`}><input type="radio" name={q._id} className="mr-2" onChange={() => setAnswers({ ...answers, [q._id]: opt })} />{opt}</label>)}</div></div>)}</div>{questions.length === 0 ? <div className="bg-yellow-50 text-yellow-700 rounded-2xl p-5 mt-6">Belum ada soal untuk kategori ini.</div> : <button onClick={submit} className="mt-6 bg-green-500 text-white rounded-2xl px-6 py-3 font-bold">Selesai & Lihat Skor</button>}</div></Layout>;
}

function Result({ result }) {
  return <Layout><div className="max-w-4xl mx-auto px-4 py-10"><div className="bg-white rounded-3xl shadow p-8 text-center"><h1 className="text-3xl font-bold text-blue-700">Hasil Latihan</h1><p className="text-6xl font-extrabold text-green-500 mt-5">{result.score}/{result.totalQuestions}</p><p className="text-slate-500 mt-2">Kategori: {result.category}</p></div><div className="space-y-4 mt-8">{result.answers.map((a, idx) => <div key={a._id || idx} className="bg-white rounded-3xl shadow p-6"><p className="font-bold">Soal {idx + 1}</p><p className="mt-2">{a.question?.questionText}</p><p className={`mt-3 font-semibold ${a.isCorrect ? "text-green-600" : "text-red-600"}`}>Jawaban kamu: {a.selectedAnswer || "Kosong"} — {a.isCorrect ? "Benar" : "Salah"}</p><p className="mt-2 text-blue-700 font-semibold">Kunci: {a.question?.correctAnswer}</p><p className="mt-2 text-slate-600">Pembahasan: {a.question?.explanation}</p></div>)}</div><Link to="/student" className="inline-block mt-6 bg-blue-600 text-white rounded-2xl px-6 py-3 font-bold">Kembali ke Dashboard</Link></div></Layout>;
}

function History() {
  const user = getUser();
  const mainSubject = user?.mainSubject || "Astronomi";
  const [attempts, setAttempts] = useState([]);
  useEffect(() => { api.get("/attempts/my").then((res) => setAttempts(res.data.filter((a) => a.category === mainSubject))); }, [mainSubject]);
  return <section className="bg-white rounded-3xl shadow p-6 mt-8"><h2 className="text-xl font-bold mb-4">Riwayat Latihan {mainSubject}</h2>{attempts.length === 0 && <p className="text-slate-500">Belum ada riwayat.</p>}<div className="space-y-3">{attempts.map((a) => <div key={a._id} className="border rounded-2xl p-4"><p className="font-bold">{a.category}</p><p className="text-slate-600">Skor: {a.score}/{a.totalQuestions} · {new Date(a.createdAt).toLocaleString("id-ID")}</p></div>)}</div></section>;
}

function App() {
  return <BrowserRouter><Routes><Route path="/" element={<Landing />} /><Route path="/login" element={<Auth type="login" />} /><Route path="/register" element={<Auth type="register" />} /><Route path="/admin" element={<RequireRole role="admin"><AdminDashboard /></RequireRole>} /><Route path="/student" element={<RequireRole role="student"><StudentDashboard /></RequireRole>} /><Route path="/history" element={<RequireRole role="student"><TryoutHistory /></RequireRole>} /><Route path="/leaderboard" element={<RequireRole role="student"><Leaderboard /></RequireRole>} /><Route path="/tryouts" element={<RequireRole role="student"><TryoutList /></RequireRole>} /><Route path="/tryout/:id" element={<RequireRole role="student"><TryoutDemo /></RequireRole>} /><Route path="/quiz/:category" element={<RequireRole role="student"><Quiz /></RequireRole>} /></Routes></BrowserRouter>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
