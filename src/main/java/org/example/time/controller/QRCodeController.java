package org.example.time.controller;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/qrcode")
@Slf4j
@Tag(name = "二维码管理", description = "二维码生成相关接口")
public class QRCodeController {

    @GetMapping(value = "/generate", produces = MediaType.IMAGE_PNG_VALUE)
    @Operation(summary = "生成二维码图片", description = "根据传入的文本内容生成PNG格式的二维码图片")
    public ResponseEntity<byte[]> generateQRCode(
            @Parameter(description = "二维码内容", required = true, example = "https://www.example.com")
            @RequestParam String content,
            @Parameter(description = "二维码宽度（像素）", example = "300")
            @RequestParam(defaultValue = "300") int width,
            @Parameter(description = "二维码高度（像素）", example = "300")
            @RequestParam(defaultValue = "300") int height) {
        
        log.info("生成二维码: content={}, width={}, height={}", content, width, height);
        
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
            hints.put(EncodeHintType.MARGIN, 2);
            
            BitMatrix bitMatrix = qrCodeWriter.encode(content, BarcodeFormat.QR_CODE, width, height, hints);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(outputStream.toByteArray());
                    
        } catch (WriterException | IOException e) {
            log.error("生成二维码失败", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
