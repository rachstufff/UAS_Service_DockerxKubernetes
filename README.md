####################################################################
#    RINGKASAN ALUR KERJA DEPLOYMENT DAN PENGUJIAN SOA (MICROSERVICE)
####################################################################

### I. PEMBUATAN DAN PENERBITAN IMAGE DOCKER (BUILD & PUSH)
#
# A. BUILD & PUSH DASAR (Menggunakan username_docker)
#
# 1. Gateway
+ docker build -t username_docker/soa-gateway:v1 ./gateway
+ docker push username_docker/soa-gateway:v1
#
# 2. Main Service
+ docker build -t username_docker/soa-main:v1 ./main_service
+ docker push username_docker/soa-main:v1
#
# 3. AI Service
+ docker build -t username_docker/soa-ai:v1 ./ai_service
+ docker push username_docker/soa-ai:v1
#
# 4. Logging Service
+ docker build -t username_docker/soa-logging:v1 ./logging_service
+ docker push username_docker/soa-logging:v1
#
# 5. Frontend
+ docker build -t username_docker/soa-frontend:v1 ./frontend
+ docker push username_docker/soa-frontend:v1

# B. BUILD MULTI-ARSITEKTUR (Menggunakan docker buildx untuk username_docker)
#    Perintah ini juga secara otomatis melakukan push (--push)
+ docker buildx build --platform linux/amd64 -t username_docker/soa-ai:v1 ./ai_service --push
+ docker buildx build --platform linux/amd64 -t username_docker/soa-main:v1 ./main_service --push
+ docker buildx build --platform linux/amd64 -t username_docker/soa-gateway:v1 ./gateway --push
+ docker buildx build --platform linux/amd64 -t username_docker/soa-frontend:v1 ./frontend --push
+ docker buildx build --platform linux/amd64 -t username_docker/soa-logging:v1 ./logging_service --push

---

### II. DEPLOYMENT KE KUBERNETES (K8S)

# A. Deployment Infrastruktur Dasar
+ kubectl apply -f k8s/mysql-deployment.yaml
+ kubectl apply -f k8s/rabbitmq-deployment.yaml
# CATATAN: Tunggu sebentar agar DB dan RabbitMQ siap

# B. Deployment Layanan Aplikasi (Mikroservis)
+ kubectl apply -f k8s/main-service-deployment.yaml
+ kubectl apply -f k8s/ai-service-deployment.yaml
+ kubectl apply -f k8s/logging-deployment.yaml
+ kubectl apply -f k8s/gateway-deployment.yaml
+ kubectl apply -f k8s/frontend-deployment.yaml

# C. Pemeriksaan Status Deployment
+ kubectl get pods
+ kubectl get svc

---

### III. PENGUJIAN (TESTING)

# A. Pengujian Unit (pytest) untuk AI Service (Lokal)
+ cd ai_service
# Pastikan virtual environment aktif jika pakai
+ pip install -r requirements.txt
+ pip install pytest
+ pytest

# B. Pengujian Beban (Load Testing) dengan k6

# 1. Menjalankan k6 Langsung dengan Docker (Lokal)
# Linux/Mac
+ docker run --rm -i grafana/k6 run - <loadtest_ai.js
# Windows (PowerShell)
+ cat loadtest_ai.js | docker run --rm -i grafana/k6 run - 

# 2. Menjalankan k6 Melalui Image Kustom (untuk Akses K8s NodePort)
# Build image k6 dengan script load test Anda
+ docker build -t k6-loadtest:v1 -f Dockerfile.k6 .
# Jalankan load test (Menggunakan --network host untuk mengakses K8s NodePort)
