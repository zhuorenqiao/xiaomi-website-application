import type { SVGProps } from 'react'

/** 线性图标统一尺寸入参 */
export interface IconProps {
  width?: number
  height?: number
}

// as const 让 stroke 相关字面量保持为 SVG 属性要求的联合类型成员
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const satisfies SVGProps<SVGSVGElement>

export function IconSearch({ width = 18, height = 18 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...base}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </svg>
  )
}

export function IconCart({ width = 16, height = 16 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...base}>
      <path d="M2.5 4h2.2l2.4 11.2a1.6 1.6 0 0 0 1.6 1.3h8.6a1.6 1.6 0 0 0 1.6-1.2L21 8H6" />
      <circle cx="10" cy="20.4" r="1.4" />
      <circle cx="17.6" cy="20.4" r="1.4" />
    </svg>
  )
}

export function IconChevronRight({ width = 14, height = 14 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...base}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  )
}

export function IconChevronLeft({ width = 18, height = 18 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...base}>
      <path d="m15 5-7 7 7 7" />
    </svg>
  )
}

export function IconArrowRight({ width = 16, height = 16 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...base}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

/* ---------- 页脚服务图标 ---------- */

export function IconWrench({ width = 26, height = 26 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...base}>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 4.9L3.5 17a2 2 0 0 0 0 2.8l.7.7a2 2 0 0 0 2.8 0l5.8-5.8a4 4 0 0 0 4.9-5.4l-2.9 2.9-2.4-.6-.6-2.4 2.9-2.9Z" />
    </svg>
  )
}

export function IconReturn({ width = 26, height = 26 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...base}>
      <path d="M3 9h11a5 5 0 0 1 0 10H8" />
      <path d="m7 5-4 4 4 4" />
    </svg>
  )
}

export function IconSwap({ width = 26, height = 26 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...base}>
      <path d="M4 7h13" />
      <path d="m14 3 4 4-4 4" />
      <path d="M20 17H7" />
      <path d="m10 13-4 4 4 4" />
    </svg>
  )
}

export function IconTruck({ width = 26, height = 26 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...base}>
      <path d="M2.5 6.5h11v9h-11zM13.5 9.5H18l3 3v3h-7.5" />
      <circle cx="6.5" cy="17.5" r="1.6" />
      <circle cx="17" cy="17.5" r="1.6" />
    </svg>
  )
}

export function IconPin({ width = 26, height = 26 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...base}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

export function IconHeadset({ width = 26, height = 26 }: IconProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" {...base}>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="3" y="13" width="4.5" height="6" rx="2" />
      <rect x="16.5" y="13" width="4.5" height="6" rx="2" />
      <path d="M20 17v1.6a2.4 2.4 0 0 1-2.4 2.4H13" />
    </svg>
  )
}
