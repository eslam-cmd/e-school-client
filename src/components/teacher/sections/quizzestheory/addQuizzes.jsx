// src/components/AddQuiz.jsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://e-school-server.vercel.app";

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "1rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  backgroundColor: "#fff",
}));

const subjectOptions = [
  "الرياضيات",
  "الفيزياء",
  "الكيمياء",
  "اللغة العربية",
  "اللغة الإنجليزية",
  "الديانة",
];

export default function AddQuiz() {
  // حالة النموذج
  const [quizData, setQuizData] = useState({
    student_id: "",
    quiz_title: "",
    quiz_name: "",
    quiz_date: "",
    quiz_grade: "",
  });
const [modal, setModal] = useState({
  open: false,
  success: false,
  message: "",
});
  // حالة الأخطاء لكل حقل
  const [errors, setErrors] = useState({});

  // جلب الطلاب وحالات التحميل/الخطأ
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // حالة الإرسال
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // ضبط تاريخ اليوم تلقائياً
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setQuizData((prev) => ({ ...prev, quiz_date: today }));
  }, []);

  // جلب قائمة الطلاب
  useEffect(() => {
    async function loadStudents() {
      setLoadingStudents(true);
      setFetchError("");
      try {
        const res = await fetch(`${API_URL}/api/students`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Fetch students error:", err);
        setFetchError(
          "لم نتمكن من جلب قائمة الطلاب. تأكد من تشغيل الخادم."
        );
      } finally {
        setLoadingStudents(false);
      }
    }
    loadStudents();
  }, []);

  // تحديث حقول النموذج ومسح خطأ الحقل عند التعديل
  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  // تحقق من جميع الحقول قبل الإرسال
  const validate = () => {
    const newErrors = {};
    if (!quizData.student_id) newErrors.student_id = "اختر الطالب";
    if (!quizData.quiz_title.trim())
      newErrors.quiz_title = "عنوان الكويز مطلوب";
    if (!quizData.quiz_name) newErrors.quiz_name = "اختر المادة";
    if (!quizData.quiz_date) newErrors.quiz_date = "التاريخ مطلوب";
    if (!quizData.quiz_grade.trim())
      newErrors.quiz_grade = "درجة الكويز مطلوبة";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API_URL}/api/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizData),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.message || "خطأ غير معروف");
      setModal({
        open: true,
        success: true,
        message: "✅ تم إضافة الكويز بنجاح",
      });
      // إعادة ضبط النموذج
      const today = new Date().toISOString().split("T")[0];
      setQuizData({
        student_id: "",
        quiz_title: "",
        quiz_name: "",
        quiz_date: today,
        quiz_grade: "",
      });
    } catch (err) {
      console.error("Submit quiz error:", err);
      setModal({
        open: true,
        success: false,
        message: "❌ حدث خطأ أثناء الاضافة",
      });
      setSubmitError(`فشل حفظ الكويز: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <FormContainer component="form" onSubmit={handleSubmit}>
      <Typography sx={{fontSize:{xs:"17px",md:"22px",lg:"25px"}}} fontWeight={600} mb={2} color="#1f2937">
        إضافة كويز نظري
      </Typography>

      {fetchError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {fetchError}
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* عنوان الكويز */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="عنوان الكويز"
            name="quiz_title"
            value={quizData.quiz_title}
            onChange={handleChange}
            placeholder="مثلاً: اختبار الوحدة الأولى"
            error={!!errors.quiz_title}
            helperText={errors.quiz_title}
          />
        </Grid>

        {/* درجة الكويز */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="درجة الكويز"
            name="quiz_grade"
            value={quizData.quiz_grade}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.quiz_grade}
            helperText={errors.quiz_grade}
          />
        </Grid>

        {/* تاريخ الكويز */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="تاريخ الكويز"
            name="quiz_date"
            value={quizData.quiz_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            error={!!errors.quiz_date}
            helperText={errors.quiz_date}
          />
        </Grid>

        {/* اختيار الطالب */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="اختر الطالب"
            name="student_id"
            value={quizData.student_id}
            onChange={handleChange}
            disabled={loadingStudents}
            error={!!errors.student_id}
            helperText={errors.student_id}
          >
            {students.map((s) => (
              <MenuItem key={s.student_id} value={s.student_id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* اختيار المادة */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="اختر المادة"
            name="quiz_name"
            value={quizData.quiz_name}
            onChange={handleChange}
            error={!!errors.quiz_name}
            helperText={errors.quiz_name}
          >
            {subjectOptions.map((subj) => (
              <MenuItem key={subj} value={subj}>
                {subj}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* رسالة خطأ شاملة */}
        {submitError && (
          <Grid item xs={12}>
            <Alert severity="error">{submitError}</Alert>
          </Grid>
        )}

        {/* زر الإرسال */}
        <Grid item xs={12}>
          <Box textAlign="right">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={submitting || loadingStudents}
              sx={{
                borderRadius: "0.5rem",
                px: 4,
                py: 1.2,
                fontWeight: 600,
                backgroundColor: "#2563eb",
                "&:hover": { backgroundColor: "#1d4ed8" },
              }}
            >
              {submitting ? <CircularProgress size={24} /> : "حفظ الكويز"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </FormContainer>
    {/* مودال عصري للحالة */}
    <Dialog
    open={modal.open}
    onClose={() => setModal((prev) => ({ ...prev, open: false }))}
  >
    <DialogTitle sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
        {modal.success ? (
          <CheckCircle sx={{ fontSize: 60, color: "green" }} />
        ) : (
          <ErrorIcon sx={{ fontSize: 60, color: "red" }} />
        )}
      </Box>
      <Typography
        
        sx={{
          color: modal.success ? "green" : "red",
          fontWeight: "bold",
          textAlign: "center",
          fontSize:"25px"
        }}
      >
        {modal.success ? "نجاح العملية" : "فشل العملية"}
      </Typography>
    </DialogTitle>
    <DialogContent>
      <Typography sx={{ textAlign: "center" }}>
        {modal.message}
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: "center" }}>
      <Button
        onClick={() => setModal((prev) => ({ ...prev, open: false }))}
        variant="contained"
        sx={{
          backgroundColor: modal.success ? "green" : "red",
          "&:hover": {
            backgroundColor: modal.success ? "#0f7b0f" : "#b71c1c",
          },
        }}
      >
        إغلاق
      </Button>
    </DialogActions>
  </Dialog>
</>
  );
}