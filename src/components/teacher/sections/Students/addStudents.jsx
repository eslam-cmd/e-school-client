"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation"; // تأكد من الاستيراد الصحيح

import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "1rem",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  backgroundColor: "#ffffff",
}));

// add student
const AddStudents = () => {
  const [loading, setLoading] = useState(false); // ✅ في أعلى المكون
  const router = useRouter(); // ✅ في أعلى المكون

  const [formData, setFormData] = useState({
    name: "",
    section: "",
    specialization: "",
    nameSchool:"",
    guardianNum:"" ,
    phone: "",
  });
  const [modal, setModal] = useState({
    open: false,
    success: false,
    message: "",
  });
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://e-school-server.vercel.app/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("فشل في الإرسال");

      const result = await response.json();
      setModal({
        open: true,
        success: true,
        message: "✅ تم إضافة المذاكرة بنجاح",
      });

      setFormData({
        name: "",
        section: "",
        specialization: "",
        nameSchool:"",
        guardianNum:"" ,
        phone: "",
      });

      // إعادة التوجيه بعد الإضافة
      // router.push("/students"); ← إذا عندك صفحة عرض الطلاب
    } catch (err) {
      console.error("❌ خطأ في السيرفر:", err.message);
      setModal({
        open: true,
        success: false,
        message: "❌ حدث خطأ أثناء الاضافة",
      });
      res.status(500).json({ error: "حدث خطأ أثناء الحفظ" });
    }
     finally {
      setLoading(false);
    }
  };
// --------------
  return (
    <>
    <FormContainer>
      <Typography sx={{fontSize:{xs:"17px",md:"22px",lg:"25px"}}} fontWeight={600} mb={2} color="#1f2937">
        إضافة طالب جديد
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="الاسم الكامل"
            name="name"
            value={formData.name}
            onChange={handleChange}
            variant="outlined"
            placeholder="أدخل اسم الطالب"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="رقم ولي الامر"
            name="guardianNum"
            value={formData.guardianNum}
            onChange={handleChange}
            variant="outlined"
            placeholder="أدخل رقم ولي الامر"
          />
        </Grid><Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="اسم المدرسة"
            name="nameSchool"
            value={formData.nameSchool}
            onChange={handleChange}
            variant="outlined"
            placeholder="أدخل اسم المدرسة"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="الشعبة"
            name="section"
            value={formData.section}
            onChange={handleChange}
            variant="outlined"
            placeholder="مثلا: الشعبة الاولى"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="التخصص"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            variant="outlined"
            placeholder="مثلا: صناعة الكترون"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="رقم الهاتف"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            variant="outlined"
            placeholder="09xxxxxxxx"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              borderRadius: "0.5rem",
              paddingX: 4,
              paddingY: 1.2,
              fontWeight: 600,
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
          >
            {loading ? "⏳ جاري الحفظ..." : "حفظ الطالب"}
          </Button>
        </Grid>
      </Grid>
    </FormContainer>
    {/* مودال عصري للحالة */}
    <Dialog
    open={modal.open}
    onClose={() => setModal((prev) => ({ ...prev, open: false }))}
  >
    <DialogTitle sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 1,borderRadius:"20px" }}>
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
};

export default AddStudents;