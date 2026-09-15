from PIL import Image

img = Image.open('src/assets/logo.jpg').convert('RGB')
W, H = img.size
px = img.load()

# 抠图思路：
# - 背景是黑色 (RGB ~ 8,8,8)
# - 图案是暖色调（橙色/粉色/黄色等）
# 把 R 通道 > 100 且 G+B 也 > 50 的像素当作图案，黑色当背景透明

out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
out_px = out.load()
for y in range(H):
    for x in range(W):
        r, g, b = px[x, y]
        # 黑色背景检测：所有通道都很低
        if r < 50 and g < 50 and b < 50:
            out_px[x, y] = (0, 0, 0, 0)
        else:
            out_px[x, y] = (r, g, b, 255)

bbox = out.getbbox()
print(f'Bounding box: {bbox}')
if bbox:
    out = out.crop(bbox)
    pad = 30
    new = Image.new('RGBA', (out.size[0] + pad*2, out.size[1] + pad*2), (0, 0, 0, 0))
    new.paste(out, (pad, pad))
    out = new

out.save('src/assets/logo.png')
print(f'Saved transparent PNG: {out.size}')
