import React from "react";
import { Container, Grid, Typography, Card, CardContent, List, ListItem, ListItemText, CardMedia } from "@mui/material";
import { Send, Group, BarChart, History, Api, SmartToy } from "@mui/icons-material";

const features = [
  {
    title: "ส่งข้อความตามต้องการ",
    description: "รองรับการส่งข้อความหลายรูปแบบ เช่น ข้อความธรรมดา, รูปภาพ, วิดีโอ และข้อความตอบกลับอัตโนมัติ.",
    details: [
      "ข้อความตอบกลับอัตโนมัติ",
      "Broadcast Messages",
      "Rich Menu & Flex Messages",
    ],
    icon: <Send fontSize="large" color="primary" />, 
    image: "/msg1.png",
  },
  {
    title: "จัดกลุ่มลูกค้า (Audiences)",
    description: "บริหารกลุ่มลูกค้า แบ่งกลุ่มตามพฤติกรรมการใช้งาน เพื่อส่งข้อความที่ตรงเป้าหมายมากขึ้น.",
    details: [
      "สร้างและจัดการกลุ่มผู้ใช้",
      "กำหนดเงื่อนไขการแบ่งกลุ่ม",
      "ส่งข้อความเฉพาะกลุ่ม",
    ],
    icon: <Group fontSize="large" color="primary" />, 
    image: "/audiences.png",
  },
  {
    title: "ดูสถิติการใช้งาน",
    description: "วิเคราะห์ข้อมูลการใช้งาน chatbot ผ่านรายงานและกราฟสถิติ.",
    details: [
      "จำนวนข้อความที่ส่ง-รับ",
      "จำนวนผู้ใช้งาน",
      "พฤติกรรมการใช้งาน chatbot",
    ],
    icon: <BarChart fontSize="large" color="primary" />, 
    image: "/static.png",
  },
  {
    title: "บันทึกการส่งข้อความ (Log)",
    description: "จัดเก็บประวัติการสนทนา และสามารถนำไปวิเคราะห์เพิ่มเติมได้.",
    details: [
      "บันทึกประวัติการสนทนา",
      "เรียกดูของแต่ละคน",

    ],
    icon: <History fontSize="large" color="primary" />, 
    image: "/log.png",
  },
  {
    title: "เรียกใช้ Third-Party APIs",
    description: "สามารถเชื่อมต่อ API ภายนอกเพื่อเพิ่มความสามารถของ chatbot ได้.",
    details: [
      "รองรับการเชื่อมต่อ API",
      "กำหนดค่าและทดสอบ API",
      "ดึงข้อมูลแบบ Real-time",
    ],
    icon: <Api fontSize="large" color="primary" />, 
    image: "/api2.png",
  },
  {
    title: "ตอบกลับด้วย AI Model",
    description: "เพิ่มความสามารถของ chatbot ด้วย AI ที่สามารถเรียนรู้และโต้ตอบได้อย่างชาญฉลาด.",
    details: [
      "รองรับ AI Chatbot",
      "ฝึกโมเดลเพื่อพัฒนาการตอบ",
      "AI วิเคราะห์คำถามและตอบให้ตรงจุด",
    ],
    icon: <SmartToy fontSize="large" color="primary" />, 
    image: "/ai.png",
  },
];

const FeatureCard = ({ title, description, details, icon, image }) => (
  <Card variant="outlined" sx={{ height: "100%", p: 2, display: "flex", flexDirection: "column" }}>

    <CardContent sx={{ flexGrow: 1 }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        {icon}
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold", marginLeft: 1 }}>
          {title}
        </Typography>
      </div>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      <List dense>
        {details.map((detail, index) => (
          <ListItem key={index} disablePadding>
            <ListItemText primary={detail} />
          </ListItem>
        ))}
      </List>
    </CardContent>
    <CardMedia
      component="img"
      height="200"  // Set a fixed height for consistency
      image={image}
      alt={title}
      sx={{
        objectFit: "cover",  // Ensures the image fills the space without stretching
      }}
    />
  </Card>
);

const FeaturesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: "bold", my: 3 }}>
        Middleware Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturesPage;
