import http from "k6/http";
import { sleep, check } from "k6";

// URL base ke host dari dalam container k6
const BASE_URL = "http://localhost:30000";

// Konfigurasi: 100 user concurrent bertahap
export let options = {
  stages: [
    { duration: "20s", target: 100 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.10"],     
    http_req_duration: ["p(95)<1000"]   
  }
};

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyX2s4c0B0ZXN0LmNvbSIsImlhdCI6MTc2NTIxNjkwMiwiZXhwIjoxNzY1MzAzMzAyfQ.w4CX6CViwTsZ_aPbJJe-AIWpPAjHFgYjg909NXWO7dQ";

export default function () {
  const payload = JSON.stringify({
    jarak: 20,
    berat: 5
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${TOKEN}`
    }
  };

  const res = http.post(`${BASE_URL}/ai/predict`, payload, params);

  check(res, {
    "status 200": (r) => r.status === 200,
    "punya estimasi_hari": (r) => r.json("estimasi_hari") !== undefined
  });

  sleep(1);
}
