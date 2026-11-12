# Art direction — phiên bản đồng nhất theo scene 1

Công cụ: Imagegen tích hợp (built-in), không dùng CLI/API key. Tham chiếu phong cách chính: `assets/curtain.webp`, lấy từ scene mở đầu hiện tại. `sources/tem2/s2.png` chỉ dùng tham chiếu bố cục cho lớp học mới.

Bản lớp học cuối được chỉnh giảm loang theo yêu cầu: mảng tường, bảng và đồ gỗ đều hơn, giữ nét chì và chất giấy. Tài nguyên PNG gốc nằm trong thư mục generated_images của Codex; các bản WebP dùng trong web được lưu tại `assets/` và đóng gói trong `dist/assets/`. Các bản trong suốt giữ kênh alpha. Tranh lớp học SVG từ dự án trước không còn được dùng.

## classroom-painting.webp

```text
Use case: illustration-story. Asset: a production 16:9 wide background for an interactive Vietnamese Teachers' Day classroom scene.
Reference image 1 (curtain.webp) is the EXACT STYLE authority: loose traditional watercolor washes on warm ivory cotton paper, visible paper grain, delicate uneven dark graphite and sepia sketch outlines, gentle cross-hatching, dusty terracotta and golden afternoon light, olive greens. Reference image 2 (s2.png) is composition reference only. Paint a NEW classroom, do not reproduce its labels or text.
Composition: full-bleed wide interior, perspective from the back looking toward the teacher's desk. Left third has a tall open timber casement window overlooking lush green schoolyard trees and a weathered stone bench. Center-left teacher's desk and low wooden podium at x38%-62%, tabletop at y65%. Books, ceramic pen cup and wooden ruler on tabletop. A small simple pottery flower vase at x43%, y63%, with a few delicate white flowers. Keep a clear empty 15% wide patch on tabletop centered x56%, y65% for a separately animated envelope; DO NOT paint any envelope or letter. A large deep olive green chalkboard on right at x61%-94%, y25%-59%, completely blank with rubbed chalk texture, no letters. Above it a small red Vietnamese flag with yellow five-pointed star at x80%, y13%. No clock (a separate animated clock will be overlaid). Foreground has two orderly rows of old wooden student desks, one on each side with central aisle, occupying bottom 28%, with faded warm reddish varnish. Window has NO white sheer curtain (a separate animated layer will be added), only wooden frame. Trees outside partly visible; elegant airy light.
Every object must share the hand-painted watercolor and pencil material of reference 1, NOT flat vector, not photorealistic, not smooth 3D. Warm intimate nostalgic storybook painting. Cream, dusty rust red, amber wood, muted olive. Subtle hand-drawn inner border and deckled paper edges, no white margins bigger than 1%. No people, no labels, no captions, no watermark, no readable text. Maintain clean spatial perspective and clear tabletop. Wide 16:9 high resolution.
```

## classroom-painting.webp — chỉnh giảm loang

```text
Use case: lighting-weather / style refinement. Edit this classroom painting with ONE targeted change: make the watercolor finish much more restrained, clean and even. Preserve EXACT composition, positions and shapes of window, trees, bench, desk, vase, books, blank chalkboard, Vietnamese flag, foreground desks and all perspective. Preserve the warm ivory / olive / dusty terracotta palette and delicate hand-drawn pencil outlines. Reduce blotchiness and patchy paint blooms by at least 75% across the plaster walls, desk fronts, floor and chalkboard. Walls should have broad nearly uniform warm cream washes with only very subtle paper grain and soft shading; wood has smooth coherent color with fine penciled grain. Keep atmospheric afternoon light and delicate leaf shadows, but fewer small scattered bright sun flecks. Do not add objects or words. The result must remain hand-painted watercolor-and-pencil illustration matching the opening curtain, with clear shapes and calmly filled color areas, not distressed or dirty. Keep subtle paper edging. No text, no envelope, no clock, no white sheer curtain. Same wide 16:9 framing.
```

## botanical-painting.webp

```text
Use case: illustration-story. Create ONE L-shaped white-flower and olive-leaf botanical corner ornament for a nostalgic Vietnamese Teachers' Day illustrated website. Use the attached curtain painting ONLY as style reference: soft translucent watercolor on ivory paper with fine scratchy sepia pencil contours and cross-hatching, muted olive leaves with imperfect brush edges, warm creamy white five-petal flowers with tiny golden stamens, scattered unopened buds, slender brown-green twigs. The branch curls along the LEFT and TOP of an otherwise empty rectangular corner, so it hugs a photo corner naturally. Do not make a full wreath. Delicate, irregular, hand-painted, visibly watercolor, not vector or 3D. Flower density strongest in upper-left, tapering into leaves toward right and bottom. Generous negative space in lower-right. Isolated object on genuinely TRANSPARENT background, no paper rectangle behind it, no drop shadow, no text, no watermark. Portrait-ish square canvas. Keep every leaf and flower inside canvas.
```

## paper-painting.webp

```text
Use case: illustration-story. Asset: one wide 16:9 blank antique ivory watercolor-paper sheet to use as a reusable background in an interactive memory letter. Match material and art direction of the attached curtain reference: tactile warm cotton paper, visible fine grain, thin uneven sepia pencil border near the edge, loose translucent watercolor washes in pale amber and dusty terracotta at the corners and edges only. Very subtle aged folds, a few tiny graphite sketch marks near outer edges. Central 85% remains pale clean cream with minimal texture for readable overlaid text and photographs. Soft afternoon light from left. No objects, no flowers, no people, no text, no lettering, no frames inside, no grid lines (the website adds its own). Full canvas paper background, no transparency, high resolution, wide landscape.
```

## sheer-painting.webp

```text
Use case: illustration-story. Asset: ONE standalone thin ivory-white sheer window curtain, gently billowing from left to right, for overlay on a Vietnamese classroom illustration. The attached image is style reference only: restrained watercolor on warm paper, delicate sepia pencil contours, even calm paint fills, subtle grain. Curtain is hung along a short horizontal wood curtain rod at top, has a narrow gathered top, folds flowing downwards and slightly to the right, softly wavy hem. See-through gauze with semi-transparent warm off-white fabric, pencil-thin grey-beige fold lines, no heavy grey shadows. Vertical portrait composition. Entire curtain and rod visible with a little breathing space. Genuinely transparent background, no wall, no window, no rectangle of paper, no text. This should look like a hand-painted animation layer, not a photo or vector.
```

## books-painting.webp

```text
Use case: illustration-story. Asset: ONE small decorative stack of three old Vietnamese school books with a small folded ivory paper airplane resting across the upper book. Match the attached reference style: controlled traditional watercolor washes, fine irregular sepia pencil sketch outlines, slightly visible ivory paper grain, muted dusty terracotta, olive green and warm amber book covers, cream page edges. Clean even colors, no excessive paint blotches or stains. A tiny sprig of white five-petal flowers and olive leaves tucked beside the stack. Charming nostalgic hand-painted storybook aesthetic, no photorealism, no smooth vector or 3D. Three-quarter view with stack angled slightly. Genuinely transparent background, no paper rectangle, no shadows beyond a delicate contact shadow. No text or readable book titles, no logos. Entire object visible, square composition.
```

