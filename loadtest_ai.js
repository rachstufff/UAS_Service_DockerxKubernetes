import http from "k6/http";
import { sleep, check } from "k6";

// URL base ke host dari dalam container k6
const BASE_URL = "http://host.docker.internal:30000";

// Konfigurasi: 100 user concurrent bertahap
export let options = {
  stages: [{ duration: "20s", target: 100 }],
  thresholds: {
    http_req_failed: ["rate<0.10"],
    http_req_duration: ["p(95)<1000"],
  },
};

// Isi dan gunakan Token Valid dari login dengan user
const TOKEN =
  "";

export default function () {
  const payload = JSON.stringify({
    jarak: 20,
    berat: 5,
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  const res = http.post(`${BASE_URL}/ai/predict`, payload, params);

  check(res, {
    "status 200": (r) => r.status === 200,
    "punya estimasi_hari": (r) => r.json("estimasi_hari") !== undefined,
  });

  sleep(1);
}
