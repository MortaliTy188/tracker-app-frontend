import { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  FormControlLabel,
  Checkbox,
  Link,
  Slide,
} from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState(""); // состояние для email
  const [password, setPassword] = useState(""); // состояние для пароля
  const [name, setName] = useState(""); // состояние для имени (только для регистрации)
  const [isRegister, setIsRegister] = useState(false); // состояние для переключения между регистрацией и входом

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isRegister && password.length < 6) {
      alert("Пароль должен быть минимум 6 символов");
      return;
    }

    try {
      const response = await axios.post(
        isRegister
          ? "http://localhost:3000/api/users/register"
          : "http://localhost:3000/api/users/login",
        isRegister ? { name, email, password } : { email, password }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const imageContent = (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        height: "100%",
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
        alt="Login illustration"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 30,
        }}
      />
    </Box>
  );

  const formContent = (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textAlign: "left",
        padding: 5,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: 60 }}>
        Tracker App
      </Typography>

      <Box>
        <Typography variant="h2">
          {isRegister ? `Glad to see you` : "Holla, Welcome Back"}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 20 }}>
          {isRegister
            ? "Please register to continue"
            : "Hey, welcome back to your special place"}
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {isRegister && (
          <TextField
            label="Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          ></TextField>
        )}
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={<Checkbox />}
            label={<Typography variant="body2">Remember me</Typography>}
          />
          <Link href="/forgot-password" variant="body2">
            Forgot Password?
          </Link>
        </Box>
        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#115293",
            },
          }}
        >
          {isRegister ? "Register" : "Login"}
        </Button>
      </Box>
      <Box>
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          <>
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <Link
              href="#"
              onClick={() => setIsRegister(!isRegister)}
              sx={{ textDecoration: "none", color: "#1976d2" }}
            >
              {isRegister ? "Login" : "Register"}
            </Link>
          </>
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: "80%",
          height: "80%",
          display: "flex",
          gap: 2,
          borderRadius: 10,
        }}
      >
        <Slide
          direction="right"
          in={isRegister}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <div
            style={{
              display: isRegister ? "flex" : "none",
              width: "100%",
              height: "100%",
            }}
          >
            {imageContent}
            {formContent}
          </div>
        </Slide>
        <Slide
          direction="left"
          in={!isRegister}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <div
            style={{
              display: !isRegister ? "flex" : "none",
              width: "100%",
              height: "100%",
            }}
          >
            {formContent}
            {imageContent}
          </div>
        </Slide>
      </Paper>
    </Box>
  );
}
