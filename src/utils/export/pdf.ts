import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 导出为PDF
export const exportAsPDF = async (
  element: HTMLElement,
  filename: string = 'export',
  backgroundColor: string = '#ffffff',
  margin: number = 24
): Promise<void> => {
  const bgColor = backgroundColor === 'transparent' ? '#ffffff' : backgroundColor;

  // 保存原始样式
  const originalPadding = element.style.padding;
  const originalOverflow = element.style.overflow;

  // 临时设置样式以确保完整渲染
  element.style.padding = `${margin}px`;
  element.style.overflow = 'visible';

  // 使用更高的 scale 提高分辨率
  const scale = Math.max(window.devicePixelRatio * 2, 3);

  try {
    const canvas = await html2canvas(element, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: bgColor,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // 恢复原始样式
    element.style.padding = originalPadding;
    element.style.overflow = originalOverflow;

    // A4 尺寸 (mm)
    const pageWidth = 210;
    const pageHeight = 297;
    const pageMargin = 10;

    // 内容区域尺寸
    const contentWidth = pageWidth - pageMargin * 2;
    const contentHeight = pageHeight - pageMargin * 2;

    // 图片在 PDF 中的宽度（占满内容区域）
    const imgWidth = contentWidth;
    // 图片在 PDF 中的高度（按比例计算）
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    // 将 canvas 转换为高质量图片
    const imgData = canvas.toDataURL('image/png', 1.0);

    // 创建 PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // 计算需要的页数
    const totalPages = Math.ceil(imgHeight / contentHeight);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }

      // 计算当前页的偏移量
      const yOffset = page * contentHeight;

      if (totalPages === 1) {
        // 只有一页，直接添加图片
        pdf.addImage(imgData, 'PNG', pageMargin, pageMargin, imgWidth, imgHeight);
      } else {
        // 多页情况：使用 pdf 的 addImage 配合裁剪
        // 计算源图片上需要裁剪的区域（像素坐标）
        const sourceY = (yOffset / imgHeight) * canvas.height;
        const displayHeight = Math.min(contentHeight, imgHeight - yOffset);
        const sourceHeight = (displayHeight / imgHeight) * canvas.height;

        // 创建一个临时 canvas 来保存当前页的内容
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.ceil(sourceHeight);

        const ctx = pageCanvas.getContext('2d');
        if (ctx) {
          // 填充背景色
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

          // 从原 canvas 绘制对应区域
          ctx.drawImage(
            canvas,
            0,                    // 源 x
            Math.floor(sourceY),  // 源 y
            canvas.width,         // 源宽度
            Math.ceil(sourceHeight), // 源高度
            0,                    // 目标 x
            0,                    // 目标 y
            canvas.width,         // 目标宽度
            Math.ceil(sourceHeight)  // 目标高度
          );

          // 转换为图片并添加到 PDF
          const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
          const pageImgHeight = (pageCanvas.height * contentWidth) / canvas.width;

          pdf.addImage(
            pageImgData,
            'PNG',
            pageMargin,
            pageMargin,
            imgWidth,
            pageImgHeight
          );
        }
      }
    }

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    // 恢复原始样式
    element.style.padding = originalPadding;
    element.style.overflow = originalOverflow;
    console.error('PDF export error:', error);
    throw error;
  }
};
