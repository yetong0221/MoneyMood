from PIL import Image

img = Image.open('src/assets/logo.jpg').convert('RGB')
W, H = img.size
px = img.load()

# 看看真实的像素分布：统计每个 RGB 通道值的出现次数
hist = {}
for y in range(0, H, 2):
    for x in range(0, W, 2):
        p = px[x, y]
        # 量化为 16 阶
        key = (p[0]//16, p[1]//16, p[2]//16)
        hist[key] = hist.get(key, 0) + 1

# 排序找最高频的颜色
top = sorted(hist.items(), key=lambda x: -x[1])[:20]
print('Top 20 quantized colors (R/16, G/16, B/16): count')
for k, v in top:
    rgb = (k[0]*16+8, k[1]*16+8, k[2]*16+8)
    print(f'  RGB~{rgb}: {v}')

# 计算整体平均亮度
total_lum = 0
cnt = 0
for y in range(0, H, 2):
    for x in range(0, W, 2):
        p = px[x, y]
        total_lum += (p[0] + p[1] + p[2]) / 3
        cnt += 1
print(f'\nAvg luminance: {total_lum/cnt:.1f}')
