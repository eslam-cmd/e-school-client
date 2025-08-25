"use client";
import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaUserTie } from "react-icons/fa";

const ProfileContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "1rem",
  backgroundColor: "#fff",
}));

// دالة لتوليد ID عشوائي
const generateRandomId = () => {
  return crypto.randomUUID(); 
};

const TeacherProfileCard = () => {
  const [teacher, setTeacher] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    subject: "مدير النظام",
    email: "",
    password: "",
  });

  useEffect(() => {
    const teacherName = localStorage.getItem("teacherName");
    const teacherId = localStorage.getItem("teacherId");
    if (teacherName) {
      setTeacher(true);
      setProfile((prev) => ({ ...prev, name: teacherName }));
    }
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // فتح المودال عند الضغط على حفظ
  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleUpdate = async () => {
    const newId = crypto.randomUUID(); // توليد ID جديد
  
    try {
      const res = await fetch("https://e-school-server.vercel.app/api/teacher/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: newId, // إرسال الـ ID الجديد للسيرفر
          name: profile.name,
          email: profile.email,
          password: profile.password || undefined,
        }),
      });
  
      const data = await res.json();
      if (res.ok) {
        // مسح كل بيانات localStorage
        localStorage.clear();
  
        // إعادة التوجيه للصفحة الرئيسية
        window.location.href = "/";
  
        // إعادة تحميل الصفحة (اختياري لأن التوجيه يعمل Reload تلقائي)
        // window.location.reload();
      } else {
        alert("❌ فشل التحديث: " + data.error);
      }
    } catch (err) {
      alert("⚠️ خطأ في الاتصال بالخادم");
    } finally {
      handleCloseConfirm(); // إغلاق المودال
    }
  };

  return (
    <ProfileContainer elevation={3}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <FaUserTie size={48} color="#2563eb" />
        </Grid>
        <Grid item>
          <Typography variant="h6" fontWeight={700}>
            {profile.name}
          </Typography>
          <Typography color="text.secondary">{profile.subject}</Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        تعديل البيانات
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="الاسم"
            name="name"
            value={profile.name}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="البريد الإلكتروني"
            name="email"
            value={profile.email}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="كلمة المرور الجديدة"
            name="password"
            type="password"
            value={profile.password}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenConfirm}
            sx={{
              borderRadius: "0.5rem",
              paddingX: 4,
              paddingY: 1.2,
              fontWeight: 600,
              backgroundColor: "#2563eb",
              "&:hover": { backgroundColor: "#1d4ed8" },
            }}
          >
            حفظ التعديلات
          </Button>
        </Grid>
      </Grid>

      {/* مودال التأكيد */}
      <Dialog open={openConfirm} onClose={handleCloseConfirm} dir="rtl">
        <DialogTitle>تأكيد التعديلات</DialogTitle>
        <DialogContent>
          هل أنت متأكد أنك تريد حفظ التعديلات وتغيير الـ المعرف الشخصي؟
        </DialogContent>
        <DialogActions >
          <Button onClick={handleCloseConfirm} color="secondary">
            إلغاء
          </Button>
          <Button onClick={handleUpdate} color="primary" variant="contained">
            تأكيد
          </Button>
        </DialogActions>
      </Dialog>
    </ProfileContainer>
  );
};

export default TeacherProfileCard;