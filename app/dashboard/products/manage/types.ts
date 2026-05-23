/**
 * @file 商品类型定义
 * @description 定义商品管理相关的数据结构
 * @module products
 * @author YYC
 * @version 1.0.0
 * @created 2024-10-25
 */

/**
 * 商品数据模型
 */
export interface Product {
  /** 序号 */
  id: number;
  /** 显示顺序 */
  displayOrder: number;
  /** 门店 */
  store: string;
  /** 商品条形码 */
  barcode: string;
  /** 商品别名 */
  alias: string;
  /** 商品单位 */
  unit: string;
  /** 商品类型 */
  type: string;
  /** 原价 */
  originalPrice: number;
  /** 优惠价 */
  discountPrice: number;
  /** 是否推荐商品 */
  isRecommended: boolean;
  /** 是否销售商品 */
  isForSale: boolean;
  /** 状态 */
  status: string;
  /** 沽清状态 */
  soldOutStatus: string;
  /** 会员价 */
  memberPrice: number;
  /** 会员等级价格（1-10级） */
  memberLevelPrices: number[];
}

/**
 * 商品管理页面Props
 */
export interface ProductManageProps {
  initialProducts?: Product[];
}
