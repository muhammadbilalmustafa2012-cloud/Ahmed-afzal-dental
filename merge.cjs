const fs = require('fs');
let content = fs.readFileSync('d:/downloads/New folder/landing-page/index.html', 'utf8');

const js_script = `
    <canvas id="animation-canvas" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none;"></canvas>
    <script>
        const canvas = document.getElementById('animation-canvas');
        const context = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const frameCount = 300;
        const currentFrame = index => \`frame_\${index.toString().padStart(6, '0')}.jpg\`;
        const images = [];
        let lastRenderedIndex = 0;

        const preloadImages = () => {
            for (let i = 0; i < frameCount; i++) {
                images[i] = new Image();
                images[i].src = currentFrame(i);
            }
        };

        const drawImage = (img) => {
            if (!img || !img.complete || img.naturalWidth === 0) return false;
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, x, y, img.width * scale, img.height * scale);
            return true;
        };

        const renderFrame = (index) => {
            const success = drawImage(images[index]);
            if (success) {
                lastRenderedIndex = index;
            } else if (images[lastRenderedIndex]) {
                drawImage(images[lastRenderedIndex]);
            }
        };

        preloadImages();
        images[0].onload = () => drawImage(images[0]);

        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = document.documentElement.scrollTop;
                    const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollFraction = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
                    const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.floor(scrollFraction * frameCount)));
                    renderFrame(frameIndex);
                    ticking = false;
                });
                ticking = true;
            }
        });

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            renderFrame(lastRenderedIndex);
        });
    </script>
</body>
`;

const css_inject = `
    <style>
        body, html, main {
            background-color: transparent !important;
        }
        .hero { background: transparent !important; }
        .section { background: rgba(255,255,255,0.85) !important; }
        .section--alt { background: rgba(245,245,245,0.85) !important; }
        .hero__image-wrapper img { opacity: 0; }
    </style>
</head>
`;

content = content.replace('</body>', js_script);
content = content.replace('</head>', css_inject);

fs.writeFileSync('d:/downloads/New folder/frames/index.html', content, 'utf8');
console.log('Done!');
