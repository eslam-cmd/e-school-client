"use client";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Grid,
  useTheme,
  useMediaQuery,
  Fade,
} from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditDocumentIcon from '@mui/icons-material/EditDocument';
import EditSquareIcon from '@mui/icons-material/EditSquare';
import { useEffect, useState } from "react";

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(false);
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem("studentId");
    const studentName = localStorage.getItem("studentName");
    const studentSpecialization = localStorage.getItem("studentSpecialization");
    const teacherId = localStorage.getItem("teacherId");

    if (studentId && studentName && studentSpecialization) {
      setIsStudentLoggedIn(true);
    }
    if (teacherId) {
      setIsTeacherLoggedIn(true);
    }
  }, []);

  return (
    <Box
      dir="rtl"
      sx={{
        background: "linear-gradient(135deg, #0D8CAB 0%, #004E64 100%)",
        color: "white",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        pt: 8,
      }}
    >
      {/* تأثير إضاءة خلفية */}
      <Box
        sx={{
          position: "absolute",
          top: -150,
          right: -150,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <Container maxWidth="lg">
        <Grid
          container
          spacing={6}
          alignItems="center"
          direction={isMobile ? "column" : "row-reverse"}
        >
          <Grid item xs={12}>
            <Fade in timeout={1000}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row-reverse" },
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                {/* الصورة */}
                <Box
                  sx={{
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    overflow: "hidden",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
                    border: "5px solid rgba(255,255,255,0.8)",
                    flexShrink: 0,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      boxShadow: "0 0 40px rgba(255,255,255,0.4)",
                      zIndex: -1,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/logo5.jpeg"
                    alt="Logo"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>

                {/* النص والأزرار */}
                <Box
                  sx={{
                    ml: { md: "140px" },
                    textAlign: { xs: "center", md: "right" },
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    variant={isMobile ? "h3" : "h2"}
                    gutterBottom
                    sx={{
                      fontWeight: 900,
                      lineHeight: 1.2,
                      mb: 3,
                      fontSize: { lg: "50px", md: "45px", xs: "35px" },
                      color: "#fff",
                      textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
                    }}
                  >
                    أهلاً بكم في معهد الأوائل
                  </Typography>
                  <Typography
                    variant={isMobile ? "body1" : "h6"}
                    sx={{
                      mb: 4,
                      opacity: 0.95,
                      lineHeight: 1.8,
                      fontSize: "20px",
                      color: "rgba(255,255,255,0.9)",
                      maxWidth: 500,
                    }}
                  >
                    نظام تعليمي متكامل يربط الطلاب والمعلمين في بيئة تفاعلية
                    متطورة لتجربة تعليمية استثنائية
                  </Typography>

                  <Stack
                    direction={isMobile ? "column" : "row"}
                    spacing={2}
                    justifyContent={{ xs: "center", md: "flex-end" }}
                  >
                    {isStudentLoggedIn ? (
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={<MeetingRoomIcon />}
                        href="/student/my-account"
                        sx={{
                          borderRadius: 3,
                          py: 1.5,
                          px: 4,
                          fontSize: "1rem",
                          transition:".5s",
                          fontWeight: 700,
                          background: "linear-gradient(90deg, #E3F2FD, #BBDEFB)",
                          color: "#000",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                          },
                        }}
                      >
                        دخول إلى حسابي
                      </Button>
                    ) : isTeacherLoggedIn ? (
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={<MeetingRoomIcon />}
                        href="/teacher/dashboard-admin"
                        sx={{
                          borderRadius: 3,
                          py: 1.5,
                          px: 4,
                          fontSize: "1rem",
                          fontWeight: 700,
                          transition:".5s",
                          background: "linear-gradient(90deg, #E3F2FD, #BBDEFB)",
                          color: "#000",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                          },
                        }}
                      >
                        دخول إلى لوحة التحكم
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          size="large"
                          endIcon={<MeetingRoomIcon />}
                          href="/student/login"
                          sx={{
                            borderRadius: 3,
                            py: 1.5,
                            px: 4,
                            fontSize: "1rem",
                            transition:".5s",
                            fontWeight: 700,
                            minWidth: 200,
                            background: "linear-gradient(90deg, #E3F2FD, #BBDEFB)",
                            color: "#000",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                            "&:hover": {
                              transform: "translateY(-3px)",
                              boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
                            },
                          }}
                        >
                          دخول الطالب
                        </Button>

                        <Button
                          variant="outlined"
                          color="inherit"
                          size="large"
                          endIcon={<EditNoteIcon />}
                          href="/teacher/login"
                          sx={{
                            borderRadius: 3,
                            py: 1.5,
                            px: 4,
                            fontSize: "1rem",
                            fontWeight: 700,
                            minWidth: 200,
                            transition:".5s",
                            borderWidth: 2,
                            borderColor: "rgba(255,255,255,0.8)",
                            color: "#fff",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.1)",
                              transform: "translateY(-3px)",
                            },
                          }}
                        >
                          {" "}
                          دخول المعلم
                        </Button>
                      </>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}