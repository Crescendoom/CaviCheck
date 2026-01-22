# CaviCheck 🦷

AI-powered dental caries detection system for periapical X-ray images.  Helps dental professionals detect cavities with deep learning-based classification and visual segmentation.

🔗 <a href="https://cavi-check.vercel.app/" target="_blank">Open CaviCheck</a>

## ✨ Features

- **AI Detection**: Binary classification to identify presence of dental caries
- **Visual Segmentation**:  Automated highlighting of affected regions
- **Web Interface**: Simple upload and analysis workflow
- **Clinical Support**:  Diagnostic summaries and downloadable results

## 📖 How to Use

1. Upload a periapical X-ray image
2. AI analyzes the image automatically
3. View classification results and segmentation overlay
4. Download processed images

## 🔬 Technical Details

- **Frontend**: React + Vite
- **AI Models**: Binary classification + segmentation for caries detection
- **Target**:  Adult periapical radiographs

## ⚠️ Limitations

- Only supports periapical X-rays (no bitewing, panoramic, or CBCT)
- Binary detection only (doesn't classify severity or stage)
- Intended for licensed dental professionals as a supplementary tool

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

**Disclaimer**: CaviCheck is a research tool designed to assist, not replace, professional clinical judgment.  Always consult with qualified dental professionals for diagnosis and treatment decisions. 
