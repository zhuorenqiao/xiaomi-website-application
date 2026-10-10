package com.xiaomi.product.web;

import com.xiaomi.product.api.ProductSection;
import com.xiaomi.product.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 商品接口：GET /api/products/sections。
 * 为前端首页提供商品栏目与商品列表数据。
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * 返回首页全部商品栏目（左大图 + 右商品网格）。
     *
     * @return 栏目列表，结构与前端 ProductSection 组件一致
     */
    @GetMapping("/sections")
    public List<ProductSection> sections() {
        return productService.homepageSections();
    }
}
