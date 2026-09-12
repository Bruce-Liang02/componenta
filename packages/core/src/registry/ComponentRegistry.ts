/**
 * 组件注册表
 *
 * 管理"组件类型 → 实现变体"的映射关系。
 * Schema 渲染器通过此表查找实际要渲染的组件。
 *
 * 使用示例：
 *   registry.register('List', {
 *     default: AntList,
 *     variants: { AntList, VirtualList, CardList }
 *   });
 *   const Comp = registry.resolve('List', 'VirtualList');
 */
import type { ComponentType } from 'react';

/** 组件注册项 */
export interface ComponentRegistration {
  /** 默认实现 */
  default: ComponentType<Record<string, unknown>>;
  /** 可用变体：变体名 → 组件 */
  variants: Record<string, ComponentType<Record<string, unknown>>>;
}

/** 注册表配置 */
export interface ComponentRegistryOptions {
  /** 是否在 resolve 失败时抛出错误（默认 false，返回 null） */
  strict?: boolean;
}

export class ComponentRegistry {
  private registry = new Map<string, ComponentRegistration>();
  private options: Required<ComponentRegistryOptions>;

  constructor(options: ComponentRegistryOptions = {}) {
    this.options = {
      strict: options.strict ?? false,
    };
  }

  /**
   * 注册一个组件类型及其所有变体
   */
  register(type: string, registration: ComponentRegistration): void {
    if (!registration.default) {
      throw new Error(
        `[ComponentRegistry] Registering "${type}" requires a default implementation`,
      );
    }
    // 默认实现也应该出现在 variants 中
    const variants: Record<string, ComponentType<Record<string, unknown>>> = {
      ...registration.variants,
    };
    // 确保 default 在 variants 里可被访问（使用类名或 type+'Default'）
    const defaultName =
      (registration.default as { displayName?: string }).displayName ||
      registration.default.name ||
      `${type}Default`;
    if (!variants[defaultName]) {
      variants[defaultName] = registration.default;
    }
    this.registry.set(type, { default: registration.default, variants });
  }

  /**
   * 解析：根据类型和可选的变体名返回组件
   * @returns 组件构造函数，或 null（strict=false 时）
   */
  resolve(type: string, impl?: string): ComponentType<Record<string, unknown>> | null {
    const registration = this.registry.get(type);
    if (!registration) {
      if (this.options.strict) {
        throw new Error(`[ComponentRegistry] Unknown component type: "${type}"`);
      }
      console.warn(`[ComponentRegistry] Unknown component type: "${type}", fallback to null`);
      return null;
    }
    if (impl) {
      const variant = registration.variants[impl];
      if (!variant) {
        if (this.options.strict) {
          throw new Error(
            `[ComponentRegistry] Unknown variant "${impl}" for type "${type}". Available: ${Object.keys(registration.variants).join(', ')}`,
          );
        }
        console.warn(
          `[ComponentRegistry] Unknown variant "${impl}" for type "${type}", fallback to default`,
        );
        return registration.default;
      }
      return variant;
    }
    return registration.default;
  }

  /**
   * 列出已注册的所有组件类型
   */
  listTypes(): string[] {
    return Array.from(this.registry.keys());
  }

  /**
   * 列出指定类型的所有变体名
   */
  listVariants(type: string): string[] {
    const registration = this.registry.get(type);
    if (!registration) return [];
    return Object.keys(registration.variants);
  }

  /**
   * 检查类型是否已注册
   */
  has(type: string): boolean {
    return this.registry.has(type);
  }

  /**
   * 检查指定变体是否已注册
   */
  hasVariant(type: string, impl: string): boolean {
    const registration = this.registry.get(type);
    if (!registration) return false;
    return impl in registration.variants;
  }

  /**
   * 清空注册表（主要用于测试）
   */
  clear(): void {
    this.registry.clear();
  }
}

/** 全局单例注册表（默认非严格模式） */
export const globalRegistry = new ComponentRegistry();
