
import { Modal, Box, Typography, Button, Avatar, Stack } from "@mui/material";
import { FaWhatsapp } from "react-icons/fa";

const AboutIslam = ({ open, handleClose }) => {
  const whatsappNumber = "+963932642429";
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          width: { xs: "90%", sm: 420 },
          bgcolor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          p: 4,
          mx: "auto",
          mt: "8%",
          outline: "none",
          animation: "fadeIn 0.4s ease-in-out",
          "@keyframes fadeIn": {
            from: { opacity: 0, transform: "translateY(-10px)" },
            to: { opacity: 1, transform: "translateY(0)" },
          },
        }}
      >
        {/* صورة أو أيقونة */}
        <Stack alignItems="center" spacing={2} mb={2}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 72,
              height: 72,
              fontSize: 36,
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
            src="/my-photo .jpg"
            
          >
           
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            من هو إسلام؟
          </Typography>
        </Stack>

        {/* النص */}
        <Typography
          variant="body1"
          mb={3}
          sx={{ textAlign: "center", lineHeight: 1.8 }}
        >
          مطوّر <b>Full Stack</b> عملي ومنظّم، يبني أنظمة تعليمية متكاملة
          بمعمارية قابلة للتوسع، ويركّز على التكامل بين الواجهات الامامية والخلفية
          مع اهتمام كبير بالحماية والتفويض الدقيق.
        </Typography>

        {/* زر واتساب */}
        <Button
          variant="contained"
          fullWidth
          href={whatsappLink}
          target="_blank"
          startIcon={<FaWhatsapp />}
          sx={{
            bgcolor: "#25D366",
            "&:hover": { bgcolor: "#1ebe5d" },
            fontWeight: "bold",
            py: 1.2,
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(37, 211, 102, 0.4)",
          }}
        >
          احجز تصميمك هنا
        </Button>
      </Box>
    </Modal>
  );
};

export default AboutIslam;