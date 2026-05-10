# Kevin Georges — Netflix-Style Portfolio

A Netflix-inspired portfolio website with profile selection and image grids.

## Features

- **Splash screen** with animated name (KEVIN GEORGES)
- **Profile selection** — choose from: recruiter, stalker, other
- **Profile pages** with customizable image grids
- **Add images** via URL (images saved to browser localStorage)
- **Fully responsive** design

## How to Use

### Running Locally
```bash
python -m http.server 8000
```
Then visit http://localhost:8000.

### Adding Images

1. Click **+ Add Image** on any profile page
2. Enter an image URL (e.g., `https://example.com/image.jpg` or `images/recruiter/photo1.jpg`)
3. Images are saved to your browser's localStorage

### Using Local Image Folders

To use images from local folders:

1. Create folder structure:
   ```
   images/
   ├── recruiter/
   │   ├── image1.jpg
   │   ├── image2.jpg
   ├── stalker/
   │   ├── image1.jpg
   ├── other/
   │   ├── image1.jpg
   ```

2. Add images by URL:
   - `images/recruiter/image1.jpg`
   - `images/stalker/image1.jpg`
   - `images/other/image1.jpg`

### Customization

Edit `script.js` to change:
- `FULL_NAME` — your name on splash screen
- `PROFILES` — profile list (currently: recruiter, stalker, other)

## Deploy to GitHub Pages

1. Push to `dev` branch
2. **Settings → Pages → Source: `Deploy from a branch` → Branch: `dev`, folder: `/ (root)`**
3. Site will be live at: `https://kevin-georges.github.io/kevingeorgesportfolio.io/`

---

**Note:** Images are stored in browser localStorage. Clearing your browser data will reset them.
