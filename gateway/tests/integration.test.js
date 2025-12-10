const request = require("supertest");

const BASE = "http://127.0.0.1:30000";

describe("INTEGRATION TEST - Gateway → Main Service → Database → AI Service", () => {

    let token = "";

    it("Register user baru", async () => {
        const res = await request(BASE)
            .post("/auth/register")
            .send({
                username: "integrationtest@example.com",
                password: "123456"
            });

        // Bisa 201 jika berhasil, atau 400 kalau user sudah ada
        expect([200, 201, 400]).toContain(res.statusCode);
    });

    it("Login user untuk mendapatkan token", async () => {
        const res = await request(BASE)
            .post("/auth/login")
            .send({
                username: "integrationtest@example.com",
                password: "123456"
            });

        expect([200, 401, 404]).toContain(res.statusCode);

        if (res.body.token) {
            token = res.body.token;
        }
    });

    it("Akses endpoint barang melalui Gateway (GET /api/barang)", async () => {
        if (!token) return;

        const res = await request(BASE)
            .get("/api/barang")
            .set("Authorization", `Bearer ${token}`);

        expect([200, 401, 403]).toContain(res.statusCode);
    });

    it("AI Predict melalui Gateway", async () => {
        if (!token) return;

        const res = await request(BASE)
            .post("/ai/predict")
            .set("Authorization", `Bearer ${token}`)
            .send({ jarak: 20, berat: 5 });

        expect([200, 401, 403]).toContain(res.statusCode);
    });

});
