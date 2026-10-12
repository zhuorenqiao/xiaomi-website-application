import type { ComponentType } from 'react'
import { footerColumns, hotline, icpLinks, serviceItems } from '../data/siteData'
import type { ServiceIconKey } from '../data/siteData'
import {
  IconHeadset,
  IconPin,
  IconReturn,
  IconSwap,
  IconTruck,
  IconWrench,
} from './Icons'
import type { IconProps } from './Icons'
import styles from './Footer.module.less'

const serviceIcons: Record<ServiceIconKey, ComponentType<IconProps>> = {
  wrench: IconWrench,
  return: IconReturn,
  swap: IconSwap,
  truck: IconTruck,
  pin: IconPin,
}

export default function Footer() {
  return (
    <footer className={styles.footer} id="service">
      <div className={`container ${styles.footerServices}`}>
        {serviceItems.map(({ icon, text }) => {
          const Icon = serviceIcons[icon]
          return (
            <div className={styles.footerService} key={text}>
              <Icon width={26} height={26} />
              <span>{text}</span>
            </div>
          )
        })}
      </div>

      <div className={`container ${styles.footerMain}`}>
        <nav className={styles.footerColumns} aria-label="页脚导航">
          {footerColumns.map((col) => (
            <div className={styles.footerColumn} key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#top">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.footerHotline}>
          <IconHeadset width={28} height={28} />
          <p className={styles.footerPhone}>{hotline.phone}</p>
          <p className={styles.footerHours}>{hotline.hours}</p>
          <p className={styles.footerHours}>{hotline.sub}</p>
          <div className={styles.footerButtons}>
            <a className={`${styles.footerBtn} ${styles.footerBtnPrimary}`} href="#top">
              {hotline.buttons[0]}
            </a>
            <a className={styles.footerBtn} href="#top">
              {hotline.buttons[1]}
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={`container ${styles.footerBottomInner}`}>
          <span className={styles.footerWordmark}>mi.com</span>
          <div className={styles.footerIcp}>
            <p>
              {icpLinks.map((text) => (
                <a key={text} href="#top">
                  {text}
                </a>
              ))}
            </p>
            <p>小米公司版权所有 © 2026 Xiaomi</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
