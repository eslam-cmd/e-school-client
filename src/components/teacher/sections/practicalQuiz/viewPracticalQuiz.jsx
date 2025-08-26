// components/ViewExams.jsx

"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  InputAdornment
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import {DeleteIcon} from "@mui/icons-material/Delete";
import { FiTrash2,FiEdit } from "react-icons/fi";
import { FiRefreshCw } from "react-icons/fi";const API_URL =  "https://e-school-server.vercel.app";

const StyledPaper = styled(Paper)(({ theme }) => ({ 
  padding: theme.spacing(3), 
  borderRadius: "1rem", 
  backgroundColor: "#fff", 
}));

// قائمة المواد


export default function ViewPracticalQuiz() { 
  const [loading, setLoading] = useState(false); 
  const [quiz, setQuiz] = useState([]); 
  const [students, setStudents] = useState([]); 
  const [sectionFilter, setSectionFilter] = useState(""); 
  const [specializationFilter, setSpecializationFilter] = useState(""); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedStudent, setSelectedStudent] = useState(""); 
  const [selectedSubject, setSelectedSubject] = useState(""); 
  const [error, setError] = useState("");
  const [reloading, setReloading] = useState(false);
  
  // states للمودال
  const [editOpen, setEditOpen] = useState(false); 
  const [editData, setEditData] = useState({ 
    id: "", 
    student_id: "", 
    name: "", 
    quiz_title: "", 
    quiz_name: "", 
    quiz_date: "", 
    quiz_grade: "", 
  }); 
  const [editErrors, setEditErrors] = useState({}); 
  const [editSubmitting, setEditSubmitting] = useState(false); 
  const [editError, setEditError] = useState(""); 
  const [practicalSubjects, setPracticalSubjects] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  // جلب الطلاب والملاحظات
  const loadData = async () => { 
    setLoading(true); 
    setError("");
    try { 
      const [studRes, quizRes] = await Promise.all([
        fetch(`${API_URL}/api/students`),
        fetch(`${API_URL}/api/practical-quiz`)
      ]); 
      if (!studRes.ok) throw new Error("فشل جلب الطلاب"); 
      if (!quizRes.ok) throw new Error("فشل جلب الملاحظات"); 

      const studentsData = await studRes.json();
      const quizData = await quizRes.json();

      // إنشاء خريطة لأسماء الطلاب
      const nameMap = new Map(
        studentsData.map((s) => [s.student_id, s.name])
      );
      
      // دمج البيانات
      const mergedQuiz = Array.isArray(quizData) ? quizData : quizData.data;
      const quizWithNames = mergedQuiz.map((n) => ({
        ...n,
        name: nameMap.get(n.student_id) || "—",
      }));

      setStudents(studentsData);
      setQuiz(quizWithNames);
    } catch (err) { 
      console.error(err);
      setError("فشل في تحميل البيانات. تأكد من اتصال الخادم.");
    } finally { 
      setLoading(false); 
    } 
  };

  useEffect(() => { 
    loadData(); 
  }, []);
  useEffect(() => {
    fetch(`${API_URL}/api/practical-quiz/quiz`)
      .then(res => res.json())
      .then(data => setSubjectOptions(data.subjects))
      .catch(err => console.error("فشل جلب المواد العملية:", err));
  }, []);
  // حذف ملاحظة
  const handleDelete = async (id) => { 
    if (!confirm("هل أنت متأكد من الحذف نهائيًا؟")) return; 
    try { 
      const res = await fetch(`${API_URL}/api/practical-quiz/${id}`, { method: "DELETE" });

if (!res.ok) throw new Error("فشل الحذف");

setQuiz((prev) => prev.filter((n) => n.id !== id));
    } catch (err) { 
      console.error(err); 
      alert("حدث خطأ أثناء الحذف"); 
    } 
  };


  // فتح المودال بالبيانات
  const handleEdit = (quiz) => { 
    setEditData({ ...quiz }); 
    setEditErrors({}); 
    setEditError(""); 
    setEditOpen(true); 
  };

  // غلق المودال
  const handleEditCancel = () => { 
    setEditOpen(false); 
  };

  // تغييرات حقول المودال
  const handleEditChange = (e) => { 
    const { name, value } = e.target; 
    setEditData((prev) => ({ ...prev, [name]: value })); 
    setEditErrors((prev) => ({ ...prev, [name]: "" })); 
    setEditError(""); 
  };

  // تحقق قبل الحفظ
  const validateEdit = () => { 
    const errs = {}; 
    if (!editData.quiz_title.trim()) errs.quiz_title = "العنوان مطلوب"; 
    if (!editData.quiz_name) errs.quiz_name = "اختر المادة"; 
    if (!editData.quiz_date) errs.quiz_date = "التاريخ مطلوب"; 
    if (!editData.quiz_grade.toString().trim()) errs.quiz_grade = "العلامة مطلوبة"; 
    setEditErrors(errs); 
    return Object.keys(errs).length === 0; 
  };

  // حفظ التعديلات
  const handleEditSave = async () => { 
    if (!validateEdit()) return;

    setEditSubmitting(true);
    setEditError("");
    try {
      const res = await fetch(`${API_URL}/api/practical-quiz/${editData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_title: editData.quiz_title,
          quiz_name: editData.quiz_name,
          quiz_date: editData.quiz_date,
          quiz_grade: editData.quiz_grade,
        }),
      });
      
      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.message || "فشل التحديث");
      }
      
      setQuiz((prev) =>
        prev.map((n) => (n.id === editData.id ? { ...editData } : n))
      );
      setEditOpen(false);
    } catch (err) {
      console.error(err);
      setEditError(err.message);
    } finally {
      setEditSubmitting(false);
    }
  };

  const uniqueSections = [...new Set(students.map(student => student.section).filter(Boolean))];
  const uniquespecialization = [...new Set(students.map(student => student.specialization).filter(Boolean))];

  // student filter list
  const uniqueStudents = students.map((s) => ({ 
    id: s.student_id, 
    name: s.name, 
    section: s.section ,
    specialization: s.specialization // إضافة القسم للاستخدام في الفلترة 
  }));

  // filtered quiz - التصحيح هنا
  const filteredQuiz = quiz.filter((quiz) => {
    // البحث عن الطالب المرتبط بهذه الملاحظة
    const student = students.find(s => s.student_id === quiz.student_id);
    
    const matchesStudent = !selectedStudent || quiz.student_id === selectedStudent;
    const matchesSubject = !selectedSubject || quiz.quiz_name === selectedSubject;
    const matchesSection = !sectionFilter || (student && student.section === sectionFilter);
    const matchesSpecialization = !specializationFilter || (student && student.specialization === specializationFilter);
    const matchesSearch = !searchTerm || 
      (student && student.name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      quiz.quiz_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.quiz_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStudent && matchesSubject && matchesSection && matchesSpecialization && matchesSearch ;
  });

  const handleReload = async () => {
    setReloading(true);
    try {
      await loadData();
    } catch (err) {
      console.error("❌ فشل في إعادة التحميل:", err.message);
    } finally {
      setReloading(false);
    }
  };

  if (loading) { 
    return <Box textAlign="center" mt={4}><CircularProgress /></Box>; 
  }

  return ( 
    <Box sx={{ p: 3, backgroundColor: "grey.100", minHeight: "100vh" }}> 
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}> 
        {/* Header */} 
        <Box sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" }, 
          justifyContent: "space-between", 
          alignItems: { xs: "flex-start", md: "center" }, 
          mb: 4, 
          gap: 2, 
        }} > 
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}> 
            <svg  
              style={{ fontSize: "1.5rem", color: "#2563eb" }}  
              fill="none"  
              viewBox="0 0 24 24"  
              stroke="currentColor" 
            > 
              <path  
                strokeLinecap="round"  
                strokeLinejoin="round"  
                strokeWidth={2}  
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"  
              /> 
            </svg> 
            <Typography sx={{ fontWeight: "bold", color: "grey.800", fontSize:{xs:"17px",md:"22px",lg:"25px"}}} > 
              إدارة الاختبارات العملية
            </Typography> 
          </Box>

          <Tooltip title="إعادة تحميل">
            <IconButton
              size="small"
              color="primary"
              onClick={handleReload}
              sx={{ ml: 1 }}
            >
              {reloading ? <CircularProgress size={20} /> : <FiRefreshCw />}
            </IconButton>
          </Tooltip>
        </Box>

        <StyledPaper>
          <Typography variant="h6" mb={2}>
            قائمة الملاحظات حسب الطالب
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* فلترات البحث */}
          <Box sx={{ 
            display: "flex", 
            flexDirection: { xs: "column", sm: "row" }, 
            alignItems: "center", 
            mb: 3, 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <TextField
              placeholder="ابحث عن طلاب أو مواد أو عناوين..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: { xs: "100%", sm: 300 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <svg
                      style={{
                        height: "1.25rem",
                        width: "1.25rem",
                        color: "#9ca3af",
                      }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: "12px",
                  "&:focus-within": {
                    borderColor: "primary.light",
                    boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
                  },
                },
              }}
            />
            
            <FormControl fullWidth>
  <InputLabel>اختر المادة العملية</InputLabel>
  <Select
    value={selectedSubject}
    onChange={(e) => setSelectedSubject(e.target.value)}
  >
    <MenuItem value="">الكل</MenuItem>
    {subjectOptions.map((subj) => (
      <MenuItem key={subj} value={subj}>
        {subj}
      </MenuItem>
    ))}
  </Select>
</FormControl>

<FormControl sx={{ minWidth: 180, width: { xs: "100%", sm: "auto" } }}>
              <InputLabel>اختر اختصاص الطالب</InputLabel>
              <Select
                value={specializationFilter}
                label="اختصاص"
                onChange={(e) => setSpecializationFilter(e.target.value)}
                sx={{ borderRadius: "12px" }}
              >
                <MenuItem value="">كل الأقسام</MenuItem>
                {uniquespecialization.map((specialization, index) => (
                  <MenuItem key={index} value={specialization}>{specialization}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180, width: { xs: "100%", sm: "auto" } }}>
              <InputLabel>القسم</InputLabel>
              <Select
                value={sectionFilter}
                label="القسم"
                onChange={(e) => setSectionFilter(e.target.value)}
                sx={{ borderRadius: "12px" }}
              >
                <MenuItem value="">كل الأقسام</MenuItem>
                {uniqueSections.map((section, index) => (
                  <MenuItem key={index} value={section}>{section}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: "grey.50" }}>
              <TableRow>
  {["الطالب", "القسم", "اختصاص الطالب", "العنوان", "المادة", "التاريخ", "العلامة", "الإجراءات"].map((header, i) => (
    <TableCell
      key={i}
      sx={{
        textAlign: "right",
        fontWeight: "medium",
        color: "grey.500",
        textTransform: "uppercase",
        fontSize: "0.75rem",
      }}
    >
      {header}
    </TableCell>
  ))}
</TableRow>
              </TableHead>
              <TableBody>
                {filteredQuiz.map((quiz) => {
                  const student = students.find((s) => s.student_id === quiz.student_id);
                  return (
                    <TableRow key={quiz.id} hover>
  <TableCell sx={{ textAlign: "right" }}>{student?.name || quiz.student_id}</TableCell>
  <TableCell sx={{ textAlign: "right" }}>{student?.section || "غير محدد"}</TableCell>
  <TableCell sx={{ textAlign: "right" }}>{student?.specialization || "غير محدد"}</TableCell> {/* ← الجديد */}
  <TableCell sx={{ textAlign: "right" }}>{quiz.quiz_title}</TableCell>
  <TableCell sx={{ textAlign: "right" }}>{quiz.quiz_name}</TableCell>
  <TableCell sx={{ textAlign: "right" }}>{quiz.quiz_date}</TableCell>
  <TableCell sx={{ textAlign: "right" }}>{quiz.quiz_grade}</TableCell>
  <TableCell align="center">
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
      <IconButton
        onClick={() => handleEdit(quiz)}
        sx={{ color: "#2563eb" }}
        size="small"
      >
        <FiEdit />
      </IconButton>
      <IconButton
        onClick={() => handleDelete(quiz.id)}
        sx={{ color: "#dc2626" }}
        size="small"
      >
        <FiTrash2 />
      </IconButton>
    </Box>
  </TableCell>
</TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredQuiz.length === 0 && !loading && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="grey.500">
                لا توجد نتائج مطابقة للبحث
              </Typography>
            </Box>
          )}
        </StyledPaper>

        {/* مودال التعديل */}
        <Dialog open={editOpen} onClose={handleEditCancel} fullWidth maxWidth="sm">
  <DialogTitle>تعديل ملاحظة للطالب: {editData.name}</DialogTitle>
  <DialogContent dividers>
    {editError && (
      <Typography color="error" sx={{ mb: 2 }}>
        {editError}
      </Typography>
    )}

    <TextField
      fullWidth
      label="عنوان الملاحظة"
      name="quiz_title"
      value={editData.quiz_title}
      onChange={handleEditChange}
      error={!!editErrors.quiz_title}
      helperText={editErrors.quiz_title}
      sx={{ mb: 2 }}
    />

    <FormControl fullWidth error={!!editErrors.quiz_name} sx={{ mb: 2 }}>
      <InputLabel>المادة العملية</InputLabel>
      <Select
        name="quiz_name"
        value={editData.quiz_name}
        onChange={handleEditChange}
      >
        {subjectOptions.map((subj) => (
          <MenuItem key={subj} value={subj}>
            {subj}
          </MenuItem>
        ))}
      </Select>
      {editErrors.quiz_name && (
        <FormHelperText>{editErrors.quiz_name}</FormHelperText>
      )}
    </FormControl>

    <TextField
      fullWidth
      type="date"
      label="التاريخ"
      name="quiz_date"
      value={editData.quiz_date}
      onChange={handleEditChange}
      InputLabelProps={{ shrink: true }}
      error={!!editErrors.quiz_date}
      helperText={editErrors.quiz_date}
      sx={{ mb: 2 }}
    />

    <TextField
      fullWidth
      type="number"
      label="العلامة"
      name="quiz_grade"
      value={editData.quiz_grade}
      onChange={handleEditChange}
      error={!!editErrors.quiz_grade}
      helperText={editErrors.quiz_grade}
    />
  </DialogContent>

  <DialogActions>
    <Button onClick={handleEditCancel} disabled={editSubmitting}>
      إلغاء
    </Button>
    <Button
      variant="contained"
      onClick={handleEditSave}
      disabled={editSubmitting}
    >
      {editSubmitting ? "جارٍ الحفظ..." : "حفظ التعديلات"}
    </Button>
  </DialogActions>
</Dialog>
      </Box> 
 </Box>
);
}