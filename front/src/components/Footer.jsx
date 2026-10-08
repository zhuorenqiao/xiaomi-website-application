import { serviceItems, footerColumns, hotline, icpLinks } from '../data/siteData.js'
import {
  IconWrench,
  IconReturn,
  IconSwap,
  IconTruck,
  IconPin,
  IconHeadset,
} from './Icons.jsx'
import './Footer.css'

const serviceIcons = {
  wrench: IconWrench,
  return: IconReturn,
  swap: IconSwap,
  truck: IconTruck,
  pin: IconPin,
}

export default function Footer() {
  return (
    <footer className="footer" id="service">
      <div className="container footer__services">
        {serviceItems.map(({ icon, text }) => {
          const Icon = serviceIcons[icon]
          return (
            <div className="footer__service" key={text}>
              <Icon width={26} height={26} />
              <span>{text}</span>
            </div>
          )
        })}
      </div>

      <div className="container footer__main">
        <nav className="footer__columns" aria-label="页脚导航">
          {footerColumns.map((col) => (
            <div className="footer__column" key={col.title}>
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

        <div className="footer__hotline">
          <IconHeadset width={28} height={28} />
          <p className="footer__phone">{hotline.phone}</p>
          <p className="footer__hours">{hotline.hours}</p>
          <p className="footer__hours">{hotline.sub}</p>
          <div className="footer__buttons">
            <a className="footer__btn footer__btn--primary" href="#top">
              {hotline.buttons[0]}
            </a>
            <a className="footer__btn" href="#top">
              {hotline.buttons[1]}
            </a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span className="footer__wordmark">mi.com</span>
          <div className="footer__icp">
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
