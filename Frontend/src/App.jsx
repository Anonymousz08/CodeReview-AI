import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [code, setCode] = useState(`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`);

  const [review, setReview] = useState(``);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    setIsLoading(true);
    try {
     const BackendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${BackendUrl}/ai/get-review`, {
        code,
      });
      });
      setReview(response.data);
    } catch (error) {
      setReview("Error: Could not get code review. Please try again.");
    }
    setIsLoading(false);
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">⚡</span>
            CodeReview AI
          </h1>
          <div className="header-subtitle">
            Get instant AI-powered code reviews
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="editor-panel">
          <div className="panel-header">
            <h2>Code Editor</h2>
            <div className="file-indicator">
              <span className="file-dot"></span>
              Amrit.dev
            </div>
          </div>
          <div className="editor-container">
            <Editor
              value={code}
              onValueChange={(code) => setCode(code)}
              highlight={(code) =>
                prism.highlight(code, prism.languages.javascript, "javascript")
              }
              padding={20}
              style={{
                fontFamily:
                  '"JetBrains Mono", "Fira Code", "Consolas", monospace',
                fontSize: 14,
                lineHeight: 1.6,
                height: "100%",
                width: "100%",
                background: "transparent",
                outline: "none",
                border: "none",
                color: "#e8e8e8",
              }}
              className="code-editor"
            />
          </div>
          <div className="editor-footer">
            <button
              onClick={reviewCode}
              className="review-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="button-icon">🔍</span>
                  Review Code
                </>
              )}
            </button>
          </div>
        </div>

        <div className="review-panel">
          <div className="panel-header">
            <h2>AI Review</h2>
            <div className="review-status">
              {review ? (
                <span className="status-indicator success">Ready</span>
              ) : (
                <span className="status-indicator idle">Waiting</span>
              )}
            </div>
          </div>
          <div className="review-content">
            {review ? (
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
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
