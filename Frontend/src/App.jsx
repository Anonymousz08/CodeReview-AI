import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import CopyableCodeBlock from "./components/CopyableCodeBlock";
import "./App.css";

function extractCorrectedCode(text) {
  const match = text.match(/✅ Corrected Code:\s*([\s\S]*)/);
  return match ? match[1].trim() : null;
}

function App() {
  const [code, setCode] = useState(`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  useEffect(() => {
    if (isLoading) {
      const stages = [
        { id: 0, duration: 1500 },
        { id: 1, duration: 2000 },
        { id: 2, duration: 1500 },
      ];

      let currentStage = 0;
      setAnimationStage(0);

      const interval = setInterval(() => {
        currentStage++;
        if (currentStage < stages.length) {
          setAnimationStage(currentStage);
        } else {
          clearInterval(interval);
        }
      }, stages[currentStage]?.duration || 1500);

      return () => clearInterval(interval);
    } else {
      setAnimationStage(0);
    }
  }, [isLoading]);

  async function reviewCode() {
    setIsLoading(true);
    setReview("");
    try {
      const BackendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${BackendUrl}/ai/get-review`, {
        code,
      });
      setReview(response.data);
    } catch (error) {
      setReview("Error: Could not get code review. Please try again.");
    }
    setIsLoading(false);
  }

  const correctedCode = extractCorrectedCode(review);

  const getAnimationContent = () => {
    const stages = [
      {
        icon: "📖",
        title: "Reading Code",
        description: "Analyzing syntax and structure...",
        particles: 8,
      },
      {
        icon: "🔍",
        title: "Finding Errors",
        description: "Detecting issues and vulnerabilities...",
        particles: 12,
      },
      {
        icon: "⚡",
        title: "Generating Results",
        description: "Preparing comprehensive review...",
        particles: 10,
      },
    ];

    return stages[animationStage] || stages[0];
  };

  return (
    <div className="app-container">
      {/* ---------------- Header ---------------- */}
      <header className="header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">⚡</span> CodeReview AI
          </h1>
          <div className="header-subtitle">
            Get instant AI-powered code reviews
          </div>
        </div>
      </header>

      {/* ---------------- Main ---------------- */}
      <main className="main-content">
        {/* ----------- Code Editor Panel ----------- */}
        <div className="editor-panel">
          <div className="panel-header">
            <h2>Code Editor</h2>
            <div className="file-indicator">
              <span className="file-dot"></span> Amrit.dev
            </div>
          </div>

          <div className="editor-wrapper">
            <div className="editor-container">
              <Editor
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) =>
                  prism.highlight(
                    code,
                    prism.languages.javascript,
                    "javascript"
                  )
                }
                padding={20}
                style={{
                  fontFamily:
                    '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
                className="code-editor"
                textareaClassName="code-textarea"
                preClassName="code-pre"
              />
            </div>
          </div>

          <div className="editor-footer">
            <button
              onClick={reviewCode}
              className="review-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span> Analyzing...
                </>
              ) : (
                <>
                  <span className="button-icon">🔍</span> Review Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* ----------- Review Panel ----------- */}
        <div className="review-panel">
          <div className="panel-header">
            <h2>AI Review</h2>
            <div className="review-status">
              {isLoading ? (
                <span className="status-indicator loading">Processing</span>
              ) : review ? (
                <span className="status-indicator success">Ready</span>
              ) : (
                <span className="status-indicator idle">Waiting</span>
              )}
            </div>
          </div>

          <div className="review-content">
            {isLoading ? (
              <div className="animation-container">
                <div className="animation-stage">
                  <div className="stage-icon-wrapper">
                    <span className="stage-icon">
                      {getAnimationContent().icon}
                    </span>
                    <div className="icon-pulse"></div>
                  </div>

                  <h3 className="stage-title">{getAnimationContent().title}</h3>
                  <p className="stage-description">
                    {getAnimationContent().description}
                  </p>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${((animationStage + 1) / 3) * 100}%` }}
                    ></div>
                  </div>

                  <div className="particle-container">
                    {[...Array(getAnimationContent().particles)].map((_, i) => (
                      <div
                        key={i}
                        className="particle"
                        style={{
                          "--delay": `${i * 0.15}s`,
                          "--x": `${Math.random() * 200 - 100}px`,
                          "--y": `${Math.random() * 200 - 100}px`,
                        }}
                      ></div>
                    ))}
                  </div>

                  <div className="scanning-line"></div>
                </div>
              </div>
            ) : review ? (
              <>
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {review.replace(/✅ Corrected Code:[\s\S]*/, "").trim()}
                </Markdown>

                {correctedCode && <CopyableCodeBlock code={correctedCode} />}
              </>
            ) : (
              <div className="placeholder">
                <div className="placeholder-icon">📝</div>
                <p>
                  Click "Review Code" to get AI-powered feedback on your code
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
