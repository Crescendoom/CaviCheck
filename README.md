# CaviCheck 🦷

A web-based Clinical Decision Support System (CDSS) that assists dental professionals in detecting dental caries in periapical X-ray images using deep learning and AI-powered visual segmentation.

## 🎯 Project Overview

CaviCheck addresses critical challenges in dental diagnostics by providing an AI-powered tool that enhances the accuracy and consistency of caries detection. The system uses deep learning models to perform binary classification (presence/absence of caries) and provides visual segmentation overlays to highlight affected regions when caries is detected.

## 🚀 Key Features

- **AI-Powered Caries Detection**: Binary classification model to determine presence or absence of dental caries
- **Visual Segmentation**: Automated highlighting of affected regions when caries is detected
- **Web-Based Interface**: User-friendly platform for uploading and analyzing periapical X-ray images
- **Clinical Decision Support**: Provides diagnostic summaries to support clinical interpretation
- **Image Processing**: View and download processed images with AI-generated overlays
- **Standardized Analysis**: Reduces diagnostic inconsistencies through objective AI interpretation

## 🎯 Objectives

This system aims to:

1. **Reduce Diagnostic Inconsistencies** - Provide standardized AI-powered interpretation of periapical X-ray images
2. **Minimize Subjective Dependency** - Offer consistent diagnostic support across different practitioners
3. **Facilitate AI Adoption** - Create an accessible platform for integrating AI into daily dental workflows
4. **Enhance Detection Accuracy** - Assist in identifying early or subtle signs of caries
5. **Improve Workflow Efficiency** - Combine presence detection with visual segmentation for faster evaluations

## 🔬 Technical Approach

- **Binary Classification Model**: Determines presence/absence of dental caries
- **Segmentation Model**: Highlights affected regions only when caries is detected
- **Deep Learning Framework**: Trained specifically on adult periapical radiographs
- **Web-Based Architecture**: Built with React and Vite for modern, responsive interface

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 16.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/Crescendoom/CaviCheck.git
cd CaviCheck
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Configure your environment variables
```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
```

The application will start on `http://localhost:5173` by default.

### Production Build
```bash
npm run build
# or
yarn build
```

### Preview Production Build
```bash
npm run preview
# or
yarn preview
```

## 📊 Usage

1. **Upload X-ray Image**: Select and upload a periapical X-ray image through the web interface
2. **AI Analysis**: The system automatically processes the image using trained deep learning models
3. **View Results**: 
   - Binary classification result (caries present/absent)
   - Visual segmentation overlay (if caries detected)
   - Diagnostic summary for clinical reference
4. **Download Results**: Save processed images with AI-generated overlays

## 🏗️ Project Structure

```
CaviCheck/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # React components
│   │   ├── Upload/      # Image upload components
│   │   ├── Analysis/    # AI analysis display
│   │   └── Results/     # Results visualization
│   ├── services/        # API services and AI model integration
│   ├── utils/           # Utility functions
│   ├── assets/          # Images, styles, etc.
│   └── main.jsx         # Application entry point
├── models/              # Deep learning models
├── docs/                # Documentation
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## 🔬 Scope and Limitations

### Scope
- **Target Images**: Adult periapical X-ray images
- **Detection Type**: Binary classification (presence/absence of caries)
- **Segmentation**: Visual highlighting of affected regions when caries is detected
- **User Base**: Licensed dental professionals

### Limitations
- Limited to periapical radiographs (excludes bitewing, panoramic, or CBCT images)
- Does not classify caries by stage, depth, or severity
- Segmentation only applied when caries is detected
- Not designed for diagnosing other dental conditions

## 🌍 Impact and Significance

CaviCheck contributes to several UN Sustainable Development Goals:

- **SDG 3: Good Health and Well-Being** - Promotes earlier diagnosis and prevention
- **SDG 4: Quality Education** - Combines applied AI with healthcare research
- **SDG 9: Industry, Innovation and Infrastructure** - Demonstrates scalable digital diagnostics

## 🧪 Testing

```bash
npm run test
# or
yarn test
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## 🤝 Contributing

We welcome contributions to improve CaviCheck! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏥 For Dental Professionals

CaviCheck is designed specifically for licensed dental practitioners as a decision-support tool. The AI-generated overlays and diagnostic summaries are intended to supplement, not replace, professional clinical judgment and expertise.

## 🙏 Acknowledgments

- Deep learning frameworks and libraries used in model development
- Dental imaging datasets and research communities
- React and Vite development communities
- Healthcare AI research contributors

## 🔮 Future Enhancements

- Multi-stage caries classification
- Support for additional radiographic modalities
- Integration with dental practice management systems
- Mobile application development
- Real-time collaborative diagnosis features

---

**Disclaimer**: CaviCheck is a research project designed to assist dental professionals in diagnostic workflows. It should be used as a supplementary tool alongside professional clinical judgment and is not intended to replace thorough clinical examination and expert interpretation.
