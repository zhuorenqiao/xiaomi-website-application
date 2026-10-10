-- ============================================================
-- 商品库表结构（由 xiaomi-product-service 启动时自动执行，CREATE IF NOT EXISTS 可重复运行）
-- 数据库 xiaomi_product 本身由 back/db/docker-compose.yml 的 MYSQL_DATABASE 创建。
-- ============================================================

-- 商品分类：首页栏目 + 搜索页分类筛选共用同一张表，保证两端数据一致
CREATE TABLE IF NOT EXISTS product_category (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键',
    code        VARCHAR(32)     NOT NULL COMMENT '分类编码，同时作为首页栏目 id',
    name        VARCHAR(32)     NOT NULL COMMENT '分类名称，同时作为首页栏目标题',
    list_order  INT             NOT NULL DEFAULT 0 COMMENT '首页栏目顺序，越小越靠前',
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_category_code (code),
    KEY idx_category_order (list_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT '商品分类';

-- 商品主表：既支撑首页栏目网格，也支撑关键词搜索 + 分类筛选 + 排序 + 分页
CREATE TABLE IF NOT EXISTS product (
    id               BIGINT UNSIGNED NOT NULL COMMENT '主键（种子数据用固定区间，便于分类归组）',
    name             VARCHAR(120)    NOT NULL COMMENT '商品名称',
    subtitle         VARCHAR(200)    NOT NULL DEFAULT '' COMMENT '一句话卖点',
    feature_subtitle VARCHAR(200)             DEFAULT NULL COMMENT '首页主推位文案，为空时回落到 subtitle',
    brand            VARCHAR(32)     NOT NULL DEFAULT '' COMMENT '品牌：Xiaomi / REDMI / 米家',
    price            DECIMAL(10, 2)  NOT NULL COMMENT '售价（元）用于排序与价格筛选',
    tag              VARCHAR(16)              DEFAULT NULL COMMENT '角标：新品 / 热卖 / 直降',
    category_code    VARCHAR(32)     NOT NULL COMMENT '所属分类编码',
    image_subject    VARCHAR(500)    NOT NULL COMMENT '白底商品图主体描述，渲染时拼成成图服务 URL',
    poster_subject   VARCHAR(500)             DEFAULT NULL COMMENT '主推位竖版海报主体描述，仅 is_feature = 1 时使用',
    is_feature       TINYINT         NOT NULL DEFAULT 0 COMMENT '是否为所属分类的首页主推大图',
    sales            INT             NOT NULL DEFAULT 0 COMMENT '累计销量，用于销量排序',
    list_order       INT             NOT NULL DEFAULT 0 COMMENT '分类内展示顺序，首页网格取前 8 个',
    created_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at       DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    UNIQUE KEY uk_product_name (name),
    KEY idx_product_category_order (category_code, list_order),
    KEY idx_product_price (price),
    KEY idx_product_sales (sales),
    CONSTRAINT fk_product_category FOREIGN KEY (category_code) REFERENCES product_category (code)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT '商品';

-- 说明：搜索用 LIKE 匹配（演示级数据量足够），真实商品中心建议改为
-- InnoDB FULLTEXT（ngram 分词）或外接搜索引擎，此处不引入以保持链路直观。
