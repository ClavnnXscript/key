// pages/step1.js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Step1() {
  const router = useRouter();
  const { completed } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (completed === undefined) return; // wait until query is ready
    if (completed !== "1") {
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
      <h1>Step 1 Completed ✅</h1>
      <p>You have successfully completed the first shortlink.</p>
      <a
        href="https://shrinkme.top/getkey2?return=https://key-sooty-chi.vercel.app/step2?completed=2"
        style={{
          display: "inline-block",
          padding: "10px 20px",
          marginTop: "20px",
          backgroundColor: "#4CAF50",
          color: "white",
          textDecoration: "none",
          borderRadius: "8px",
        }}
      >
        Continue to Step 2 →
      </a>
    </div>
  );
}
