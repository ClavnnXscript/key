// pages/step2.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Step2() {
  const router = useRouter();
  const { completed } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (completed === undefined) return; // wait until query is ready
    if (completed !== "2") {
      router.push("/");
    } else {
      setLoading(false);
    }
  }, [completed]);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>;
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Step 2 Completed ✅</h1>
      <p>You have successfully completed the second shortlink.</p>
      <a
        href="/display"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#2196F3",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
        }}
      >
        Generate Your Key 🔑
      </a>
    </div>
  );
    }
