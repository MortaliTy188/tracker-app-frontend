import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Chip,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  PlayArrow,
  School,
  Timeline,
  Groups,
  EmojiEvents,
  Notes,
  Psychology,
  AutoAwesome,
  Star,
  CheckCircle,
  TrendingUp,
  Chat,
  Security,
  Language,
  Speed,
  ExpandMore,
  LocalFireDepartment,
  Assignment,
  People,
  Insights,
} from "@mui/icons-material";
import Navbar from "../components/Navbar";
import LanguageSwitcher from "../components/LanguageSwitcher";
import AnimatedCounter from "../components/AnimatedCounter";
import AnimatedBox from "../components/AnimatedBox";
import TypewriterText from "../components/TypewriterText";
import FadeInOnScroll from "../components/FadeInOnScroll";
import useIntersectionObserver from "../hooks/useIntersectionObserver";

export default function LandingPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  const [selectedFeature, setSelectedFeature] = useState(0);

  // Хук для отслеживания видимости секции статистики
  const [statsRef, isStatsVisible, hasStatsIntersected] =
    useIntersectionObserver({
      threshold: 0.3,
    });

  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleDemo = () => {
    navigate("/dashboard");
  };

  const features = [
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: t("landing.features.skillManagement.title"),
      description: t("landing.features.skillManagement.description"),
      color: theme.palette.primary.main,
    },
    {
      icon: <Assignment sx={{ fontSize: 40 }} />,
      title: t("landing.features.topicOrganization.title"),
      description: t("landing.features.topicOrganization.description"),
      color: theme.palette.secondary.main,
    },
    {
      icon: <Notes sx={{ fontSize: 40 }} />,
      title: t("landing.features.smartNotes.title"),
      description: t("landing.features.smartNotes.description"),
      color: theme.palette.success.main,
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: t("landing.features.achievements.title"),
      description: t("landing.features.achievements.description"),
      color: theme.palette.warning.main,
    },
    {
      icon: <Groups sx={{ fontSize: 40 }} />,
      title: t("landing.features.social.title"),
      description: t("landing.features.social.description"),
      color: theme.palette.info.main,
    },
    {
      icon: <Chat sx={{ fontSize: 40 }} />,
      title: t("landing.features.chat.title"),
      description: t("landing.features.chat.description"),
      color: theme.palette.error.main,
    },
  ];

  const stats = [
    {
      label: t("landing.stats.activeUsers"),
      value: "10,000+",
      icon: <People />,
    },
    {
      label: t("landing.stats.skillsTracked"),
      value: "50,000+",
      icon: <School />,
    },
    {
      label: t("landing.stats.topicsLearned"),
      value: "200,000+",
      icon: <Assignment />,
    },
    {
      label: t("landing.stats.notesCreated"),
      value: "700,000+",
      icon: <Notes />,
    },
  ];

  const testimonials = [
    {
      name: t("landing.testimonials.user1.name"),
      role: t("landing.testimonials.user1.role"),
      avatar: "/images/avatar1.jpg",
      rating: 5,
      comment: t("landing.testimonials.user1.comment"),
    },
    {
      name: t("landing.testimonials.user2.name"),
      role: t("landing.testimonials.user2.role"),
      avatar: "/images/avatar2.jpg",
      rating: 5,
      comment: t("landing.testimonials.user2.comment"),
    },
    {
      name: t("landing.testimonials.user3.name"),
      role: t("landing.testimonials.user3.role"),
      avatar: "/images/avatar3.jpg",
      rating: 5,
      comment: t("landing.testimonials.user3.comment"),
    },
  ];

  const faqs = [
    {
      question: t("landing.faq.whatIs.question"),
      answer: t("landing.faq.whatIs.answer"),
    },
    {
      question: t("landing.faq.pricing.question"),
      answer: t("landing.faq.pricing.answer"),
    },
    {
      question: t("landing.faq.offline.question"),
      answer: t("landing.faq.offline.answer"),
    },
    {
      question: t("landing.faq.mobile.question"),
      answer: t("landing.faq.mobile.answer"),
    },
  ];

  return (
    <Box sx={{ width: "100%", overflowX: "hidden" }}>
      <Navbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          pt: 8,
          pb: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent={"center"}
          >
            <Grid item xs={12} md={6}>
              <FadeInOnScroll direction="left" delay={300}>
                <TypewriterText
                  text={t("landing.hero.title")}
                  speed={100}
                  component="h1"
                  variant="h2"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                />
              </FadeInOnScroll>
              <FadeInOnScroll direction="left" delay={800}>
                <Typography variant="h5" color="text.secondary" paragraph>
                  {t("landing.hero.subtitle")}
                </Typography>
              </FadeInOnScroll>
              <FadeInOnScroll direction="up" delay={1200}>
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    gap: 2,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <AnimatedBox animation="pulse" infinite>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<PlayArrow />}
                      onClick={handleGetStarted}
                      sx={{ px: 4, py: 1.5 }}
                    >
                      {t("landing.hero.startFree")}
                    </Button>
                  </AnimatedBox>
                </Box>
              </FadeInOnScroll>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                textAlign: "center",
              }}
            >
              <FadeInOnScroll direction="right" delay={600}>
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AnimatedBox animation="float" infinite duration="3s">
                    <Card
                      sx={{
                        maxWidth: 400,
                        boxShadow: theme.shadows[10],
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          📚 {t("landing.demo.skillsTitle")}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            {t("landing.demo.reactProgress")}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={75}
                            sx={{ mb: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            75% {t("landing.demo.completed")}
                          </Typography>
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" gutterBottom>
                            {t("landing.demo.nodeProgress")}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={60}
                            sx={{ mb: 1, height: 8, borderRadius: 4 }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            60% {t("landing.demo.completed")}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                          <Chip
                            icon={<EmojiEvents />}
                            label={t("landing.demo.beginnerLevel")}
                            size="small"
                            color="primary"
                          />
                          <Chip
                            icon={<LocalFireDepartment />}
                            label={`7 ${t("landing.demo.daysStreak")}`}
                            size="small"
                            color="secondary"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </AnimatedBox>
                </Box>
              </FadeInOnScroll>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <FadeInOnScroll direction="up" delay={100}>
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {t("landing.features.title")}
          </Typography>
        </FadeInOnScroll>
        <FadeInOnScroll direction="up" delay={200}>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            {t("landing.features.subtitle")}
          </Typography>
        </FadeInOnScroll>

        <Grid container spacing={3} justifyContent={"center"}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <FadeInOnScroll delay={index * 200}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    textAlign: "center",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                        color: feature.color,
                      }}
                    >
                      {feature.icon}
                      <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                        {feature.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box
        ref={statsRef}
        sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05), py: 6 }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent={"center"}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box textAlign="center">
                  <IconButton
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                      mb: 2,
                      "&:hover": {
                        backgroundColor: theme.palette.primary.dark,
                      },
                    }}
                  >
                    {stat.icon}
                  </IconButton>
                  <AnimatedCounter
                    value={stat.value}
                    startAnimation={hasStatsIntersected}
                    variant="h4"
                    fontWeight="bold"
                    gutterBottom
                  />
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <FadeInOnScroll direction="up" delay={100}>
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {t("landing.testimonials.title")}
          </Typography>
        </FadeInOnScroll>
        <FadeInOnScroll direction="up" delay={200}>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 6 }}
          >
            {t("landing.testimonials.subtitle")}
          </Typography>
        </FadeInOnScroll>

        <Grid container spacing={4} justifyContent={"center"}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index} sx={{ display: "flex" }}>
              <FadeInOnScroll direction="up" delay={index * 200 + 300}>
                <Card
                  sx={{
                    width: "100%",
                    maxWidth: 340,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: theme.shadows[16],
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Avatar
                        src={testimonial.avatar}
                        sx={{ width: 50, height: 50, mr: 2 }}
                      >
                        {testimonial.name[0]}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {testimonial.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          textAlign={"left"}
                        >
                          {testimonial.role}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating
                      value={testimonial.rating}
                      readOnly
                      sx={{ mb: 2 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ flexGrow: 1 }}
                    >
                      "{testimonial.comment}"
                    </Typography>
                  </CardContent>
                </Card>
              </FadeInOnScroll>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Key Benefits */}
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.secondary.main, 0.05),
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <FadeInOnScroll direction="up" delay={200}>
            <Typography
              variant="h3"
              component="h2"
              textAlign="center"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {t("landing.benefits.title")}
            </Typography>
          </FadeInOnScroll>

          <Grid container spacing={4} sx={{ mt: 4, justifyContent: "center" }}>
            <Grid item xs={12} md={6}>
              <FadeInOnScroll direction="left" delay={400}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("landing.benefits.easeOfUse.title")}
                      secondary={t("landing.benefits.easeOfUse.description")}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Language color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("landing.benefits.multilingual.title")}
                      secondary={t("landing.benefits.multilingual.description")}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Security color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("landing.benefits.security.title")}
                      secondary={t("landing.benefits.security.description")}
                    />
                  </ListItem>
                </List>
              </FadeInOnScroll>
            </Grid>
            <Grid item xs={12} md={6}>
              <FadeInOnScroll direction="right" delay={600}>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <Speed color="warning" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("landing.benefits.performance.title")}
                      secondary={t("landing.benefits.performance.description")}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Insights color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("landing.benefits.analytics.title")}
                      secondary={t("landing.benefits.analytics.description")}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesome color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={t("landing.benefits.gamification.title")}
                      secondary={t("landing.benefits.gamification.description")}
                    />
                  </ListItem>
                </List>
              </FadeInOnScroll>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <FadeInOnScroll direction="up" delay={100}>
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {t("landing.faq.title")}
          </Typography>
        </FadeInOnScroll>

        <Box sx={{ mt: 4 }}>
          {faqs.map((faq, index) => (
            <FadeInOnScroll key={index} delay={200 + index * 100}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            </FadeInOnScroll>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: "#fff",
          py: 8,
        }}
      >
        <Container maxWidth="md" textAlign="center">
          <FadeInOnScroll direction="up" delay={200}>
            <Typography
              variant="h3"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              {t("landing.cta.title")}
            </Typography>
          </FadeInOnScroll>
          <FadeInOnScroll direction="up" delay={400}>
            <Typography variant="h6" paragraph sx={{ opacity: 0.9 }}>
              {t("landing.cta.subtitle")}
            </Typography>
          </FadeInOnScroll>
          <FadeInOnScroll direction="up" delay={600}>
            <Box sx={{ mt: 4 }}>
              <AnimatedBox animation="pulse" infinite>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    backgroundColor: "#fff",
                    color: theme.palette.primary.main,
                    px: 4,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: alpha("#fff", 0.9),
                    },
                  }}
                >
                  {t("landing.cta.startNow")}
                </Button>
              </AnimatedBox>
            </Box>
          </FadeInOnScroll>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: alpha(theme.palette.grey[900], 0.9),
          color: "#fff",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent={"center"}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Tracker App
              </Typography>
              <Typography variant="body2" color="grey.400">
                {t("landing.footer.description")}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <LanguageSwitcher />
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: alpha("#fff", 0.1) }} />
          <Typography variant="body2" textAlign="center" color="grey.400">
            {t("landing.footer.copyright")}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
