# ECOSCAPE

ECOSCAPE is an interactive globe visualization that allows users to explore global temperature trends over time. The visualization supports both absolute temperature views and year-over-year temperature differences.

![ECOSCAPE Screenshot](screenshot.png)

## Features

### Absolute Temperature View
- Displays global temperature distribution
- Color gradient from blue (cold) through yellow to red (hot)
- Interactive rotation and zoom

### Temperature Difference View
- Shows year-over-year temperature changes
- Blue indicates cooling, red indicates warming
- White represents minimal change

### Timeline Controls
- Play/pause animation
- Manual year selection via slider
- Spans from 1880 to 2024

## Technology Stack

- React
- Three.js
- Git LFS (for large temperature dataset)
- Space Mono font

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git LFS

### Installation

1. Clone the repository:
```bash
git clone https://github.com/poornanat1/globalization-viz.git
cd globalization-viz
```

2. Install Git LFS:
```bash
git lfs install
git lfs pull
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Data Structure

The temperature data is stored in a large JSON file (520MB) using Git LFS. The data format includes:

```json
{
    "metadata": {
        "min_temperature": number,
        "max_temperature": number,
        "lat_bins": number,
        "lon_bins": number
    },
    "data": {
        [year: string]: number[][]
    }
}
```

## Project Structure
globalization-viz/
├── public/
│ └── data/
│ └── temperature_data.json
├── src/
│ ├── components/
│ │ └── Globe/
│ │ ├── Globe.jsx
│ │ ├── GlobeScene.jsx
│ │ └── Globe.css
│ └── utils/
│ ├── colorUtils.js
│ └── textureUtils.js
└── README.md

## Contact

Your Name - [@poornanat1](https://github.com/poornanat1)

Project Link: [https://github.com/poornanat1/globalization-viz](https://github.com/poornanat1/globalization-viz)

