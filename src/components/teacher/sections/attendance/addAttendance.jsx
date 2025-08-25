"use client";
import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { FaUserCheck, FaUserTimes } from "react-icons/fa";
import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "1rem",
  backgroundColor: "#fff",
}));

export default function AddAttendance() {
  const [attendanceData, setAttendanceData] = useState({
    studentId: "",
    date: "",
    status: "",
  });
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [errorStudents, setErrorStudents] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // حالة المودال
  const [modal, setModal] = useState({
    open: false,
    success: false,
    message: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setAttendanceData((prev) => ({ ...prev, date: today }));

    setLoadingStudents(true);
    fetch("https://e-school-server.vercel.app/api/students")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((json) => {
        const list = Array.isArray(json) ? json : json.data || [];
        setStudents(list);
      })
      .catch((err) => {
        console.error(err);
        setErrorStudents("فشل في تحميل قائمة الطلاب");
      })
      .finally(() => setLoadingStudents(false));
  }, []);

  const handleChange = (e) => {
    setAttendanceData({
      ...attendanceData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("https://e-school-server.vercel.app/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: attendanceData.studentId,
          attendance_date: attendanceData.date,
          status:
            attendanceData.status === "حاضر" ? "present" : "absent",
        }),
      });
      if (!res.ok) throw new Error("خطأ في الخادم");

      await res.json();
      setAttendanceData((prev) => ({
        ...prev,
        studentId: "",
        status: "",
      }));

      // فتح المودال بنجاح
      setModal({
        open: true,
        success: true,
        message: "✅ تم حفظ التفقد بنجاح",
      });
    } catch (err) {
      console.error(err);
      setSubmitError("لم نتمكن من حفظ التفقد");

      // فتح المودال بفشل
      setModal({
        open: true,
        success: false,
        message: "❌ حدث خطأ أثناء الحفظ",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <FormContainer>
        <Typography
          variant="h6"
          fontWeight={600}
          mb={2}
          color="#1f2937"
        >
          تسجيل حالة الطالب
        </Typography>

        {errorStudents && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorStudents}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="اختر الطالب"
              name="studentId"
              value={attendanceData.studentId}
              onChange={handleChange}
              disabled={loadingStudents || submitting}
            >
              {loadingStudents ? (
                <MenuItem value="">
                  <CircularProgress size={24} />
                </MenuItem>
              ) : (
                students.map((s) => (
                  <MenuItem
                    key={s.student_id}
                    value={s.student_id}
                  >
                    {s.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              type="date"
              label="تاريخ التفقد"
              name="date"
              value={attendanceData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              disabled={submitting}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              select
              label="الحالة"
              name="status"
              value={attendanceData.status}
              onChange={handleChange}
              disabled={submitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor:
                      attendanceData.status === "حاضر"
                        ? "success.main"
                        : attendanceData.status === "غائب"
                        ? "error.main"
                        : "grey.400",
                  },
                  "&:hover fieldset": {
                    borderColor:
                      attendanceData.status === "حاضر"
                        ? "success.dark"
                        : attendanceData.status === "غائب"
                        ? "error.dark"
                        : "grey.600",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor:
                      attendanceData.status === "حاضر"
                        ? "success.main"
                        : attendanceData.status === "غائب"
                        ? "error.main"
                        : "primary.main",
                  },
                },
              }}
            >
              <MenuItem value="حاضر">
                <FaUserCheck style={{ marginRight: 8 }} />
                حاضر
              </MenuItem>
              <MenuItem value="غائب">
                <FaUserTimes style={{ marginRight: 8 }} />
                غائب
              </MenuItem>
            </TextField>
          </Grid>

          {submitError && (
            <Grid item xs={12}>
              <Alert severity="error">
                {submitError}
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={
                submitting ||
                !attendanceData.studentId ||
                !attendanceData.status
              }
              sx={{
                borderRadius: "0.5rem",
                px: 4,
                py: 1.2,
                fontWeight: 600,
                backgroundColor: "#2563eb",
                "&:hover": {
                  backgroundColor: "#1d4ed8",
                },
              }}
              startIcon={
                submitting ? (
                  <CircularProgress
                    size={20}
                    color="inherit"
                  />
                ) : null
              }
            >
              {submitting
                ? "جاري الحفظ..."
                : "حفظ التفقد"}
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
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            {modal.success ? (
              <CheckCircle sx={{ fontSize: 60, color: "green" }} />
            ) : (
              <ErrorIcon sx={{ fontSize: 60, color: "red" }} />
            )}
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: modal.success ? "green" : "red",
              fontWeight: "bold",
              textAlign: "center",
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