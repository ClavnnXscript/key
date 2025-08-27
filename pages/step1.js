// pages/step1.js
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Step1() {
  const router = useRouter();
  const { completed } = router.query;

  useEffect(() => {
    // Redirect back home if query param is missing or invalid
    if (completed !== "1") {
      router.push("/");
    }
  }, [completed]);

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
