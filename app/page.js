“use client”;
import { useState, useRef, useEffect } from “react”;

const CATEGORIES = [
{ id: “money”, label: “Make Money”, icon: “💰”, color: “#e8364b”, desc: “Side hustles, business ideas, income strategies” },
{ id: “fix”, label: “Fix Something”, icon: “🔧”, color: “#d4a853”, desc: “Problem-solving, troubleshooting, life fixes” },
{ id: “learn”, label: “Learn Something”, icon: “📚”, color: “#4a9eff”, desc: “Skills, knowledge, understanding complex topics” },
{ id: “build”, label: “Build Something”, icon: “🏗️”, color: “#7c5cfc”, desc: “Projects, apps, brands, businesses from scratch” },
{ id: “improve”, label: “Improve Myself”, icon: “⚡”, color: “#2ecc71”, desc: “Habits, productivity, fitness, mindset” },
{ id: “time”, label: “Save Me Time”, icon: “⏱️”, color: “#ff6b35”, desc: “Automation, efficiency, life hacks, shortcuts” },
];

const CLASS_TYPES = [
{ id: “business”, label: “Business Idea” },
{ id: “resume”, label: “Résumé” },
{ id: “website”, label: “Website” },
{ id: “tweet”, label: “Tweet / Post” },
{ id: “product”, label: “Product” },
{ id: “text”, label: “Relationship Text” },
{ id: “anything”, label: “Anything” },
];

const CLASS_COLORS = { A: “#2ecc71”, B: “#4a9eff”, C: “#d4a853”, D: “#e8364b” };

export default function Home() {
const [mode, setMode] = useState(“chat”);
const [selectedCategory, setSelectedCategory] = useState(null);
const [messages, setMessages] = useState([]);
const [input, setInput] = useState(””);
const [loading, setLoading] = useState(false);
const [classType, setClassType] = useState(“business”);
const [classInput, setClassInput] = useState(””);
const [verdict, setVerdict] = useState(null);
const [classError, setClassError] = useState(””);
const messagesEndRef = useRef(null);

useEffect(() => {
messagesEndRef.current?.scrollIntoView({ behavior: “smooth” });
}, [messages]);

function selectCategory(cat) {
setSelectedCategory(cat);
setMessages([{
role: “assistant”,
content: `You picked **${cat.label}**. What's on your mind? Give me the details and I'll give you something real to work with.`
}]);
}

async function sendMessage(e) {
e?.preventDefault();
if (!input.trim() || loading) return;
const userMsg = input.trim();
setInput(””);
setMessages(prev => […prev, { role: “user”, content: userMsg }]);
setLoading(true);
try {
const res = await fetch(”/api/chat”, {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify({
mode: “chat”,
message: userMsg,
category: selectedCategory?.label || “General”,
}),
});
const data = await res.json();
if (data.error) throw new Error(data.error);
setMessages(prev => […prev, { role: “assistant”, content: data.reply }]);
} catch (err) {
setMessages(prev => […prev, { role: “assistant”, content: `Something went wrong: ${err.message}` }]);
} finally {
setLoading(false);
}
}

async function classify() {
if (!classInput.trim() || classInput.trim().length < 10) {
setClassError(“Give us more to work with — at least a full sentence.”);
return;
}
setClassError(””);
setLoading(true);
setVerdict(null);
try {
const res = await fetch(”/api/chat”, {
method: “POST”,
headers: { “Content-Type”: “application/json” },
body: JSON.stringify({ mode: “classify”, type: classType, input: classInput.trim() }),
});
const data = await res.json();
if (data.error) throw new Error(data.error);
setVerdict(data);
} catch (err) {
setClassError(err.message || “Classification failed.”);
} finally {
setLoading(false);
}
}

function resetChat() {
setSelectedCategory(null);
setMessages([]);
setInput(””);
}

function resetVerdict() {
setVerdict(null);
setClassInput(””);
setClassError(””);
}

function formatMessage(text) {
return text
.replace(/**(.*?)**/g, “<strong>$1</strong>”)
.replace(/\n/g, “<br/>”);
}

return (
<div style={styles.page}>
{/* Header */}
<header style={styles.header}>
<div style={styles.headerInner}>
<div style={styles.logo} onClick={resetChat}>
<span style={styles.logoMark}>YBC</span>
<span style={styles.logoText}>YouBeenClassed</span>
</div>
<div style={styles.tabs}>
<button
onClick={() => { setMode(“chat”); resetVerdict(); }}
style={{ …styles.tab, …(mode === “chat” ? styles.tabActive : {}) }}
>
💬 Leverage Engine
</button>
<button
onClick={() => { setMode(“classify”); resetChat(); }}
style={{ …styles.tab, …(mode === “classify” ? styles.tabActive : {}) }}
>
⚖️ Get Classed
</button>
</div>
</div>
</header>

```
  <main style={styles.main}>
    {mode === "chat" ? (
      !selectedCategory ? (
        /* Card Selection */
        <div style={styles.cardSection}>
          <h1 style={styles.headline}>What do you need?</h1>
          <p style={styles.subhead}>Pick a lane. Get real answers. No corporate fluff.</p>
          <div style={styles.cardGrid}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat)}
                style={styles.card}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = cat.color;
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 8px 32px ${cat.color}33`;
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = "#222";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={styles.cardIcon}>{cat.icon}</span>
                <span style={styles.cardLabel}>{cat.label}</span>
                <span style={styles.cardDesc}>{cat.desc}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Chat Interface */
        <div style={styles.chatContainer}>
          <button onClick={resetChat} style={styles.backBtn}>← Back to categories</button>
          <div style={styles.chatCategoryBadge}>
            <span>{selectedCategory.icon} {selectedCategory.label}</span>
          </div>
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} style={msg.role === "user" ? styles.userMsg : styles.assistantMsg}>
                <div
                  style={msg.role === "user" ? styles.userBubble : styles.assistantBubble}
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            ))}
            {loading && (
              <div style={styles.assistantMsg}>
                <div style={styles.assistantBubble}>
                  <span style={styles.dots}>●●●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div style={styles.inputBar}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(e)}
              placeholder="Type your message..."
              style={styles.chatInput}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading || !input.trim()} style={styles.sendBtn}>
              Send
            </button>
          </div>
        </div>
      )
    ) : (
      /* Classify Mode */
      <div style={styles.classifySection}>
        {!verdict ? (
          <>
            <h1 style={styles.headline}>Get Classed</h1>
            <p style={styles.subhead}>Submit anything. We'll deliver the verdict.</p>
            <div style={styles.classifyForm}>
              <div style={styles.typeRow}>
                {CLASS_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setClassType(t.id)}
                    style={{
                      ...styles.typeBtn,
                      ...(classType === t.id ? styles.typeBtnActive : {}),
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <textarea
                value={classInput}
                onChange={e => setClassInput(e.target.value)}
                placeholder="Paste or describe what you want classified..."
                style={styles.classifyInput}
                rows={6}
              />
              {classError && <p style={styles.error}>{classError}</p>}
              <button
                onClick={classify}
                disabled={loading}
                style={styles.classifyBtn}
              >
                {loading ? "Classifying..." : "⚖️ Class It"}
              </button>
            </div>
          </>
        ) : (
          /* Verdict Display */
          <div style={styles.verdictCard}>
            <div style={{ ...styles.verdictGrade, backgroundColor: CLASS_COLORS[verdict.class] + "22", borderColor: CLASS_COLORS[verdict.class] }}>
              <span style={{ ...styles.verdictLetter, color: CLASS_COLORS[verdict.class] }}>CLASS {verdict.class}</span>
              <span style={styles.verdictLabel}>{verdict.class_label}</span>
            </div>
            <h2 style={styles.verdictSubtitle}>{verdict.subtitle}</h2>
            <div style={styles.verdictScore}>
              <div style={styles.scoreBarBg}>
                <div style={{ ...styles.scoreBarFill, width: `${verdict.score}%`, backgroundColor: CLASS_COLORS[verdict.class] }} />
              </div>
              <span style={styles.scoreNum}>{verdict.score}/100</span>
            </div>
            <p style={styles.verdictSummary}>{verdict.summary}</p>
            <div style={styles.verdictDetails}>
              <div style={styles.verdictDetail}>
                <span style={styles.detailLabel}>💪 Strength</span>
                <p style={styles.detailText}>{verdict.strength}</p>
              </div>
              <div style={styles.verdictDetail}>
                <span style={styles.detailLabel}>⚠️ Weakness</span>
                <p style={styles.detailText}>{verdict.weakness}</p>
              </div>
            </div>
            <blockquote style={styles.finalQuote}>"{verdict.final_quote}"</blockquote>
            <button onClick={resetVerdict} style={styles.classifyBtn}>Class Something Else</button>
          </div>
        )}
      </div>
    )}
  </main>

  <footer style={styles.footer}>
    <p>YouBeenClassed — The Human Leverage Engine</p>
  </footer>
</div>
```

);
}

const styles = {
page: {
minHeight: “100vh”,
backgroundColor: “#0a0a0a”,
color: “#f0f0f0”,
fontFamily: “‘Space Grotesk’, sans-serif”,
display: “flex”,
flexDirection: “column”,
},
header: {
borderBottom: “1px solid #1a1a1a”,
backgroundColor: “#0d0d0d”,
position: “sticky”,
top: 0,
zIndex: 100,
},
headerInner: {
maxWidth: 900,
margin: “0 auto”,
padding: “12px 20px”,
display: “flex”,
justifyContent: “space-between”,
alignItems: “center”,
flexWrap: “wrap”,
gap: 12,
},
logo: {
display: “flex”,
alignItems: “center”,
gap: 10,
cursor: “pointer”,
},
logoMark: {
background: “linear-gradient(135deg, #e8364b, #d4a853)”,
WebkitBackgroundClip: “text”,
WebkitTextFillColor: “transparent”,
fontWeight: 700,
fontSize: 22,
letterSpacing: -1,
},
logoText: {
color: “#888”,
fontSize: 14,
fontWeight: 500,
letterSpacing: 1,
},
tabs: {
display: “flex”,
gap: 4,
backgroundColor: “#151515”,
borderRadius: 10,
padding: 3,
},
tab: {
padding: “8px 16px”,
border: “none”,
borderRadius: 8,
backgroundColor: “transparent”,
color: “#888”,
fontFamily: “‘Space Grotesk’, sans-serif”,
fontSize: 13,
fontWeight: 500,
cursor: “pointer”,
transition: “all 0.2s”,
},
tabActive: {
backgroundColor: “#1a1a1a”,
color: “#f0f0f0”,
},
main: {
flex: 1,
maxWidth: 900,
margin: “0 auto”,
width: “100%”,
padding: “0 20px”,
},
cardSection: {
paddingTop: 60,
paddingBottom: 40,
},
headline: {
fontSize: “clamp(28px, 5vw, 42px)”,
fontWeight: 700,
margin: “0 0 8px 0”,
background: “linear-gradient(135deg, #f0f0f0, #888)”,
WebkitBackgroundClip: “text”,
WebkitTextFillColor: “transparent”,
},
subhead: {
fontSize: 16,
color: “#666”,
margin: “0 0 40px 0”,
fontWeight: 400,
},
cardGrid: {
display: “grid”,
gridTemplateColumns: “repeat(auto-fill, minmax(260px, 1fr))”,
gap: 16,
},
card: {
display: “flex”,
flexDirection: “column”,
alignItems: “flex-start”,
gap: 8,
padding: “24px 20px”,
backgroundColor: “#111”,
border: “1px solid #222”,
borderRadius: 14,
cursor: “pointer”,
transition: “all 0.25s ease”,
textAlign: “left”,
fontFamily: “‘Space Grotesk’, sans-serif”,
},
cardIcon: {
fontSize: 28,
},
cardLabel: {
fontSize: 17,
fontWeight: 600,
color: “#f0f0f0”,
},
cardDesc: {
fontSize: 13,
color: “#666”,
lineHeight: 1.4,
},
chatContainer: {
display: “flex”,
flexDirection: “column”,
height: “calc(100vh - 130px)”,
paddingTop: 16,
},
backBtn: {
background: “none”,
border: “none”,
color: “#666”,
fontSize: 13,
cursor: “pointer”,
padding: “4px 0”,
fontFamily: “‘Space Grotesk’, sans-serif”,
textAlign: “left”,
marginBottom: 8,
},
chatCategoryBadge: {
display: “inline-flex”,
padding: “6px 14px”,
backgroundColor: “#151515”,
border: “1px solid #222”,
borderRadius: 20,
fontSize: 13,
color: “#aaa”,
marginBottom: 16,
alignSelf: “flex-start”,
},
messages: {
flex: 1,
overflowY: “auto”,
display: “flex”,
flexDirection: “column”,
gap: 12,
paddingBottom: 16,
},
userMsg: {
display: “flex”,
justifyContent: “flex-end”,
},
assistantMsg: {
display: “flex”,
justifyContent: “flex-start”,
},
userBubble: {
maxWidth: “80%”,
padding: “12px 16px”,
backgroundColor: “#e8364b”,
color: “#fff”,
borderRadius: “18px 18px 4px 18px”,
fontSize: 14,
lineHeight: 1.5,
},
assistantBubble: {
maxWidth: “80%”,
padding: “12px 16px”,
backgroundColor: “#1a1a1a”,
color: “#ddd”,
borderRadius: “18px 18px 18px 4px”,
fontSize: 14,
lineHeight: 1.6,
border: “1px solid #222”,
},
dots: {
color: “#555”,
animation: “pulse 1.2s infinite”,
letterSpacing: 3,
},
inputBar: {
display: “flex”,
gap: 8,
padding: “12px 0”,
borderTop: “1px solid #1a1a1a”,
},
chatInput: {
flex: 1,
padding: “14px 18px”,
backgroundColor: “#111”,
border: “1px solid #222”,
borderRadius: 12,
color: “#f0f0f0”,
fontSize: 15,
fontFamily: “‘Space Grotesk’, sans-serif”,
outline: “none”,
},
sendBtn: {
padding: “14px 24px”,
backgroundColor: “#e8364b”,
color: “#fff”,
border: “none”,
borderRadius: 12,
fontSize: 14,
fontWeight: 600,
cursor: “pointer”,
fontFamily: “‘Space Grotesk’, sans-serif”,
transition: “opacity 0.2s”,
},
classifySection: {
paddingTop: 60,
paddingBottom: 40,
},
classifyForm: {
display: “flex”,
flexDirection: “column”,
gap: 16,
maxWidth: 640,
},
typeRow: {
display: “flex”,
flexWrap: “wrap”,
gap: 6,
},
typeBtn: {
padding: “8px 14px”,
backgroundColor: “#151515”,
border: “1px solid #222”,
borderRadius: 8,
color: “#888”,
fontSize: 13,
cursor: “pointer”,
fontFamily: “‘Space Grotesk’, sans-serif”,
transition: “all 0.2s”,
},
typeBtnActive: {
backgroundColor: “#e8364b22”,
borderColor: “#e8364b”,
color: “#e8364b”,
},
classifyInput: {
padding: “16px”,
backgroundColor: “#111”,
border: “1px solid #222”,
borderRadius: 12,
color: “#f0f0f0”,
fontSize: 15,
fontFamily: “‘Space Grotesk’, sans-serif”,
outline: “none”,
resize: “vertical”,
lineHeight: 1.5,
},
error: {
color: “#e8364b”,
fontSize: 13,
margin: 0,
},
classifyBtn: {
padding: “14px 28px”,
background: “linear-gradient(135deg, #e8364b, #c12d3f)”,
color: “#fff”,
border: “none”,
borderRadius: 12,
fontSize: 15,
fontWeight: 600,
cursor: “pointer”,
fontFamily: “‘Space Grotesk’, sans-serif”,
alignSelf: “flex-start”,
transition: “opacity 0.2s”,
},
verdictCard: {
maxWidth: 640,
display: “flex”,
flexDirection: “column”,
gap: 20,
},
verdictGrade: {
display: “flex”,
alignItems: “center”,
gap: 16,
padding: “20px 24px”,
borderRadius: 14,
border: “2px solid”,
},
verdictLetter: {
fontSize: 32,
fontWeight: 700,
fontFamily: “‘JetBrains Mono’, monospace”,
},
verdictLabel: {
fontSize: 18,
fontWeight: 600,
color: “#aaa”,
},
verdictSubtitle: {
fontSize: 22,
fontWeight: 600,
margin: 0,
color: “#f0f0f0”,
},
verdictScore: {
display: “flex”,
alignItems: “center”,
gap: 12,
},
scoreBarBg: {
flex: 1,
height: 8,
backgroundColor: “#1a1a1a”,
borderRadius: 4,
overflow: “hidden”,
},
scoreBarFill: {
height: “100%”,
borderRadius: 4,
transition: “width 0.8s ease”,
},
scoreNum: {
fontSize: 14,
fontWeight: 600,
color: “#888”,
fontFamily: “‘JetBrains Mono’, monospace”,
},
verdictSummary: {
fontSize: 15,
lineHeight: 1.6,
color: “#bbb”,
margin: 0,
},
verdictDetails: {
display: “grid”,
gridTemplateColumns: “1fr 1fr”,
gap: 12,
},
verdictDetail: {
padding: 16,
backgroundColor: “#111”,
borderRadius: 12,
border: “1px solid #1a1a1a”,
},
detailLabel: {
fontSize: 13,
fontWeight: 600,
color: “#888”,
display: “block”,
marginBottom: 6,
},
detailText: {
fontSize: 14,
color: “#ccc”,
lineHeight: 1.5,
margin: 0,
},
finalQuote: {
fontSize: 16,
fontStyle: “italic”,
color: “#d4a853”,
borderLeft: “3px solid #d4a853”,
paddingLeft: 16,
margin: “4px 0”,
lineHeight: 1.5,
},
footer: {
borderTop: “1px solid #1a1a1a”,
padding: “20px”,
textAlign: “center”,
color: “#333”,
fontSize: 12,
},
};