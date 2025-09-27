# AuraCrop 🌱

**AuraCrop** is a farmer-centric multilingual crop disease assistant.  
Upload images of leaf/stem/fruit, get disease diagnosis, treatment suggestions, reminders & follow-ups — all in a language you understand.

---

## 🧭 Table of Contents

1. [Overview](#overview)  
2. [Features](#features)  
3. [Architecture & Flow](#architecture-amp-flow)  
4. [Setup & Run Locally](#setup-amp-run-locally)  
5. [Deployment](#deployment)  
6. [Configuration & Secrets](#configuration-amp-secrets)  
7. [Usage & API Endpoints](#usage-amp-api-endpoints)  
8. [Project Structure](#project-structure)  
9. [Future Enhancements](#future-enhancements)  
10. [Contributors](#contributors)  
11. [License](#license)

---

## 🧐 Overview

AuraCrop helps farmers across India by detecting crop diseases from images, giving step-by-step corrective guidance, and sending follow-ups and alerts in their local language.  
It aims to reduce crop loss, support decision making, and provide an accessible digital agritech assistant for rural communities.

---

## ✅ Features

- Upload leaf, stem, or fruit images for disease detection  
- Multilingual UI & alerts (English + regional languages)  
- Automatic follow-up reminders & notifications  
- Chatbot / conversational assistance  
- Backend APIs & server logic in Firebase Functions  
- Scalable architecture for future AI/ML integration  

---

## 🏗 Architecture & Flow

1. Farmer uploads image via frontend  
2. Frontend calls Firebase Callable Function `submitImage`  
3. Backend stores metadata → triggers disease inference (mock or ML)  
4. Backend updates Firestore with diagnosis  
5. Notifications or reminders sent to user  
6. Chat history & follow-ups stored  

---
