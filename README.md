# SHEM - Smart Home Energy Manager ⚡🏠

![SHEM Banner](https://img.shields.io/badge/Status-Live-success?style=for-the-badge) ![Tech Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20IoT-blue?style=for-the-badge) ![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**SHEM (Smart Home Energy Manager)** is a comprehensive IoT-based solution designed to monitor, analyze, and optimize household energy consumption in real-time. Combining a powerful **ESP32-based hardware controller** with a sleek **React/Vite Dashboard**, SHEM empowers users to take control of their electricity bills and reduce their carbon footprint.

---

## 🌟 Key Features

### 🖥️ Dashboard V2 (Premium Experience)
- **Real-Time Monitoring**: Visualize Voltage, Current, Power, and Energy consumption live.
- **AI-Powered Insights**: Integrated **Chatbot & Smart Tips** (powered by OpenRouter/Gemini) to suggest actionable energy-saving habits.
- **Device Control**: Remote toggle for appliances (AC, Lights, etc.) directly from the web interface.
- **Cost Analytics**: Interactive charts breaking down daily/weekly costs and appliance usage.
- **Responsive Design**: "Premium Dark/Gold" aesthetic optimized for Desktop and Mobile.

### 🤖 Intelligent Automation
- **Predictive Budgeting**: Set monthly energy budgets and get alerted before you cross them.
- **Smart Notifications**: Instant alerts for high usage, connection loss, or system anomalies via a centralized Notification Hub.

### 🔧 Full Stack Architecture
- **Frontend**: React, Vite, TailwindCSS, Recharts, Framer Motion.
- **Backend**: Node.js, Express, MongoDB (Structure ready for scale).
- **Hardware**: ESP32, PZEM-004T Sensors, Relay Modules.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Git

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/ritesh-1918/SHEM.git
    cd SHEM
    ```

2.  **Setup Frontend**
    ```bash
    cd shem-pro-frontend
    npm install
    ```

3.  **Setup Backend**
    ```bash
    cd ../shem-pro-backend
    npm install
    ```

### Configuration (.env)

Create a `.env` file in `shem-pro-frontend` for AI features:
```env
VITE_OPENROUTER_KEY=your_key_here
VITE_GROQ_KEY=your_key_here
VITE_GEMINI_KEY=your_key_here
```

### Running the App

**Frontend (Dashboard)**
```bash
cd shem-pro-frontend
npm run dev
```
> Access at `http://localhost:5173`

**Backend (API)**
```bash
cd shem-pro-backend
npm run dev
```
> Server running on `http://localhost:5000`

---

## 📸 Screenshots

| Dashboard Overview | Analytics & Charts | AI Assistant |
| :---: | :---: | :---: |
| *Visual of live metrics* | *Deep dive into cost analysis* | *Chatting with SHEM AI* |

---

## 🤝 Contributing
Contributions are welcome! Please fork the repo and submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the SHEM Team
</p>
