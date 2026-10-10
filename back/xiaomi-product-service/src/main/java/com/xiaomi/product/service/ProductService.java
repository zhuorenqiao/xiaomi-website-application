package com.xiaomi.product.service;

import com.xiaomi.product.api.ProductSection;
import com.xiaomi.product.catalog.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;

/**
 * 商品查询服务：当前直接透出内存目录数据，后续可在此叠加缓存、分页、按分类过滤等逻辑。
 */
@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    /** 首页全部商品栏目 */
    public List<ProductSection> homepageSections() {
        return repository.sections();
    }
}
