import express, { Request, Response } from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import axios from "axios";
import base64 from "base-64";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Test endpoint
app.get("/api/judge0/test", (req: Request, res: Response) => {
  res.json({ 
    message: "Judge0 server is running", 
    timestamp: new Date().toISOString(),
    status: "healthy"
  });
});

const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || "";
const JUDGE0_URL =
  "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true";

app.post("/api/judge0/submit", async (req: Request, res: Response) => {
  try {
    console.log("[Judge0] Incoming submission:", {
      language_id: req.body.language_id,
      has_source_code: !!req.body.source_code,
      has_stdin: !!req.body.stdin,
      stdin_length: req.body.stdin ? req.body.stdin.length : 0,
    });
    
    const { source_code, language_id, stdin } = req.body;
    if (!source_code) {
      res.status(400).json({ error: "source_code is required" });
      return;
    }
    
    const encoded_code = base64.encode(source_code);
    const data: any = {
      language_id: language_id || 71, // Default to Python 3
      source_code: encoded_code,
    };
    
    if (stdin) {
      data.stdin = base64.encode(stdin);
      console.log("[Judge0] Input provided:", stdin);
    }
    
    const headers = {
      "Content-Type": "application/json",
      "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
      "X-RapidAPI-Key": JUDGE0_API_KEY,
    };
    
    console.log("[Judge0] Sending to Judge0 API...");
    const response = await axios.post(JUDGE0_URL, data, { headers });
    console.log("[Judge0] Response received:", {
      status: response.status,
      has_stdout: !!response.data.stdout,
      has_stderr: !!response.data.stderr,
      has_compile_output: !!response.data.compile_output,
    });
    
    // Log the actual output for debugging
    if (response.data.stdout) {
      console.log("[Judge0] STDOUT:", atob(response.data.stdout));
    }
    if (response.data.stderr) {
      console.log("[Judge0] STDERR:", atob(response.data.stderr));
    }
    if (response.data.compile_output) {
      console.log("[Judge0] COMPILE OUTPUT:", atob(response.data.compile_output));
    }
    
    res.json(response.data);
  } catch (error: any) {
    console.error("Judge0 error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to execute code" });
  }
});

app.listen(PORT, () => {
  console.log(`Judge0 server running on port ${PORT}`);
});
